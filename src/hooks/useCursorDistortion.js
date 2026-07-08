import { useEffect } from 'react';

export default function useCursorDistortion() {
  useEffect(() => {
    if ('ontouchstart' in window) return;

    const cursor = document.createElement('div');
    Object.assign(cursor.style, {
      position: 'fixed',
      width: '44px',
      height: '44px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(0,229,255,0.22) 0%, rgba(0,136,255,0.1) 40%, transparent 70%)',
      border: '1px solid rgba(0,229,255,0.15)',
      pointerEvents: 'none',
      zIndex: '9999',
      transform: 'translate(-50%, -50%)',
      transition: 'width 0.3s var(--ease-cyber), height 0.3s var(--ease-cyber), opacity 0.3s var(--ease-cyber), border-color 0.3s var(--ease-cyber)',
      mixBlendMode: 'screen',
      boxShadow: '0 0 18px rgba(0,229,255,0.12), 0 0 36px rgba(0,229,255,0.05)',
    });
    document.body.appendChild(cursor);

    const handleMouse = (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    const handleHover = (e) => {
      const target = e.target.closest('a, button, .interactive, .glass-card, .btn-primary, .btn-secondary');
      if (target) {
        cursor.style.width = '78px';
        cursor.style.height = '78px';
        cursor.style.borderColor = 'rgba(229,169,60,0.3)';
      } else {
        cursor.style.width = '44px';
        cursor.style.height = '44px';
        cursor.style.borderColor = 'rgba(0,229,255,0.15)';
      }
    };

    document.addEventListener('mousemove', handleMouse);
    document.addEventListener('mouseover', handleHover);

    return () => {
      document.removeEventListener('mousemove', handleMouse);
      document.removeEventListener('mouseover', handleHover);
      cursor.remove();
    };
  }, []);
}