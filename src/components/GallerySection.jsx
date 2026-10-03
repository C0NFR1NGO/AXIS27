import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { galleryItems } from '../data/content';

const ease = [0.22, 1, 0.36, 1];

function spanClass(span) {
  if (span === 'large') return 'gallery-item--col2 gallery-item--row2';
  if (span === 'wide') return 'gallery-item--col2';
  if (span === 'tall') return 'gallery-item--row2';
  return '';
}

function GalleryTile({ item, onOpen }) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div className={`gallery-item gallery-item--fallback ${spanClass(item.span)}`} role="img" aria-label={item.alt}>
        <span className="gallery-item__code">IMG // OFFLINE</span>
      </div>
    );
  }

  // The click hands the button element up along with the id: the parent needs the real
  // trigger node to restore focus to when the lightbox closes, and only the click knows
  // which tile it was.
  return (
    <button
      type="button"
      className={`gallery-item ${spanClass(item.span)}`}
      onClick={(e) => onOpen(item.id, e.currentTarget)}
      aria-label={`Open photo: ${item.alt}`}
    >
      <img src={item.src} alt={item.alt} loading="lazy" onError={() => setErrored(true)} />
    </button>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function ArrowIcon({ dir }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {dir === 'prev' ? (
        <>
          <path d="m15 18-6-6 6-6" />
          <path d="M9 12h12" />
        </>
      ) : (
        <>
          <path d="m9 18 6-6-6-6" />
          <path d="M15 12H3" />
        </>
      )}
    </svg>
  );
}

export default function GallerySection() {
  const [activeIndex, setActiveIndex] = useState(null);
  const lightboxRef = useRef(null);
  // The tile that opened the lightbox, captured in its own click handler. Reading
  // document.activeElement inside the effect instead (keyed on activeIndex) meant that by the
  // time the lightbox closed, the "originating" element was whichever lightbox button had
  // last been focused — so focus was restored into a subtree that was already unmounting and
  // landed on <body>.
  const triggerRef = useRef(null);
  const reduce = useReducedMotion();
  const activeItem = activeIndex === null ? null : galleryItems[activeIndex];
  const isOpen = activeIndex !== null;

  // Keyed on open/closed, not on activeIndex: arrowing between photos must not tear down and
  // re-run the open/close side effects, or the restore below would fire on every step.
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e) => {
      if (e.key === 'Escape') setActiveIndex(null);
      if (e.key === 'ArrowLeft') setActiveIndex((i) => (i - 1 + galleryItems.length) % galleryItems.length);
      if (e.key === 'ArrowRight') setActiveIndex((i) => (i + 1) % galleryItems.length);
    };

    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    lightboxRef.current?.focus();

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      triggerRef.current?.focus?.();
    };
  }, [isOpen]);

  const openFrom = (id, el) => {
    triggerRef.current = el;
    setActiveIndex(galleryItems.findIndex((g) => g.id === id));
  };

  const prev = () => setActiveIndex((activeIndex - 1 + galleryItems.length) % galleryItems.length);
  const next = () => setActiveIndex((activeIndex + 1) % galleryItems.length);

  return (
    <>
      <div className="gallery-grid" style={{ width: '100%', maxWidth: '1060px', margin: '0 auto' }}>
        {galleryItems.map((item) => (
          <GalleryTile key={item.id} item={item} onOpen={openFrom} />
        ))}
      </div>

      <AnimatePresence>
        {activeItem && (
          <motion.div
            ref={lightboxRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={`${activeItem.alt}. Press Escape to close.`}
            className="gallery-lightbox"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.25, ease }}
          >
            <motion.button
              type="button"
              className="gallery-lightbox__close"
              onClick={() => setActiveIndex(null)}
              aria-label="Close photo"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1, ease }}
            >
              <CloseIcon />
            </motion.button>

            <button type="button" className="gallery-lightbox__nav gallery-lightbox__nav--prev" onClick={prev} aria-label="Previous photo">
              <ArrowIcon dir="prev" />
            </button>
            <button type="button" className="gallery-lightbox__nav gallery-lightbox__nav--next" onClick={next} aria-label="Next photo">
              <ArrowIcon dir="next" />
            </button>

            <AnimatePresence mode="wait">
              <motion.figure
                key={activeItem.id}
                className="gallery-lightbox__frame"
                initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.3, ease }}
              >
                <img src={activeItem.src} alt={activeItem.alt} />
                <figcaption className="gallery-lightbox__caption">
                  <span className="gallery-lightbox__index">
                    {String(activeIndex + 1).padStart(2, '0')} / {String(galleryItems.length).padStart(2, '0')}
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
