import { Check, ChevronDown, ChevronUp, ClipboardCopy } from 'lucide-react';
import { extractScene } from './promptCleaner.utils';

type Props = {
  prompt: string;
  idx: number;
  isExpanded: boolean;
  isCopied: boolean;
  onToggle: () => void;
  onCopy: () => void;
};

export function PromptCard({ prompt, idx, isExpanded, isCopied, onToggle, onCopy }: Props) {
  const scene = extractScene(prompt);
  // Fall back to first non-empty line if no scene field found
  const summary = scene ?? prompt.split('\n').find((l) => l.trim()) ?? '';

  return (
    <div className="rounded border border-[#1e1e1e] bg-[#141414] transition-colors hover:border-[#2a2a2a]">

      {/* Collapsed row */}
      <div className="flex items-center gap-3 px-3 py-2.5">
        {/* Index badge */}
        <span className="shrink-0 rounded bg-[#1e1e1e] px-1.5 py-0.5 text-[10px] uppercase tracking-[2px] text-[#555555]">
          #{idx + 1}
        </span>

        {/* Scene summary */}
        <span className="min-w-0 flex-1 truncate text-xs text-[#e0ddd8]" title={summary}>
          {summary}
        </span>

        {/* Action buttons */}
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex items-center gap-1 rounded border border-[#2a2a2a] bg-[#1a1a1a] px-2 py-1 text-[10px] text-[#888] transition-colors hover:border-[#444] hover:text-[#f0ede8]"
          >
            {isCopied ? (
              <><Check size={10} className="text-green-400" /> Copied</>
            ) : (
              <><ClipboardCopy size={10} /> Copy</>
            )}
          </button>
          <button
            type="button"
            onClick={onToggle}
            className="inline-flex items-center gap-1 rounded border border-[#2a2a2a] bg-[#1a1a1a] px-2 py-1 text-[10px] text-[#888] transition-colors hover:border-[#444] hover:text-[#f0ede8]"
          >
            {isExpanded ? (
              <><ChevronUp size={10} /> Hide</>
            ) : (
              <><ChevronDown size={10} /> Preview</>
            )}
          </button>
        </div>
      </div>

      {/* Expanded preview */}
      {isExpanded && (
        <div className="border-t border-[#1e1e1e] px-3 pb-3 pt-2">
          <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-[#d0cdc8]">
            {prompt}
          </pre>
        </div>
      )}
    </div>
  );
}
