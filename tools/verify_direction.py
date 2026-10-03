#!/usr/bin/env python3
"""Static checks for the AXIS'27 design-direction files.

The sandbox has no JS parser and no GPU, so this cannot replace a real
build or a shader compile. It does catch the two classes of bug that are
easiest to introduce here and hardest to spot by eye:

  1. unbalanced delimiters in JSX (string/comment/template aware)
  2. GLSL uniforms or varyings that don't line up with the JS that feeds
     them, or varyings declared in one stage but not the other
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "src"
FILES = [
    ROOT / "components/DuneSea.jsx",
    ROOT / "components/DuneSeaFallback.jsx",
    ROOT / "components/HeroSectionV2.jsx",
    ROOT / "pages/HeroPreviewPage.jsx",
    ROOT / "pages/HomePage.jsx",
    ROOT / "App.jsx",
]

fails = []
warns = []


def strip_js(src):
    """Blank out strings, template literals and comments; keep delimiters.

    JSX text is not JS, so an apostrophe in `AXIS'27` is a literal
    character rather than a string opener. Heuristic: a quote only starts
    a string if the previous non-space character is somewhere a literal
    could legally begin.
    """
    STARTERS = set("=(,:[{;?&|!+-*/%<>\n") | {"r", "n"}  # r/n for return/in

    def is_string_start(src, i):
        j = i - 1
        while j >= 0 and src[j] in " \t":
            j -= 1
        if j < 0:
            return True
        prev = src[j]
        if prev in "=(,:[{;?&|!+*%\n":
            return True
        if prev == ">":          # JSX text region begins after a tag close
            return False
        if prev.isalnum() or prev in "_)]}":
            # `return '...'` / `typeof '...'` are the legitimate cases
            word = re.search(r"([A-Za-z_$]+)\s*$", src[:j + 1])
            return bool(word and word.group(1) in
                        {"return", "typeof", "case", "in", "of", "delete", "await"})
        return True

    out = []
    i, n = 0, len(src)
    while i < n:
        c = src[i]
        two = src[i:i + 2]
        if two == "//":
            j = src.find("\n", i)
            i = n if j == -1 else j
            continue
        if two == "/*":
            j = src.find("*/", i + 2)
            i = n if j == -1 else j + 2
            continue
        if c in "\"'":
            if not is_string_start(src, i):
                i += 1
                continue
            q, j = c, i + 1
            while j < n:
                if src[j] == "\\":
                    j += 2
                    continue
                if src[j] == q or src[j] == "\n":
                    break
                j += 1
            i = j + 1
            continue
        if c == "`":
            # Template literal: preserve ${...} since it holds real code.
            j = i + 1
            while j < n:
                if src[j] == "\\":
                    j += 2
                    continue
                if src[j] == "`":
                    break
                if src[j:j + 2] == "${":
                    depth, k = 1, j + 2
                    while k < n and depth:
                        if src[k] == "{":
                            depth += 1
                        elif src[k] == "}":
                            depth -= 1
                        k += 1
                    out.append(src[j + 2:k - 1])
                    j = k
                    continue
                j += 1
            i = j + 1
            continue
        out.append(c)
        i += 1
    return "".join(out)


def check_balance(path, src):
    code = strip_js(src)
    pairs = {")": "(", "]": "[", "}": "{"}
    stack, line = [], 1
    for ch in code:
        if ch == "\n":
            line += 1
        elif ch in "([{":
            stack.append((ch, line))
        elif ch in ")]}":
            if not stack or stack[-1][0] != pairs[ch]:
                fails.append(f"{path.name}: unexpected '{ch}' at line ~{line}")
                return
            stack.pop()
    if stack:
        ch, ln = stack[-1]
        fails.append(f"{path.name}: unclosed '{ch}' opened at line ~{ln}")


def glsl_blocks(src):
    """Pull out /* glsl */ `...` template literals by name.

    Also returns, per block, whether the literal terminated where a literal
    should terminate. A backtick anywhere inside — including in a comment,
    which is easy to type when quoting an identifier — silently closes the
    template literal early and turns the rest of the shader into JS. That is
    a hard build failure that reads as a perfectly innocent comment, so it
    is worth detecting explicitly.
    """
    blocks = {}
    ends = {}
    for m in re.finditer(r"const\s+(\w+)\s*=\s*/\*\s*glsl\s*\*/\s*`", src):
        name = m.group(1)
        i = m.end()
        depth_start = i
        while i < len(src):
            if src[i] == "\\":
                i += 2
                continue
            if src[i] == "`":
                break
            i += 1
        blocks[name] = src[depth_start:i]
        ends[name] = src[i + 1:i + 3]
    return blocks, ends


THREE_BUILTIN_UNIFORMS = {
    "modelMatrix", "modelViewMatrix", "projectionMatrix", "viewMatrix",
    "normalMatrix", "cameraPosition", "isOrthographic",
}

def check_glsl(path, src):
    blocks, ends = glsl_blocks(src)
    if not blocks:
        return

    # A shader literal must close with `; — anything else means a stray
    # backtick inside ended it early.
    for name, tail in ends.items():
        if not tail.strip().startswith(";"):
            fails.append(f"{path.name}:{name}: GLSL template literal ends at an "
                         f"unexpected backtick (followed by {tail!r}, expected ';') "
                         f"— a stray ` inside the shader closed it early")

    # Every shader stage needs an entry point. Catches a truncated block
    # even when its braces happen to balance.
    for name, body in blocks.items():
        if name.endswith(("_VERT", "_FRAG")) and "void main" not in body:
            fails.append(f"{path.name}:{name}: shader stage has no 'void main' "
                         f"— block is probably truncated")

    # Brace balance inside each shader
    for name, body in blocks.items():
        if body.count("{") != body.count("}"):
            fails.append(f"{path.name}:{name}: GLSL brace imbalance "
                         f"({body.count('{')} open vs {body.count('}')} close)")

    # Inline any ${NOISE_GLSL}-style interpolation so shared helpers count.
    resolved = {}
    for name, body in blocks.items():
        r = body
        for other in blocks:
            r = r.replace("${" + other + "}", blocks[other])
        resolved[name] = r

    # Uniform declarations vs the JS uniforms objects present in the file
    js_uniform_keys = set(re.findall(r"^\s*(u[A-Z]\w*)\s*:\s*\{\s*value", src, re.M))
    for name, body in resolved.items():
        declared = set(re.findall(r"uniform\s+\w+\s+(\w+)\s*;", body))
        for u in sorted(declared):
            if u in THREE_BUILTIN_UNIFORMS:
                continue
            if u not in js_uniform_keys:
                fails.append(f"{path.name}:{name}: uniform '{u}' declared in GLSL "
                             f"but never supplied from JS")

    # ...and the reverse. A JS uniform no shader declares is dead weight, and
    # after a rewrite it usually means a renamed uniform left a stale key
    # behind — the sibling of the error above, which would otherwise be the
    # only direction checked.
    all_glsl = "\n".join(resolved.values())
    glsl_declared = set(re.findall(r"uniform\s+\w+\s+(\w+)\s*;", all_glsl))
    for u in sorted(js_uniform_keys):
        if u not in glsl_declared:
            warns.append(f"{path.name}: JS supplies uniform '{u}' that no "
                         f"shader declares")

    # A varying declared in a vertex stage must actually be written there.
    # Declaring it in both stages and forgetting the assignment leaves the
    # fragment reading uninitialised memory, which no brace or name check
    # would notice and which looks like a shading bug rather than a typo.
    for name, body in resolved.items():
        if not name.endswith("_VERT"):
            continue
        for v in sorted(set(re.findall(r"varying\s+\w+\s+(\w+)\s*;", body))):
            if not re.search(r"\b" + re.escape(v) + r"\s*(\.\w+)?\s*=[^=]", body):
                fails.append(f"{path.name}:{name}: varying '{v}' is declared "
                             f"but never assigned in the vertex stage")

    # Varyings must exist in both stages of each pair
    stages = {}
    for name, body in resolved.items():
        m = re.match(r"(\w+?)_(VERT|FRAG)$", name)
        if m:
            stages.setdefault(m.group(1), {})[m.group(2)] = body
    for prefix, s in stages.items():
        if "VERT" not in s or "FRAG" not in s:
            continue
        v = set(re.findall(r"varying\s+\w+\s+(\w+)\s*;", s["VERT"]))
        f = set(re.findall(r"varying\s+\w+\s+(\w+)\s*;", s["FRAG"]))
        for missing in sorted(f - v):
            fails.append(f"{path.name}:{prefix}: fragment reads varying "
                         f"'{missing}' that the vertex stage never declares")
        for unused in sorted(v - f):
            warns.append(f"{path.name}:{prefix}: varying '{unused}' declared in "
                         f"vertex but unused in fragment")

    # Attributes must be supplied via setAttribute
    for name, body in resolved.items():
        attrs = set(re.findall(r"attribute\s+\w+\s+(a\w*)\s*;", body))
        for a in sorted(attrs):
            if f"'{a}'" not in src and f'"{a}"' not in src:
                fails.append(f"{path.name}:{name}: attribute '{a}' never "
                             f"registered with setAttribute")


def check_imports(path, src):
    """Flag named imports that appear nowhere else in the file."""
    for m in re.finditer(r"import\s*\{([^}]+)\}\s*from\s*['\"]([^'\"]+)['\"]", src):
        for raw in m.group(1).split(","):
            name = raw.split(" as ")[-1].strip()
            if not name:
                continue
            body = src[:m.start()] + src[m.end():]
            if not re.search(r"\b" + re.escape(name) + r"\b", body):
                warns.append(f"{path.name}: import '{name}' from "
                             f"'{m.group(2)}' appears unused")


# Anything the runtime provides, plus JS keywords. Deliberately not exhaustive
# for the whole language — only wide enough to cover these five files, so an
# unfamiliar global shows up as a warning to be triaged rather than silently
# passing.
GLOBALS = {
    "window", "document", "navigator", "console", "Math", "Date", "JSON",
    "Object", "Array", "String", "Number", "Boolean", "Float32Array",
    "Uint16Array", "Uint32Array", "Set", "Map", "Promise", "Error", "RegExp",
    "requestAnimationFrame", "cancelAnimationFrame", "setTimeout",
    "clearTimeout", "setInterval", "clearInterval", "performance", "isNaN",
    "parseFloat", "parseInt", "undefined", "NaN", "Infinity", "globalThis",
    "localStorage", "sessionStorage", "fetch", "URL", "Image", "React",
}
KEYWORDS = {
    "const", "let", "var", "function", "return", "if", "else", "for", "while",
    "do", "switch", "case", "default", "break", "continue", "new", "delete",
    "typeof", "instanceof", "in", "of", "this", "null", "true", "false",
    "class", "extends", "super", "import", "export", "from", "as", "try",
    "catch", "finally", "throw", "async", "await", "yield", "void", "static",
    "get", "set",
}


def check_orphan_comment_lines(path, src):
    """Catch a block-comment continuation line that is no longer in a comment.

    This exists because it happened twice in one sitting, both times the same
    way: an edit anchored on a chunk of code plus the first line of the comment
    that followed it, and the replacement rebuilt the code but not the comment
    opener. What is left is a bare ' * arrhythmic, so the drift runs...' at top
    level, which vite reports as 'Unexpected token' pointing at the asterisk —
    accurate, and completely opaque as to cause.

    Detection is easy once framed right: strip_js removes real comments, so any
    surviving line that begins with '*' was never inside one. Also flags an
    unterminated /*, which is the opposite failure and swallows the rest of the
    file instead of orphaning a line.
    """
    if src.count("/*") > src.count("*/"):
        fails.append(f"{path.name}: unterminated /* — {src.count('/*')} openers "
                     f"vs {src.count('*/')} closers; everything after the last "
                     f"one is being swallowed as a comment")
    for i, line in enumerate(strip_js(src).splitlines(), 1):
        s = line.strip()
        if s.startswith("*") and not s.startswith("**"):
            fails.append(f"{path.name}: line {i} starts with '*' outside any "
                         f"comment — a '/*' opener was probably deleted: "
                         f"{s[:58]!r}")


