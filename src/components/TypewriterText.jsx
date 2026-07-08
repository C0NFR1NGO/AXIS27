import { useEffect, useState } from 'react';

export default function TypewriterText({ text, speed = 36 }) {
  const [visible, setVisible] = useState('');

  useEffect(() => {
    let i = 0;
    setVisible('');
    const interval = setInterval(() => {
      if (i < text.length) {
        setVisible(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return <>{visible}</>;
}