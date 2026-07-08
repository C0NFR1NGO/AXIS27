import { useEffect, useRef } from 'react';

export default function useGlitch(intensity = 1) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let timeout;

    const trigger = () => {
      const duration = 120 + Math.random() * 180;
      const offsetX = (Math.random() - 0.5) * 6 * intensity;
      const offsetY = (Math.random() - 0.5) * 3 * intensity;

      // DBH software instability: red + cyan glitch artifact
      el.style.textShadow = `
        ${offsetX}px ${offsetY}px var(--cyber-red),
        ${-offsetX}px ${-offsetY}px var(--spice-blue)
      `;
      el.style.clipPath = `inset(${Math.random() * 20}% 0 ${Math.random() * 20}% 0)`;
      el.style.transform = `translateX(${(Math.random() - 0.5) * 2}px)`;

      timeout = setTimeout(() => {
        el.style.textShadow = 'none';
        el.style.clipPath = 'none';
        el.style.transform = 'none';
        const next = 2500 + Math.random() * 7000;
        timeout = setTimeout(trigger, next);
      }, duration);
    };

    timeout = setTimeout(trigger, 1500 + Math.random() * 3500);

    return () => clearTimeout(timeout);
  }, [intensity]);

  return ref;
}