def check_undefined_refs(path, src):
    """Flag functions that are CALLED but never declared, imported or global.

    Added after a real miss: a rewrite that inserted new shader blocks quietly
    deleted `const lin`, which every entry in PALETTE calls. Every structural
    check above still passed — braces balanced, uniforms matched, literals
    closed — because none of them resolve names. The file was a guaranteed
    ReferenceError on import, i.e. a white screen, and it looked clean.

    Scope is deliberately narrow: only identifiers in call position, `name(`.
    The first version of this checked every identifier and produced 188
    findings, all false, because JSX text is not code — 'Illuminating the
    Infinite' parses as three undeclared variables, and no amount of patching
    fixes that without a real JSX parser. Call position has almost none of
    that ambiguity, and it is where the bug class lives anyway: a deleted or
    renamed helper is always invoked somewhere.

    Still not a scope analyser. It asks only whether a name is declared
    anywhere in the file, so use-before-declaration and cross-function leaks
    are invisible. The bug it catches is a name declared nowhere at all.
    """
    code = strip_js(src)

    declared = set(GLOBALS) | set(KEYWORDS)
    for m in re.finditer(r"import\s+([^;]+?)\s+from", code):
        declared.update(re.findall(r"[A-Za-z_$][\w$]*", m.group(1)))
    # declarations, including destructured object and array patterns
    for m in re.finditer(r"\b(?:const|let|var)\s+([\{\[]?[^=;\n]*?)\s*[=;]", code):
        declared.update(re.findall(r"[A-Za-z_$][\w$]*", m.group(1)))
    # for (const x of ...) has no '=' and no ';' before the newline
    for m in re.finditer(r"\b(?:const|let|var)\s+(\w+)\s+(?:of|in)\b", code):
        declared.add(m.group(1))
    for m in re.finditer(r"\bfunction\s+([A-Za-z_$][\w$]*)", code):
        declared.add(m.group(1))
    # parameter lists: function decls, parenthesised arrows, bare `x =>`, catch
    for pat in (r"\bfunction\s*[A-Za-z_$\w]*\s*\(([^)]*)\)",
                r"\(([^()]*)\)\s*=>",
                r"\bcatch\s*\(([^)]*)\)"):
        for m in re.finditer(pat, code):
            declared.update(re.findall(r"[A-Za-z_$][\w$]*", m.group(1)))
    for m in re.finditer(r"(?:^|[=(,{[|&:?\s])([A-Za-z_$][\w$]*)\s*=>", code, re.M):
        declared.add(m.group(1))

    seen = {}
    # No whitespace allowed between the name and the paren. That one character
    # is what separates a call from JSX prose: nobody writes `lin ('#fff')`,
    # but the HUD readouts are full of 'ENCRYPTED (TLS 1.3)' and
    # '32.4°C (OPTIMAL)', which are the last three false positives this check
    # produced and are now correctly ignored.
    for m in re.finditer(r"([.?]?)([A-Za-z_$][\w$]*)\(", code):
        if m.group(1):                      # obj.method() / obj?.method()
            continue
        name = m.group(2)
        if name in declared:
            continue
        seen.setdefault(name, code[:m.start()].count("\n") + 1)

    for name, line in sorted(seen.items(), key=lambda kv: kv[1]):
        fails.append(f"{path.name}: '{name}()' is called at line ~{line} but is "
                     f"never declared, imported or a known global")


for p in FILES:
    if not p.exists():
        fails.append(f"MISSING: {p}")
        continue
    s = p.read_text(encoding="utf-8")
    check_balance(p, s)
    check_glsl(p, s)
    check_imports(p, s)
    check_orphan_comment_lines(p, s)
    check_undefined_refs(p, s)

print("=" * 62)
for w in warns:
    print(f"  warn  {w}")
if warns:
    print("-" * 62)
if fails:
    for f in fails:
        print(f"  FAIL  {f}")
    print(f"\n{len(fails)} problem(s) found.")
    sys.exit(1)
print(f"  All structural checks passed ({len(FILES)} files).")
print("=" * 62)
