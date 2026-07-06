import { useEffect, useRef } from 'react';

export default function useGlitch(intensity = 1) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let timeout;

    const trigger = () => {
      const duration = 150 + Math.random() * 200;
      const offsetX = (Math.random() - 0.5) * 4 * intensity;
      const offsetY = (Math.random() - 0.5) * 2 * intensity;

      el.style.textShadow = `
        ${offsetX}px ${offsetY}px var(--glitch-red),
        ${-offsetX}px ${-offsetY}px var(--cyan)
      `;
      el.style.clipPath = `inset(${Math.random() * 20}% 0 ${Math.random() * 20}% 0)`;

      timeout = setTimeout(() => {
        el.style.textShadow = 'none';
        el.style.clipPath = 'none';
        const next = 3000 + Math.random() * 8000;
        timeout = setTimeout(trigger, next);
      }, duration);
    };

    timeout = setTimeout(trigger, 2000 + Math.random() * 4000);

    return () => clearTimeout(timeout);
  }, [intensity]);

  return ref;
}
