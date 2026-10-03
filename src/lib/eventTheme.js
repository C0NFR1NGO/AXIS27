/* Event page theming — strict category palettes. Two flavours:
   warm / Dune (management, construction, devise) and
   cool / Detroit (software, robotics, igniting minds, esports).
   Per-event identity lives in the grid pattern and tagline; colour stays
   category-driven so the governing rule (controls cold, world warm) never
   bends at the event level. */

const PALETTES = {
  cool: {
    accent:  '#00a8e8',
    glow:    'rgba(0,168,232,0.32)',
    dim:     'rgba(0,168,232,0.06)',
    grid:    'rgba(0,240,255,0.045)',
  },
  warm: {
    accent:  '#ff9e00',
    glow:    'rgba(255,158,0,0.32)',
    dim:     'rgba(255,158,0,0.06)',
    grid:    'rgba(255,158,0,0.045)',
  },
};

const WARM_IDS = new Set(['management', 'construction', 'devise']);

export function categoryPalette(categoryId) {
  return WARM_IDS.has(categoryId) ? 'warm' : 'cool';
}

export function getPalette(categoryId) {
  return PALETTES[categoryPalette(categoryId)];
}

export function resolveEventTheme(category, event) {
  const palette = getPalette(category.id);
  return {
    ...palette,
    pattern: event.theme?.grid || 'default',
    tagline: event.tagline || category.subtitle,
  };
}

export function themeVars(resolved) {
  return {
    '--event-accent':      resolved.accent,
    '--event-accent-glow': resolved.glow,
    '--event-accent-dim':  resolved.dim,
    '--event-grid':        resolved.grid,
  };
}
