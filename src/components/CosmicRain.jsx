import { useEffect, useRef } from 'react';

/* The eldoraui HackerBackground, implemented for the cosmic pages.

   A full-screen canvas where one random katakana glyph falls down each column
   every frame, leaving a fading trail. The trail is the accumulating
   rgba(0,0,0,0.03) wash, which builds into the component's own dark ground —
   the authentic hacker-wallpaper look. The fade sits below the registry's 0.05
   so the trails persist longer and the rain reads denser. Matches the registry
   prop surface exactly (color, fontSize, speed, className):

     color    — glyph colour. #05f0e4 (cyan) per the user.
     fontSize — glyph size in px; 8 per the demo, a dense matrix.
     speed    — rows fallen per frame; 0.6 per the user, a calm drift.
     className— extra classes on the canvas. Tailwind's opacity-N utilities
                are honoured inline, since this project loads no Tailwind.

   Adapted only where the site requires it: React 19 .jsx, aria-hidden,
   pointer-events none, canvas sized from its parent, glyphs measured so the
   wide Martian Mono advance spaces columns correctly, and a fade-in from
   transparency on first paint. The rain always falls — like the rest of the
   site's worlds it stays alive behind prefers-reduced-motion. */

const KATAKANA_START = 0x30a0;
const KATAKANA_COUNT = 96;

export default function CosmicRain({
  color = '#05f0e4',
  fontSize = 8,
  speed = 0.6,
  className = '',
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.style.opacity = '0';
    canvas.style.pointerEvents = 'none';
    const context = canvas.getContext('2d');
    if (!context) return;

    const opacityMatch = /(?:^|\s)opacity-(\d{1,3})(?:\s|$)/.exec(className);
    const finalOpacity = opacityMatch
      ? Math.min(1, parseInt(opacityMatch[1], 10) / 100)
      : 1;

    const fs = Math.max(4, Math.round(fontSize) || 8);
    const rate = Math.max(0.1, Number(speed) || 1);

    let animationFrameId = 0;
    let columns = 0;
    let colW = fs;
    let drops = [];

    const initializeCanvas = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width));
      canvas.height = Math.max(1, Math.round(rect.height));
      context.font = `${fs}px 'Martian Mono', monospace`;
      const w = context.measureText('0').width;
      colW = w > 0 ? w : fs * 0.62;
      columns = Math.ceil(canvas.width / colW);
      drops = Array.from(
        { length: columns },
        () => Math.floor((Math.random() * canvas.height) / fs),
      );
    };

    const draw = () => {
      context.fillStyle = 'rgba(0, 0, 0, 0.03)';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = color;
      context.font = `${fs}px 'Martian Mono', monospace`;

      for (let i = 0; i < columns; i++) {
        const char = String.fromCharCode(KATAKANA_START + Math.random() * KATAKANA_COUNT);
        context.fillText(char, i * colW, drops[i] * fs);

        if (drops[i] * fs > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i] += rate;
      }

      canvas.style.opacity = String(finalOpacity);
      animationFrameId = requestAnimationFrame(draw);
    };

    const handleResize = () => {
      cancelAnimationFrame(animationFrameId);
      initializeCanvas();
      draw();
    };

    initializeCanvas();
    draw();
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [color, fontSize, speed, className]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    />
  );
}
