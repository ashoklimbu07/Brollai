import { useEffect, useRef, useState } from 'react';
import { Check, ClipboardCopy, FileText, Trash2, Upload, X } from 'lucide-react';
import { WorkspaceLayout } from '../../workspace/WorkspaceLayout';
import { PromptCard } from './PromptCard';
import { parsePrompts } from './promptParser.utils';
import { ConfirmModal } from '../ManualStory/ConfirmModal';

// ─── Session memory ───────────────────────────────────────────────────────────

const SS_INPUT    = 'promptparser:input';
const SS_FILENAME = 'promptparser:filename';

/** Persists a string value in sessionStorage — survives page refresh, cleared on tab close. */
function useSessionState(key: string, initial = ''): [string, (v: string) => void] {
  const [value, setValue] = useState<string>(() => {
    try { return sessionStorage.getItem(key) ?? initial; } catch { return initial; }
  });
  useEffect(() => {
    try { sessionStorage.setItem(key, value); } catch { /* quota / private-mode */ }
  }, [key, value]);
  return [value, setValue];
}

export function PromptParserPage() {
  const [inputText, setInputText]   = useSessionState(SS_INPUT);
  const [fileName,  setFileName]    = useSessionState(SS_FILENAME);
  const [prompts,       setPrompts]       = useState<string[]>([]);
  const [copiedIdx,     setCopiedIdx]     = useState<number | null>(null);
  const [copiedAll,     setCopiedAll]     = useState(false);
  const [expandedIdx,   setExpandedIdx]   = useState<Set<number>>(new Set());
  const [error,         setError]         = useState<string | null>(null);
  const [showClearModal, setShowClearModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── actions ────────────────────────────────────────────────────────────────

  function handleParse() {
    setError(null);
    const result = parsePrompts(inputText);
    if (result.length === 0) {
      setError('No prompts found. Make sure prompts are separated by a blank line.');
      return;
    }
    setPrompts(result);
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setInputText(text);
      const result = parsePrompts(text);
      if (result.length === 0) {
        setError('No prompts found in the file.');
      } else {
        setPrompts(result);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  async function handleCopy(text: string, idx: number) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      window.setTimeout(() => setCopiedIdx((prev) => (prev === idx ? null : prev)), 1400);
    } catch {
      setError('Clipboard access denied. Please copy manually.');
    }
  }

  async function handleCopyAll() {
    try {
      await navigator.clipboard.writeText(prompts.join('\n\n'));
      setCopiedAll(true);
      window.setTimeout(() => setCopiedAll(false), 1400);
    } catch {
      setError('Clipboard access denied.');
    }
  }

  function handleClear() {
    setInputText('');
    setFileName('');
    setPrompts([]);
    setError(null);
    setExpandedIdx(new Set());
  }

  function toggleExpand(idx: number) {
    setExpandedIdx((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  }

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <WorkspaceLayout>
      <section className="h-full w-full overflow-y-auto border border-[#222222] bg-[#111111] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:p-6 md:p-8 lg:p-10">

        {/* Header */}
        <div className="mb-6">
          <h1 className="font-['Bebas_Neue'] text-[28px] tracking-[1px] sm:text-[36px] lg:text-[40px]">
            Prompt Parser
          </h1>
          <p className="mt-1 text-sm leading-5 text-[#8a8a8a]">
            Paste a raw prompt block or upload a <span className="text-[#cccccc]">.txt</span> / <span className="text-[#cccccc]">.json</span> file. Each blank-line-separated section is extracted into its own card — ready to copy or review individually.
          </p>
        </div>

        <div className="space-y-5">

          {/* Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase tracking-[2px] text-[#666666]">Input</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded border border-[#2f2f2f] bg-[#1a1a1a] px-3 py-1.5 text-xs text-[#aaaaaa] transition-colors hover:border-[#444] hover:text-[#f0ede8]"
                >
                  <Upload size={12} /> Upload file
                </button>
                <input ref={fileInputRef} type="file" accept=".txt,.json" className="hidden" onChange={handleFileUpload} />

                {(inputText || prompts.length > 0) && (
                  <button
                    type="button"
                    onClick={() => setShowClearModal(true)}
                    className="inline-flex items-center gap-1.5 rounded border border-[#2f2f2f] bg-[#1a1a1a] px-3 py-1.5 text-xs text-[#888888] transition-colors hover:border-red-900/60 hover:text-red-400"
                  >
                    <Trash2 size={12} /> Clear
                  </button>
                )}
              </div>
            </div>

            {/* File pill */}
            {fileName && (
              <div className="inline-flex items-center gap-2 rounded-full border border-[#2a2a2a] bg-[#161616] px-3 py-1 text-xs text-[#888888]">
                <FileText size={11} />
                {fileName}
                <button
                  type="button"
                  onClick={() => { setFileName(''); setInputText(''); setPrompts([]); }}
                  className="ml-1 text-[#555] hover:text-[#aaa]"
                >
                  <X size={10} />
                </button>
              </div>
            )}

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={"Paste prompt blocks here, separated by a blank line…\n\nEach block will become its own card.\nOr upload a .txt / .json file above."}
              rows={10}
              className="w-full resize-y rounded border border-[#2f2f2f] bg-[#161616] px-3 py-3 font-mono text-sm text-[#f0ede8] placeholder-[#444444] outline-none transition-colors focus:border-[#ff5a2f]"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="rounded border border-red-900/40 bg-red-950/30 px-3 py-2 text-xs text-red-400">
              {error}
            </p>
          )}

          {/* Parse */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleParse}
              disabled={!inputText.trim()}
              className="inline-flex items-center gap-2 rounded border border-[#e8380d] bg-[#e8380d] px-6 py-2.5 text-sm font-semibold uppercase tracking-[0.7px] text-white transition-colors hover:bg-[#ff4d20] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Parse Prompts
            </button>
            {prompts.length > 0 && (
              <span className="text-xs text-[#666666]">
                {prompts.length} prompt{prompts.length !== 1 ? 's' : ''} found
              </span>
            )}
          </div>

          {/* Results */}
          {prompts.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#222222] pb-3">
                <p className="text-xs uppercase tracking-[2px] text-[#666666]">
                  Results — {prompts.length} prompt{prompts.length !== 1 ? 's' : ''}
                </p>
                <button
                  type="button"
                  onClick={() => void handleCopyAll()}
                  className="inline-flex items-center gap-1.5 rounded border border-[#2f2f2f] bg-[#1a1a1a] px-3 py-1.5 text-xs text-[#aaaaaa] transition-colors hover:border-[#444] hover:text-[#f0ede8]"
                >
                  {copiedAll ? (
                    <><Check size={12} className="text-green-400" /> Copied All</>
                  ) : (
                    <><ClipboardCopy size={12} /> Copy All</>
                  )}
                </button>
              </div>

              <div className="space-y-1.5">
                {prompts.map((prompt, idx) => (
                  <PromptCard
                    key={idx}
                    prompt={prompt}
                    idx={idx}
                    isExpanded={expandedIdx.has(idx)}
                    isCopied={copiedIdx === idx}
                    onToggle={() => toggleExpand(idx)}
                    onCopy={() => void handleCopy(prompt, idx)}
                  />
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Clear confirmation */}
      <ConfirmModal
        open={showClearModal}
        title="Clear everything?"
        body="This will remove your input and all parsed prompts. Session memory will also be wiped. This cannot be undone."
        cancelLabel="Cancel"
        confirmLabel="Yes, Clear"
        tone="danger"
        onCancel={() => setShowClearModal(false)}
        onConfirm={() => {
          setShowClearModal(false);
          handleClear();
        }}
      />

    </WorkspaceLayout>
  );
}
