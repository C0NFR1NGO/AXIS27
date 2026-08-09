import { useEffect, useRef, useState } from 'react';

const CHARS = '!<>-_\\/[]{}—=+*^?#________';

export default function TextScramble({ text, className, startDelay = 0, active = true, ...rest }) {
  const [display, setDisplay] = useState('');
  const frameRef = useRef(0);
  const rafRef = useRef(null);
  const timerRef = useRef(null);
  const queueRef = useRef([]);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!active || doneRef.current) return;
    const queue = [];
    for (let i = 0; i < text.length; i++) {
      const from = display[i] || '';
      const to = text[i] || '';
      const start = Math.floor(Math.random() * 30);
      const end = start + Math.floor(Math.random() * 30) + 10;
      queue.push({ from, to, start, end });
    }
    queueRef.current = queue;
    frameRef.current = 0;

    const update = () => {
      let output = '';
      let complete = 0;
      const frame = frameRef.current;
      for (let i = 0; i < queueRef.current.length; i++) {
        const item = queueRef.current[i];
        if (frame >= item.end) {
          complete++;
          output += item.to;
        } else if (frame >= item.start) {
          if (!item.char || Math.random() < 0.28) {
            item.char = CHARS[Math.floor(Math.random() * CHARS.length)];
          }
          output += item.char;
        } else {
          output += item.from;
        }
      }
      setDisplay(output);
      if (complete === queueRef.current.length) {
        doneRef.current = true;
        return;
      }
      frameRef.current++;
      rafRef.current = requestAnimationFrame(update);
    };

    if (startDelay > 0) {
      timerRef.current = setTimeout(() => {
        rafRef.current = requestAnimationFrame(update);
      }, startDelay);
    } else {
      rafRef.current = requestAnimationFrame(update);
    }

    return () => {
      clearTimeout(timerRef.current);
      cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, startDelay, active]);

  return (
    <span className={className} {...rest} aria-label={text}>
      {display || '\u00A0'}
    </span>
  );
}
