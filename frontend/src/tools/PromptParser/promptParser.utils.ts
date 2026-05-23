// ─── JSON helpers ────────────────────────────────────────────────────────────

/**
 * Try to extract top-level JSON objects from a raw string.
 * Handles both JSON arrays and concatenated {...} blocks.
 */
function tryParseJsonPrompts(raw: string): string[] | null {
  const trimmed = raw.trim();

  if (trimmed.startsWith('[')) {
    try {
      const arr = JSON.parse(trimmed) as unknown[];
      if (Array.isArray(arr) && arr.length > 0) {
        return arr.map((item) => JSON.stringify(item, null, 2));
      }
    } catch {
      // fall through to block extraction
    }
  }

  // Extract individual {...} blocks via brace-depth tracking
  const blocks: string[] = [];
  let depth = 0;
  let start = -1;

  for (let i = 0; i < trimmed.length; i++) {
    const ch = trimmed[i];
    if (ch === '{') {
      if (depth === 0) start = i;
      depth++;
    } else if (ch === '}') {
      depth--;
      if (depth === 0 && start !== -1) {
        const block = trimmed.slice(start, i + 1);
        try {
          blocks.push(JSON.stringify(JSON.parse(block) as unknown, null, 2));
        } catch {
          blocks.push(block);
        }
        start = -1;
      }
    }
  }

  return blocks.length > 0 ? blocks : null;
}

/**
 * Split raw input into individual prompt strings.
 * - JSON content → extract objects.
 * - Plain text → split on blank lines.
 */
export function parsePrompts(raw: string): string[] {
  const trimmed = raw.trim();
  if (!trimmed) return [];

  if (trimmed.includes('{')) {
    const jsonBlocks = tryParseJsonPrompts(trimmed);
    if (jsonBlocks && jsonBlocks.length > 0) return jsonBlocks;
  }

  return trimmed.split(/\n\s*\n+/).map((p) => p.trim()).filter(Boolean);
}

// ─── scene extraction ────────────────────────────────────────────────────────

/**
 * Pull the value of any top-level "scene"-named key from a prompt.
 * Tries JSON first, falls back to "scene: ..." plain-text line.
 */
export function extractScene(prompt: string): string | null {
  try {
    const obj = JSON.parse(prompt) as Record<string, unknown>;
    if (obj && typeof obj === 'object') {
      for (const [k, v] of Object.entries(obj)) {
        if (k.toLowerCase().includes('scene') && typeof v === 'string' && v.trim()) {
          return v.trim();
        }
      }
    }
  } catch {
    for (const line of prompt.split('\n')) {
      const colonIdx = line.indexOf(':');
      if (colonIdx < 1) continue;
      const key = line.slice(0, colonIdx).trim().toLowerCase();
      if (key === 'scene') {
        const val = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, '');
        if (val) return val;
      }
    }
  }
  return null;
}
