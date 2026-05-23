// ─── Constants ────────────────────────────────────────────────────────────────

export const MAX_CHARS        = 100_000;
export const DEFAULT_CHUNK_SIZE = 1000;  // chars per chunk (by-chars mode)
export const DEFAULT_NUM_PARTS  = 5;     // number of parts  (by-parts mode)
export const OVERLAP_CHARS      = 100;   // overlap tail appended to non-last chunks

// ─── Types ────────────────────────────────────────────────────────────────────

export type SplitMode = 'by-chars' | 'by-parts';
