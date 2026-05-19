import type { ChangeEvent, RefObject } from 'react';
import { MAX_CHARS } from './scriptTranslator.types';

type Props = {
  text: string;
  isTranslating: boolean;
  uploadRef: RefObject<HTMLInputElement | null>;
  onTextChange: (v: string) => void;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export function ScriptTranslatorInput({
  text,
  isTranslating,
  uploadRef,
  onTextChange,
  onFileChange,
}: Props) {
  const trimmedLength = text.trim().length;
  const isOverLimit = trimmedLength > MAX_CHARS;

  return (
    <>
      {/* Textarea with subtle focus glow */}
      <div className="group relative overflow-hidden rounded-[4px] border border-[#2f2f2f] bg-[#121212] transition-[border-color,box-shadow,background-color] duration-300 focus-within:border-[#ff5a2f] focus-within:bg-[#141110] focus-within:shadow-[0_0_0_1px_rgba(255,90,47,0.35),0_0_16px_rgba(255,90,47,0.18)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[4px] bg-[radial-gradient(130%_110%_at_50%_50%,rgba(255,90,47,0.12),transparent_72%)] opacity-0 transition-opacity duration-300 group-focus-within:opacity-100"
        />
        <div className="relative z-10 m-[1px] rounded-[3px] bg-[#121212]">
          <textarea
            rows={8}
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            disabled={isTranslating}
            placeholder="Paste or write your script here, or upload a .txt file..."
            className="min-h-[160px] w-full resize-y border-0 bg-transparent p-2 text-xs text-[#f0ede8] placeholder:text-[#666666] outline-none transition-colors duration-200 focus:ring-0 disabled:opacity-60 sm:p-3 sm:text-sm"
          />
        </div>
      </div>

      {/* Character count */}
      <div className="mt-2 flex items-center justify-end gap-2">
        {isOverLimit && (
          <span className="text-[11px] font-medium text-red-400">
            Exceeds {MAX_CHARS} character limit
          </span>
        )}
        <span
          className={`rounded border px-2 py-0.5 text-[11px] font-semibold tabular-nums ${
            isOverLimit
              ? 'border-red-500/40 bg-red-500/10 text-red-300'
              : 'border-[#303030] bg-[#171717] text-[#9a9a9a]'
          }`}
        >
          {trimmedLength} / {MAX_CHARS}
        </span>
      </div>

      {/* Hidden file input */}
      <input
        ref={uploadRef}
        type="file"
        accept=".txt,text/plain"
        className="hidden"
        onChange={onFileChange}
      />
    </>
  );
}
