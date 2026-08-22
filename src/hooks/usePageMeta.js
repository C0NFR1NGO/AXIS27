import { useEffect } from 'react';

const DEFAULT_TITLE = "AXIS'27 — Central India's Largest Technical Fest | VNIT Nagpur";

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * usePageMeta — per-route document title + social meta.
 * Falls back to the index.html defaults when omitted.
 */
export default function usePageMeta({ title, description } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | AXIS'27 — VNIT Nagpur` : DEFAULT_TITLE;
    document.title = fullTitle;
    setMeta('property', 'og:title', fullTitle);
    setMeta('name', 'twitter:title', fullTitle);
    if (description) {
      setMeta('name', 'description', description);
      setMeta('property', 'og:description', description);
      setMeta('name', 'twitter:description', description);
    }
    if (typeof window !== 'undefined') {
      setMeta('property', 'og:url', window.location.href);
    }
  }, [title, description]);
}
