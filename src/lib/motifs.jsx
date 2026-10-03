/* The motif glyph library. Twenty-six line emblems, each a JSX group inside
   the shared 32×32 viewBox that EventMotif.jsx wraps. One per event —
   see the `eventMotifs` map in content.js for the assignment. Drawn by hand
   to the brief "an action keeps its name": combat is an X clash, water is
   two wave lines, cipher is a key, court is a pitch circle. */
export const MOTIFS = {
  combat: (
    <g>
      <path d="M6 6l20 20M26 6L6 26" />
      <circle cx="16" cy="16" r="3" />
    </g>
  ),
  water: (
    <g>
      <path d="M3 10c3-3 6-3 9 0s6 3 9 0 6-3 9 0" />
      <path d="M3 18c3-3 6-3 9 0s6 3 9 0 6-3 9 0" />
    </g>
  ),
  speed: (
    <g>
      <path d="M5 9l7 7-7 7M16 9l7 7-7 7" />
    </g>
  ),
  court: (
    <g>
      <circle cx="16" cy="16" r="11" />
      <path d="M16 5v22" />
      <circle cx="16" cy="16" r="1.6" />
    </g>
  ),
  air: (
    <g>
      <circle cx="8" cy="8" r="3" />
      <circle cx="24" cy="8" r="3" />
      <circle cx="8" cy="24" r="3" />
      <circle cx="24" cy="24" r="3" />
      <path d="M8 8l8 8m0-8l8 8m-8 0l8 8m-8-8l-8 8" />
    </g>
  ),
  gear: (
    <g>
      <circle cx="16" cy="16" r="6" />
      <path d="M16 2v5M16 25v5M2 16h5M25 16h5M7 7l3.5 3.5M21.5 21.5l3.5 3.5M25 7l-3.5 3.5M10.5 21.5l-3.5 3.5" />
    </g>
  ),
  code: (
    <g>
      <path d="M12 5L5 16l7 11M20 5l7 11-7 11" />
    </g>
  ),
  moon: (
    <g>
      <path d="M20 4A13 13 0 1 0 28 20 11 11 0 0 1 20 4z" />
    </g>
  ),
  ai: (
    <g>
      <circle cx="7" cy="16" r="4" />
      <circle cx="25" cy="9" r="4" />
      <circle cx="25" cy="23" r="4" />
      <path d="M11 14l10-3M11 18l10 3" />
    </g>
  ),
  cipher: (
    <g>
      <circle cx="11" cy="11" r="7" />
      <path d="M16 16l9 9M21 21l3-3M17 25l3-3" />
    </g>
  ),
  flag: (
    <g>
      <path d="M7 3v26M7 3h13l-4 5 4 5H7" />
    </g>
  ),
  globe: (
    <g>
      <circle cx="16" cy="16" r="12" />
      <path d="M16 4v24M4 16h24M7 8c6 3 13 3 18 0M7 24c6-3 13-3 18 0" />
    </g>
  ),
  trade: (
    <g>
      <path d="M5 27V10M12 27v-13M19 27v-7M26 27v-18M4 29h24" />
      <path d="M21 4c3 1 5 3 6 6" />
    </g>
  ),
  scale: (
    <g>
      <path d="M4 9h24M16 9v17M7 9v4a3 3 0 0 0 6 0V9M25 9v4a3 3 0 0 0 6 0V9" />
    </g>
  ),
  beam: (
    <g>
      <path d="M2 16h28M9 9l-4 7 4 7M23 9l4 7-4 7" />
    </g>
  ),
  matrix: (
    <g>
      <rect x="6" y="6" width="20" height="20" />
      <rect x="10" y="10" width="12" height="12" />
      <rect x="14" y="14" width="4" height="4" />
    </g>
  ),
  mystery: (
    <g>
      <circle cx="13" cy="13" r="9" />
      <path d="M20 20l8 8" />
    </g>
  ),
  rocket: (
    <g>
      <path d="M16 2c3 4 5 8 5 12l-3 2c1 3 2 7 2 10h-8c0-3 1-7 2-10l-3-2c0-4 2-8 5-12z" />
      <circle cx="16" cy="10" r="2" />
    </g>
  ),
  fabricate: (
    <g>
      <path d="M16 2l12 7v14l-12 7-12-7V9z" />
      <circle cx="16" cy="16" r="4" />
    </g>
  ),
  focus: (
    <g>
      <circle cx="16" cy="16" r="12" />
      <path d="M16 4v24M4 16h24M7 7l18 18M25 7L7 25" />
    </g>
  ),
  bridge: (
    <g>
      <path d="M4 26h24M4 26v-7a12 12 0 0 1 24 0v7M11 26v-6M16 26v-6M21 26v-6" />
    </g>
  ),
  atom: (
    <g>
      <ellipse cx="16" cy="16" rx="13" ry="5" transform="rotate(-30 16 16)" />
      <ellipse cx="16" cy="16" rx="13" ry="5" transform="rotate(30 16 16)" />
      <circle cx="16" cy="16" r="2.4" fill="currentColor" stroke="none" />
    </g>
  ),
  spark: (
    <g>
      <path d="M18 2l-8 14h6l-2 14 10-16h-6z" />
    </g>
  ),
  doc: (
    <g>
      <path d="M8 3h11l5 5v21H8z" />
      <path d="M19 3v6h5M12 14h8M12 19h8" />
    </g>
  ),
  game: (
    <g>
      <rect x="3" y="10" width="26" height="12" rx="6" />
      <path d="M9 13v6M6 16h6" />
      <circle cx="20" cy="14" r="1.6" />
      <circle cx="24" cy="18" r="1.6" />
    </g>
  ),
  party: (
    <g>
      <circle cx="7" cy="10" r="1.6" />
      <circle cx="24" cy="8" r="1.3" />
      <circle cx="15" cy="24" r="1.1" />
      <path d="M4 22l4-7M21 21l-2 6M16 6l2 5M26 18l3 3" />
    </g>
  ),
};