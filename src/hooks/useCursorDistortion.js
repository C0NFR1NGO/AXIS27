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

    const trail = document.createElement('div');
    Object.assign(trail.style, {
      position: 'fixed',
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      background: 'rgba(0,229,255,0.08)',
      filter: 'blur(4px)',
      pointerEvents: 'none',
      zIndex: '9998',
      transform: 'translate(-50%, -50%)',
      transition: 'width 0.3s var(--ease-cyber), height 0.3s var(--ease-cyber), background 0.3s var(--ease-cyber)',
    });
    document.body.appendChild(trail);

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let trailX = targetX;
    let trailY = targetY;
    let hovering = false;
    let animId;

    const lerp = (a, b, t) => a + (b - a) * t;

    const animateTrail = () => {
      trailX = lerp(trailX, targetX, 0.12);
      trailY = lerp(trailY, targetY, 0.12);
      trail.style.left = `${trailX}px`;
      trail.style.top = `${trailY}px`;
      animId = requestAnimationFrame(animateTrail);
    };
    animId = requestAnimationFrame(animateTrail);

    const handleMouse = (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const handleHover = (e) => {
      const target = e.target.closest('a, button, .interactive, .glass-card, .btn-primary, .btn-secondary');
      if (target) {
        if (!hovering) {
          hovering = true;
          cursor.style.width = '72px';
          cursor.style.height = '72px';
          cursor.style.borderColor = 'rgba(229,169,60,0.3)';
          trail.style.width = '40px';
          trail.style.height = '40px';
          trail.style.background = 'rgba(201,145,26,0.08)';
        }
      } else {
        if (hovering) {
          hovering = false;
          cursor.style.width = '40px';
          cursor.style.height = '40px';
          cursor.style.borderColor = 'rgba(0,229,255,0.15)';
          trail.style.width = '24px';
          trail.style.height = '24px';
          trail.style.background = 'rgba(0,229,255,0.08)';
        }
      }
    };

    document.addEventListener('mousemove', handleMouse);
    document.addEventListener('mouseover', handleHover);

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener('mousemove', handleMouse);
      document.removeEventListener('mouseover', handleHover);
      cursor.remove();
      trail.remove();
    };
  }, []);
}