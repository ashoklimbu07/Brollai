import { useEffect, useState } from 'react';
import { DEFAULT_CHUNK_SIZE, DEFAULT_NUM_PARTS } from './scriptSplitter.types';
import type { SplitMode } from './scriptSplitter.types';

// ─── sessionStorage keys ──────────────────────────────────────────────────────

const SS_SCRIPT     = 'splitter:script';
const SS_MODE       = 'splitter:mode';
const SS_CHUNK_SIZE = 'splitter:chunkSize';
const SS_NUM_PARTS  = 'splitter:numParts';

// ─── Generic session-backed state ────────────────────────────────────────────

/**
 * Drop-in useState replacement that persists to sessionStorage.
 * Survives page refreshes; cleared when the tab is closed.
 */
function useSessionState(key: string, initial: string): [string, (v: string) => void] {
  const [value, setValue] = useState<string>(() => {
    try { return sessionStorage.getItem(key) ?? initial; } catch { return initial; }
  });

  useEffect(() => {
    try { sessionStorage.setItem(key, value); } catch { /* quota / private-mode — silently ignore */ }
  }, [key, value]);

  return [value, setValue];
}

// ─── Named hooks for each persisted field ────────────────────────────────────

export function useScriptState()     { return useSessionState(SS_SCRIPT, ''); }
export function useModeState()       { return useSessionState(SS_MODE, 'by-chars') as [SplitMode, (v: SplitMode) => void]; }
export function useChunkSizeState()  { return useSessionState(SS_CHUNK_SIZE, String(DEFAULT_CHUNK_SIZE)); }
export function useNumPartsState()   { return useSessionState(SS_NUM_PARTS,  String(DEFAULT_NUM_PARTS)); }
