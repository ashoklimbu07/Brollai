import { ArrowRightLeft, Upload } from 'lucide-react';
import { TRANSLATION_TEMPLATES, type TranslationDirection } from './scriptTranslator.types';

type Props = {
  selectedDirection: TranslationDirection | null;
  isTranslating: boolean;
  canTranslate: boolean;
  onUploadClick: () => void;
  onSelectDirection: (d: TranslationDirection) => void;
  onTranslate: () => void;
  onCancel: () => void;
};

export function ScriptTranslatorToolbar({
  selectedDirection,
  isTranslating,
  canTranslate,
  onUploadClick,
  onSelectDirection,
  onTranslate,
  onCancel,
}: Props) {
  return (
    <div className="mt-3 space-y-3 border-t border-[#252525] pt-3">

      {/* Upload + disclaimer */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onUploadClick}
          disabled={isTranslating}
          className="inline-flex items-center gap-1.5 border border-[#252525] bg-[#1e1e1e] px-3 py-1.5 text-xs font-medium text-[#888888] transition-colors hover:text-[#f0ede8] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Upload size={14} />
          Upload TXT
        </button>
        <p className="text-[11px] text-[#555555]">AI can make mistakes. Always review your script.</p>
      </div>

      {/* Direction cards + translate button on same row */}
      <div className="flex flex-wrap items-center gap-3">
        <p className="w-full text-[10px] uppercase tracking-[.8px] text-[#666666]">Translation Direction</p>

        {TRANSLATION_TEMPLATES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelectDirection(t.id)}
            disabled={isTranslating}
            className={`flex items-center gap-2 rounded border px-3 py-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              selectedDirection === t.id
                ? 'border-[#e8380d] bg-[#e8380d]/12'
                : 'border-[#2e2e2e] bg-[#161616] hover:border-[#e8380d]/60'
            }`}
          >
            <span className="text-xs font-semibold text-[#f0ede8]">{t.from}</span>
            <ArrowRightLeft size={11} className="shrink-0 text-[#666666]" />
            <span className="text-xs font-semibold text-[#f0ede8]">{t.to}</span>
          </button>
        ))}

        {/* Translate / Cancel pushed to the right */}
        <div className="ml-auto flex items-center gap-2">
          {isTranslating && (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center justify-center gap-1.5 border border-[#252525] bg-[#1e1e1e] px-4 py-2 text-xs font-semibold uppercase tracking-[.6px] text-[#f0ede8] transition-colors hover:border-[#ff4d20]"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={onTranslate}
            disabled={!canTranslate}
            className="inline-flex min-w-[160px] items-center justify-center gap-2 border border-[#e8380d] bg-[#e8380d] px-6 py-2.5 text-sm font-semibold uppercase tracking-[.7px] text-white transition-colors hover:border-[#ff4d20] hover:bg-[#ff4d20] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowRightLeft size={14} />
            {isTranslating ? 'Translating...' : 'Translate'}
          </button>
        </div>
      </div>
    </div>
  );
}
