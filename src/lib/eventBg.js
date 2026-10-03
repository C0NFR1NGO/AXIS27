/* Category lays out the page furniture: blueprint is the engineering spec
   sheet (facts strip + wide panels), dossier adds a sticky facts rail for the
   briefing-style categories, stage widens the prizes into a spectacle ranking.
   Per-event overrides live in `eventLayoutOverrides` in content.js.

   The old four-layer event backdrop system (gradient sky, texture, motif
   stamp, seam glow) was replaced with a route-driven living world in App.jsx:
   dune sea for warm categories (management, construction, devise), cosmic field
   for cool ones. This file now only carries the layout defaults. */

export const LAYOUT_DEFAULTS = {
  robotics: 'blueprint',
  software: 'blueprint',
  construction: 'blueprint',
  management: 'dossier',
  devise: 'dossier',
  'igniting-minds': 'dossier',
  esports: 'stage',
};
