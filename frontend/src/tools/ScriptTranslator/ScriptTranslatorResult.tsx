import { Copy, Download, Eye, Sparkles, Trash2, X } from 'lucide-react';

type Props = {
  translatedText: string;
  copied: boolean;
  previewOpen: boolean;
  onPreviewOpen: () => void;
  onPreviewClose: () => void;
  onCopy: () => void;
  onDownload: () => void;
  onSendToBroll: () => void;
  onDeleteClick: () => void;
};

export function ScriptTranslatorResult({
  translatedText,
  copied,
  previewOpen,
  onPreviewOpen,
  onPreviewClose,
  onCopy,
  onDownload,
  onSendToBroll,
  onDeleteClick,
}: Props) {
  if (!translatedText) return null;

  return (
    <>
      {/* Compact result strip */}
      <div className="mt-4 flex items-center gap-2 rounded border border-[#1e2e1e] bg-[#0f1a0f] px-3 py-2">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-400" />
        <span className="text-[11px] font-medium text-green-400">Translation ready</span>
        <span className="text-[11px] tabular-nums text-[#555555]">
          · {translatedText.trim().length} chars
        </span>

        <button
          type="button"
          onClick={onPreviewOpen}
          className="ml-2 inline-flex items-center gap-1 rounded border border-[#252525] bg-[#1e1e1e] px-2 py-1 text-[11px] text-[#888888] transition-colors hover:text-[#f0ede8]"
        >
          <Eye size={11} />
          Preview
        </button>

        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex items-center gap-1 rounded border border-[#252525] bg-[#1e1e1e] px-2 py-1 text-[11px] text-[#888888] transition-colors hover:text-[#f0ede8]"
          >
            <Copy size={11} />
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            type="button"
            onClick={onDownload}
            className="inline-flex items-center gap-1 rounded border border-[#252525] bg-[#1e1e1e] px-2 py-1 text-[11px] text-[#888888] transition-colors hover:text-[#f0ede8]"
          >
            <Download size={11} />
            Download
          </button>
          <button
            type="button"
            onClick={onSendToBroll}
            title="Use this translation as input for Generate B-roll"
            className="inline-flex items-center gap-1 rounded border border-[#e8380d]/60 bg-[#1e1e1e] px-2 py-1 text-[11px] text-[#e8380d] transition-colors hover:bg-[#e8380d]/10"
          >
            <Sparkles size={11} />
            Generate B-roll
          </button>
          <button
            type="button"
            onClick={onDeleteClick}
            title="Delete translation output"
            className="inline-flex items-center gap-1 rounded border border-red-900/50 bg-[#1a1010] px-2 py-1 text-[11px] text-red-400 transition-colors hover:bg-[#241313]"
          >
            <Trash2 size={11} />
          </button>
        </div>
      </div>

      {/* Preview modal */}
      {previewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={onPreviewClose}
        >
          <div
            className="relative w-full max-w-2xl rounded-md border border-[#2a2a2a] bg-[#0e0e0e] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#1e1e1e] px-4 py-3">
              <div className="flex items-center gap-2">
                <Eye size={13} className="text-[#888888]" />
                <span className="text-xs font-semibold text-[#f0ede8]">Translation Preview</span>
                <span className="text-[11px] text-[#555555]">{translatedText.trim().length} chars</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onCopy}
                  className="inline-flex items-center gap-1 rounded border border-[#252525] bg-[#1a1a1a] px-2 py-1 text-[11px] text-[#888888] transition-colors hover:text-[#f0ede8]"
                >
                  <Copy size={11} />
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  type="button"
                  onClick={onDownload}
                  className="inline-flex items-center gap-1 rounded border border-[#252525] bg-[#1a1a1a] px-2 py-1 text-[11px] text-[#888888] transition-colors hover:text-[#f0ede8]"
                >
                  <Download size={11} />
                  Download
                </button>
                <button
                  type="button"
                  onClick={onPreviewClose}
                  aria-label="Close preview"
                  className="ml-1 inline-flex items-center justify-center rounded border border-[#252525] bg-[#1a1a1a] p-1 text-[#888888] transition-colors hover:text-[#f0ede8]"
                >
                  <X size={13} />
                </button>
              </div>
            </div>
            <div className="max-h-[60vh] overflow-y-auto px-4 py-4">
              <pre className="whitespace-pre-wrap text-xs leading-relaxed text-[#d0ccc6] sm:text-sm">
                {translatedText}
              </pre>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
