import { useEffect } from 'react';

export default function useCursorDistortion() {
  useEffect(() => {
    if ('ontouchstart' in window) return;

    const cursor = document.createElement('div');
    Object.assign(cursor.style, {
      position: 'fixed',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(0,229,255,0.25) 0%, transparent 70%)',
      pointerEvents: 'none',
      zIndex: '9999',
      transform: 'translate(-50%, -50%)',
      transition: 'width 0.2s, height 0.2s',
      mixBlendMode: 'screen',
    });
    document.body.appendChild(cursor);

    const handleMouse = (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    const handleHover = (e) => {
      const target = e.target.closest('a, button, .interactive, .glass-card, .btn-primary, .btn-secondary');
      if (target) {
        cursor.style.width = '80px';
        cursor.style.height = '80px';
      } else {
        cursor.style.width = '40px';
        cursor.style.height = '40px';
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
