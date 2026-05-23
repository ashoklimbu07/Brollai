import { OVERLAP_CHARS } from './scriptSplitter.types';

// ─── Core split logic ─────────────────────────────────────────────────────────

/**
 * Splits `text` into `numChunks` equal parts.
 *
 * Algorithm:
 *   charsEach = ceil(total / numChunks)   ← equal distribution
 *
 * Each non-last chunk is extended by OVERLAP_CHARS then snapped forward to
 * the nearest sentence end (. ! ?) so context is never cut mid-sentence.
 */
export function splitIntoChunks(text: string, numChunks: number): string[] {
  const trimmed = text.trim();
  if (!trimmed || numChunks < 1) return [];

  const total     = trimmed.length;
  const charsEach = Math.ceil(total / numChunks);
  const chunks: string[] = [];

  for (let i = 0; i < numChunks; i++) {
    const start   = i * charsEach;
    const hardEnd = Math.min(start + charsEach, total);

    // Last chunk: no overlap, take the rest as-is
    if (i === numChunks - 1) {
      chunks.push(trimmed.slice(start).trim());
      continue;
    }

    // Extend by overlap then snap to nearest sentence terminator
    const overlapEnd  = Math.min(hardEnd + OVERLAP_CHARS, total);
    const searchSlice = trimmed.slice(overlapEnd, Math.min(overlapEnd + 200, total));
    const sentenceIdx = searchSlice.search(/[.!?]/);
    const snappedEnd  = sentenceIdx !== -1
      ? overlapEnd + sentenceIdx + 1  // include the punctuation char
      : overlapEnd;

    chunks.push(trimmed.slice(start, snappedEnd).trim());
  }

  return chunks.filter(Boolean);
}

// ─── Download helpers ─────────────────────────────────────────────────────────

export function downloadSingleChunk(chunk: string, partNumber: number): void {
  const blob = new Blob([chunk], { type: 'text/plain' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `script-part-${partNumber}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadAllChunks(chunks: string[]): void {
  const content = chunks
    .map((c, i) => `=== Part ${i + 1} / ${chunks.length} ===\n\n${c}`)
    .join('\n\n' + '─'.repeat(60) + '\n\n');

  const blob = new Blob([content], { type: 'text/plain' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'script-all-parts.txt';
  a.click();
  URL.revokeObjectURL(url);
}
