import{i as e,o as t}from"./framer-DZVMnmUz.js";import{r as n}from"./vendor-p8UJlKbX.js";var r=t(),i={accent:`'Ethnocentric', sans-serif`,display:`'Archivo', system-ui, sans-serif`,mono:`'Martian Mono', ui-monospace, monospace`,body:`'Inter Tight', system-ui, sans-serif`,bone:`#F2E4CC`,sandLight:`#E8C89A`,blue:`#00A8E8`,white:`#F2F7FA`},a={fontVariationSettings:`'wdth' 125`},o={fontVariationSettings:`'wdth' 112.5`},s=`
.hv2 *:focus-visible,
.hv2-cta:focus-visible {
  outline: 2px solid ${i.blue};
  outline-offset: 3px;
}
.hv2-cta {
  font-family: ${i.mono};
  font-variation-settings: 'wdth' 112.5;
  font-size: 0.68rem;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 0.95rem 2.1rem;
  border: 1px solid ${i.blue};
  color: ${i.blue};
  background: rgba(0, 20, 32, 0.28);
  backdrop-filter: blur(3px);
  text-decoration: none;
  display: inline-block;
  border-radius: 1px;
  transition: background 0.25s cubic-bezier(0.22, 1, 0.36, 1),
              color 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}
.hv2-cta:hover {
  background: ${i.blue};
  color: #04121A;
}
.hv2-cta--ghost {
  border-color: rgba(242, 228, 204, 0.3);
  color: ${i.bone};
  background: rgba(24, 15, 10, 0.24);
}
.hv2-cta--ghost:hover {
  background: rgba(242, 228, 204, 0.1);
  color: ${i.bone};
}

/* Symmetric readout strip. Flanking panels only work in an asymmetric
   layout; centered, they read as an accident. One centred strip with
   hairline dividers keeps the Detroit precision without fighting the axis. */
.hv2-strip {
  display: flex;
  align-items: stretch;
  justify-content: center;
  flex-wrap: wrap;
  border-top: 1px solid rgba(0, 168, 232, 0.22);
  border-bottom: 1px solid rgba(0, 168, 232, 0.22);
  background: linear-gradient(180deg, rgba(0, 22, 34, 0.34), rgba(0, 14, 22, 0.14));
  backdrop-filter: blur(6px);
}
.hv2-cell {
  padding: 0.85rem 1.9rem;
  text-align: center;
  min-width: 0;
}
.hv2-cell + .hv2-cell {
  border-left: 1px solid rgba(0, 168, 232, 0.18);
}
.hv2-cell dt {
  font-family: ${i.mono};
  font-variation-settings: 'wdth' 112.5;
  font-size: 0.55rem;
  font-weight: 400;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  /* 0.62, up from 0.36. These labels sit lowest in the frame, over the
     brightest sand, and 0.36 measured 3.2:1 against the mean night value and
     2.5:1 against the bright 5% — a label nobody can read is just texture.
     0.62 takes it to 6.9 / 4.3. Weight up from 300 for the same reason:
     hairline mono at 0.55rem is the worst case for a thin colour. */
  color: rgba(242, 247, 250, 0.62);
  margin-bottom: 0.34rem;
}
.hv2-cell dd {
  font-family: ${i.mono};
  font-variation-settings: 'wdth' 112.5;
  font-size: 0.68rem;
  font-weight: 400;
  letter-spacing: 0.05em;
  color: ${i.white};
  margin: 0;
}
@media (max-width: 640px) {
  .hv2-cell { padding: 0.7rem 1.05rem; }
  .hv2-cell + .hv2-cell { border-left: none; }
}
@media (prefers-reduced-motion: reduce) {
  .hv2 * { animation: none !important; }
}
`;function c({side:e}){return(0,r.jsx)(`span`,{"aria-hidden":`true`,style:{display:`inline-block`,width:`clamp(18px, 5vw, 46px)`,height:1,background:e===`left`?`linear-gradient(to right, transparent, ${i.blue})`:`linear-gradient(to left, transparent, ${i.blue})`}})}function l({ready:t=!0}){let l=e=>({initial:{opacity:0,y:18},animate:t?{opacity:1,y:0}:{opacity:0,y:18},transition:{duration:.9,delay:e,ease:[.22,1,.36,1]}});return(0,r.jsxs)(`section`,{className:`hv2`,style:{position:`relative`,minHeight:`100vh`,display:`flex`,flexDirection:`column`,alignItems:`center`,justifyContent:`center`,textAlign:`center`,padding:`clamp(5.5rem, 13vh, 9rem) clamp(1.25rem, 4vw, 3rem) clamp(2rem, 6vh, 4rem)`,overflow:`hidden`},children:[(0,r.jsx)(`style`,{children:s}),(0,r.jsx)(`div`,{"aria-hidden":`true`,style:{position:`absolute`,inset:0,pointerEvents:`none`,background:`linear-gradient(to bottom, transparent 0%, transparent 48%, rgba(6,4,5,0.32) 63%, rgba(6,4,5,0.64) 100%)`}}),(0,r.jsxs)(`div`,{style:{position:`relative`,zIndex:1,width:`100%`,maxWidth:1e3,margin:`0 auto`},children:[(0,r.jsxs)(e.div,{...l(.15),style:{fontFamily:i.mono,...o,fontSize:`0.62rem`,fontWeight:500,letterSpacing:`0.24em`,textTransform:`uppercase`,color:i.blue,marginBottom:`1.8rem`,display:`flex`,alignItems:`center`,justifyContent:`center`,gap:`0.85rem`,textShadow:[`0 0 3px rgba(2,7,12,0.95)`,`0 0 3px rgba(2,7,12,0.95)`,`0 0 3px rgba(2,7,12,0.95)`,`0 0 6px rgba(2,7,12,0.85)`,`0 0 6px rgba(2,7,12,0.85)`,`0 0 12px rgba(2,7,12,0.55)`].join(`,`)},children:[(0,r.jsx)(c,{side:`left`}),(0,r.jsx)(`span`,{children:`VNIT Nagpur · Annual Technical Festival`}),(0,r.jsx)(c,{side:`right`})]}),(0,r.jsx)(e.h1,{...l(.25),style:{fontFamily:i.accent,fontWeight:400,fontSize:`clamp(2.5rem, 9.5vw, 8rem)`,lineHeight:1.02,letterSpacing:`0.2em`,textIndent:`0.1em`,textTransform:`uppercase`,color:i.bone,margin:0,textShadow:[`0 0 70px rgba(255,158,0,0.30)`,`0 0 28px rgba(255,154,60,0.18)`,`0 0 16px rgba(10,6,3,0.85)`,`0 2px 40px rgba(12,7,3,0.9)`].join(`,`)},children:`AXIS’27`}),(0,r.jsx)(e.p,{...l(.36),style:{fontFamily:i.display,...a,fontWeight:600,fontSize:`clamp(1.05rem, 2.35vw, 1.95rem)`,lineHeight:1.15,letterSpacing:`0.1em`,textIndent:`0.1em`,textTransform:`uppercase`,color:i.sandLight,margin:`1.5rem 0 0`,textShadow:`0 1px 16px rgba(10,6,3,0.9), 0 0 36px rgba(10,6,3,0.7)`},children:`Illuminating the Infinite`}),(0,r.jsx)(e.p,{...l(.5),style:{fontFamily:i.body,fontWeight:400,fontSize:`clamp(0.95rem, 1.25vw, 1.1rem)`,lineHeight:1.7,color:`rgba(242, 228, 204, 0.88)`,margin:`1.6rem auto 0`,maxWidth:`46ch`,textShadow:`0 1px 12px rgba(10,6,3,0.85)`},children:`Three days of events, workshops, exhibitions and performances on the VNIT campus.`}),(0,r.jsxs)(e.div,{...l(.6),style:{display:`flex`,gap:`0.9rem`,flexWrap:`wrap`,justifyContent:`center`,marginTop:`2.5rem`},children:[(0,r.jsx)(n,{to:`/events`,className:`hv2-cta`,children:`Browse events`}),(0,r.jsx)(n,{to:`/contact`,className:`hv2-cta hv2-cta--ghost`,children:`Contact us`})]}),(0,r.jsxs)(e.dl,{...l(.72),className:`hv2-strip`,style:{marginTop:`3.2rem`,marginBottom:0},children:[(0,r.jsxs)(`div`,{className:`hv2-cell`,children:[(0,r.jsx)(`dt`,{children:`Host`}),(0,r.jsx)(`dd`,{children:`VNIT Nagpur`})]}),(0,r.jsxs)(`div`,{className:`hv2-cell`,children:[(0,r.jsx)(`dt`,{children:`Coordinates`}),(0,r.jsx)(`dd`,{children:`21.1255° N / 79.0505° E`})]})]})]}),(0,r.jsxs)(e.div,{initial:{opacity:0},animate:{opacity:+!!t},transition:{duration:1.2,delay:1.15},style:{position:`absolute`,left:`50%`,transform:`translateX(-50%)`,bottom:`clamp(1.1rem, 3vh, 2rem)`,textAlign:`center`,fontFamily:i.mono,...o,fontSize:`0.52rem`,letterSpacing:`0.2em`,textIndent:`0.2em`,textTransform:`uppercase`,color:`rgba(242, 228, 204, 0.34)`},children:[(0,r.jsx)(`span`,{"aria-hidden":`true`,style:{display:`block`,width:1,height:42,margin:`0 auto 0.65rem`,background:`linear-gradient(to bottom, transparent, rgba(242,228,204,0.42))`}}),`Scroll`]})]})}export{l as t};