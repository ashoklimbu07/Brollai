import { useState } from 'react';
import { Copy, Download, Check, ChevronDown, ChevronUp, Sparkles, Languages } from 'lucide-react';
import { downloadSingleChunk } from './scriptSplitter.utils';

// How many characters to show in the collapsed preview
const PREVIEW_CHARS = 220;

type ChunkCardProps = {
  chunk: string;
  index: number;
  total: number;
  /** Expected main-body size (chars), used to calculate the overlap tail length. */
  charsEach: number;
  onSendToBroll: (text: string) => void;
  onSendToTranslator: (text: string) => void;
};

export function ScriptSplitterChunkCard({
  chunk,
  index,
  total,
  charsEach,
  onSendToBroll,
  onSendToTranslator,
}: ChunkCardProps) {
  const [copied,   setCopied]   = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Overlap tail = chars beyond the expected main-body size (non-last chunks only)
  const overlapLen = index < total - 1 ? Math.max(0, chunk.length - charsEach) : 0;

  const isLong    = chunk.length > PREVIEW_CHARS;
  const displayText = isLong && !expanded
    ? chunk.slice(0, PREVIEW_CHARS) + '…'
    : chunk;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(chunk);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch { /* clipboard unavailable — silently ignore */ }
  };

  return (
    <div className="flex flex-col gap-3 border border-[#2a2a2a] bg-[#0f0f0f] p-4">

      {/* ── Top row: part badge + char count + copy/download ── */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="border border-[#e8380d]/40 bg-[#e8380d]/10 px-2 py-0.5 text-[10px] uppercase tracking-[2px] text-[#e8380d]">
            Part {index + 1}/{total}
          </span>
          <span className="text-[11px] text-[#555555]">
            {chunk.length.toLocaleString()} chars
            {overlapLen > 0 && (
              <span className="ml-1 text-[#3a3a3a]">(+{overlapLen} overlap)</span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void handleCopy()}
            title="Copy to clipboard"
            className="inline-flex items-center gap-1.5 border border-[#2a2a2a] bg-[#181818] px-2.5 py-1 text-[11px] text-[#aaaaaa] transition-colors hover:border-[#e8380d]/40 hover:text-[#e8380d]"
          >
            {copied ? <Check size={11} /> : <Copy size={11} />}
            {copied ? 'Copied' : 'Copy'}
          </button>

          <button
            type="button"
            onClick={() => downloadSingleChunk(chunk, index + 1)}
            title="Download this part as .txt"
            className="inline-flex items-center gap-1.5 border border-[#2a2a2a] bg-[#181818] px-2.5 py-1 text-[11px] text-[#aaaaaa] transition-colors hover:border-[#3a3a3a] hover:text-[#f0ede8]"
          >
            <Download size={11} />
            .txt
          </button>
        </div>
      </div>

      {/* ── Send-to row ── */}
      <div className="flex flex-wrap items-center gap-2 border-t border-[#1e1e1e] pt-3">
        <span className="text-[10px] uppercase tracking-[2px] text-[#3a3a3a]">Send to</span>

        <button
          type="button"
          onClick={() => onSendToBroll(chunk)}
          title="Load this chunk into Generate B-roll"
          className="inline-flex items-center gap-1.5 border border-[#e8380d]/25 bg-[#e8380d]/10 px-3 py-1 text-[11px] text-[#e8380d]/80 transition-colors hover:border-[#e8380d]/50 hover:bg-[#e8380d]/15 hover:text-[#e8380d]"
        >
          <Sparkles size={11} />
          Generate B-roll
        </button>

        <button
          type="button"
          onClick={() => onSendToTranslator(chunk)}
          title="Load this chunk into Script Translator"
          className="inline-flex items-center gap-1.5 border border-[#2a2a2a] bg-[#181818] px-3 py-1 text-[11px] text-[#aaaaaa] transition-colors hover:border-[#3a3a3a] hover:text-[#f0ede8]"
        >
          <Languages size={11} />
          Translator
        </button>
      </div>

      {/* ── Chunk text ── */}
      <p className="whitespace-pre-wrap break-words text-[13px] leading-6 text-[#cccccc]">
        {displayText}
      </p>

      {/* Expand / collapse for long chunks */}
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded(v => !v)}
          className="inline-flex w-fit items-center gap-1 text-[11px] text-[#555555] transition-colors hover:text-[#aaaaaa]"
        >
          {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
}
