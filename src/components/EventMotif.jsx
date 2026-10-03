/* Single-glyph line emblems, one per event, in a shared 32×32 viewBox. They
   stroke `currentColor` so the page tints them however it chooses — the hero
   crest picks the accent, the wallpaper stamp dials the opacity way down. The
   glyphs are deliberately outline-only: a filled emblem would fight the hero
   title's own glow. Keys map to events in content.js via `eventMotifs`. */
import { MOTIFS } from '../lib/motifs.jsx';

export default function EventMotif({ motif = 'gear', size = 32, className, style }) {
  const mark = MOTIFS[motif] || MOTIFS.gear;

  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {mark}
    </svg>
  );
}