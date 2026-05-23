import { useState, useRef, type ChangeEvent } from 'react';
import { Scissors, Upload, Download, Trash2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { WorkspaceLayout } from '../../workspace/WorkspaceLayout';
import { ConfirmModal } from '../ManualStory/ConfirmModal';
import { ScriptSplitterChunkCard } from './ScriptSplitterChunkCard';
import { useScriptState, useModeState, useChunkSizeState, useNumPartsState } from './scriptSplitter.hooks';
import { splitIntoChunks, downloadAllChunks } from './scriptSplitter.utils';
import { MAX_CHARS, DEFAULT_CHUNK_SIZE, DEFAULT_NUM_PARTS, OVERLAP_CHARS } from './scriptSplitter.types';
import type { SplitMode } from './scriptSplitter.types';

export function ScriptSplitterPage() {
  // ── Persisted state (survives refresh) ──────────────────────────────────
  const [script,         setScript]         = useScriptState();
  const [mode,           setMode]           = useModeState();
  const [chunkSizeInput, setChunkSizeInput] = useChunkSizeState();
  const [numPartsInput,  setNumPartsInput]  = useNumPartsState();

  // ── Ephemeral state ──────────────────────────────────────────────────────
  const [chunks,         setChunks]         = useState<string[]>([]);
  const [error,          setError]          = useState<string | null>(null);
  const [showClearModal, setShowClearModal] = useState(false);

  const uploadRef = useRef<HTMLInputElement | null>(null);
  const navigate  = useNavigate();

  // ── Derived values ───────────────────────────────────────────────────────

  const scriptLen   = script.trim().length;
  const isOverLimit = script.length > MAX_CHARS;

  // Parse inputs — fall back to defaults if invalid
  const chunkSize = Math.max(100, parseInt(chunkSizeInput, 10) || DEFAULT_CHUNK_SIZE);
  const numParts  = Math.max(2,   parseInt(numPartsInput,  10) || DEFAULT_NUM_PARTS);

  const resolvedNumChunks: number = (() => {
    if (!scriptLen) return 0;
    return mode === 'by-parts' ? numParts : Math.ceil(scriptLen / chunkSize);
  })();

  const resolvedCharsEach = resolvedNumChunks > 0
    ? Math.ceil(scriptLen / resolvedNumChunks)
    : 0;

  // Validation flags
  const chunkTooLarge = mode === 'by-chars' && scriptLen > 0 && chunkSize >= scriptLen;
  const tooManyParts  = mode === 'by-parts' && scriptLen > 0 && numParts > scriptLen;
  const onePart       = mode === 'by-parts' && numParts === 1;

  const canSplit =
    scriptLen > 0 &&
    !isOverLimit &&
    !chunkTooLarge &&
    !tooManyParts &&
    !onePart &&
    (mode === 'by-chars' ? chunkSize >= 100 : numParts >= 2);

  // Live estimate shown before splitting
  const estimateLine: string | null = (() => {
    if (!scriptLen || !canSplit) return null;
    if (mode === 'by-chars') {
      return `${scriptLen.toLocaleString()} chars ÷ ${chunkSize.toLocaleString()} = ~${resolvedNumChunks} parts (~${resolvedCharsEach.toLocaleString()} chars each)`;
    }
    return `${scriptLen.toLocaleString()} chars ÷ ${numParts} parts = ~${resolvedCharsEach.toLocaleString()} chars each`;
  })();

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScript(await file.text());
    setChunks([]);
    setError(null);
    e.target.value = '';
  };

  const handleModeSwitch = (next: SplitMode) => {
    setMode(next);
    setChunks([]);
    setError(null);
  };

  const handleSplit = () => {
    setError(null);
    if (!scriptLen) {
      setError('Nothing to split — paste or upload a script first.');
      return;
    }
    setChunks(splitIntoChunks(script, resolvedNumChunks));
  };

  // Write chunk to localStorage → navigate to Generate B-roll
  const handleSendToBroll = (text: string) => {
    try { localStorage.setItem('broll_script', text); } catch { /* ignore */ }
    navigate('/tools/generate');
  };

  // Write chunk to sessionStorage → navigate to Script Translator
  const handleSendToTranslator = (text: string) => {
    try { sessionStorage.setItem('scriptwriter:text', text); } catch { /* ignore */ }
    navigate('/script-translator');
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <WorkspaceLayout>
      <section className="h-full w-full overflow-y-auto border border-[#222222] bg-[#111111] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:p-6 md:p-8 lg:p-10">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center border border-[#e8380d]/30 bg-[#e8380d]/10">
              <Scissors size={18} className="text-[#e8380d]" />
            </div>
            <div>
              <h1 className="font-['Bebas_Neue'] text-[28px] tracking-[1px] sm:text-[36px] lg:text-[40px]">
                Script Splitter
              </h1>
              <p className="mt-1 text-sm leading-5 text-[#8a8a8a]">
                Split by character size or by a fixed number of equal parts.
                Each chunk gets a <span className="text-[#cccccc]">{OVERLAP_CHARS}-char overlap</span> tail so context is never cut mid-sentence.
              </p>
            </div>
          </div>

          {(script || chunks.length > 0) && (
            <button
              type="button"
              onClick={() => setShowClearModal(true)}
              className="inline-flex shrink-0 items-center gap-1.5 border border-red-900/60 bg-[#1a1010] px-3 py-1.5 text-xs font-medium text-red-300 transition-colors hover:bg-[#241313]"
            >
              <Trash2 size={14} />
              Clear
            </button>
          )}
        </div>

        {/* Textarea */}
        <div className="relative mb-5">
          <textarea
            value={script}
            onChange={(e) => {
              setScript(e.target.value);
              if (chunks.length > 0) setChunks([]);
            }}
            placeholder="Paste your script here…"
            rows={10}
            className="w-full resize-none border border-[#2a2a2a] bg-[#0d0d0d] px-4 py-3 text-[13px] leading-6 text-[#e0ddd8] placeholder-[#444444] outline-none transition-colors focus:border-[#3a3a3a]"
          />
          <span className={`absolute bottom-3 right-4 text-[11px] tabular-nums ${isOverLimit ? 'text-red-400' : 'text-[#444444]'}`}>
            {script.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
          </span>
        </div>

        {/* Mode toggle */}
        <div className="mb-4 inline-flex border border-[#2a2a2a] bg-[#0d0d0d]">
          {(['by-chars', 'by-parts'] as SplitMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => handleModeSwitch(m)}
              className={`px-4 py-2 text-[11px] uppercase tracking-[1.5px] transition-colors ${
                mode === m
                  ? 'bg-[#e8380d]/15 text-[#e8380d]'
                  : 'text-[#555555] hover:text-[#888888]'
              }`}
            >
              {m === 'by-chars' ? 'Chars per chunk' : 'Split equally'}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="mb-2 flex flex-wrap items-center gap-3">
          <input
            ref={uploadRef}
            type="file"
            accept=".txt"
            className="hidden"
            onChange={(e) => void handleFileChange(e)}
          />
          <button
            type="button"
            onClick={() => uploadRef.current?.click()}
            className="inline-flex items-center gap-2 border border-[#2a2a2a] bg-[#181818] px-3 py-2 text-xs text-[#aaaaaa] transition-colors hover:border-[#3a3a3a] hover:text-[#f0ede8]"
          >
            <Upload size={13} />
            Upload .txt
          </button>

          {/* Mode-specific number input */}
          {mode === 'by-chars' ? (
            <div className="flex items-center gap-2">
              <label htmlFor="chunk-size" className="text-[11px] text-[#666666]">Chars per chunk</label>
              <input
                id="chunk-size"
                type="number"
                min={100}
                max={50000}
                step={100}
                value={chunkSizeInput}
                onChange={(e) => setChunkSizeInput(e.target.value)}
                className="w-24 border border-[#2a2a2a] bg-[#0d0d0d] px-2 py-1.5 text-center text-[12px] tabular-nums text-[#e0ddd8] outline-none focus:border-[#3a3a3a]"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <label htmlFor="num-parts" className="text-[11px] text-[#666666]">Number of parts</label>
              <input
                id="num-parts"
                type="number"
                min={2}
                max={100}
                step={1}
                value={numPartsInput}
                onChange={(e) => setNumPartsInput(e.target.value)}
                className="w-20 border border-[#2a2a2a] bg-[#0d0d0d] px-2 py-1.5 text-center text-[12px] tabular-nums text-[#e0ddd8] outline-none focus:border-[#3a3a3a]"
              />
            </div>
          )}

          <button
            type="button"
            onClick={handleSplit}
            disabled={!canSplit}
            className="inline-flex items-center gap-2 bg-[#e8380d] px-4 py-2 text-xs font-semibold uppercase tracking-[1.5px] text-white transition-colors hover:bg-[#cc2f09] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Scissors size={13} />
            Split
          </button>

          {chunks.length > 0 && (
            <button
              type="button"
              onClick={() => downloadAllChunks(chunks)}
              className="inline-flex items-center gap-2 border border-[#2a2a2a] bg-[#181818] px-3 py-2 text-xs text-[#aaaaaa] transition-colors hover:border-[#3a3a3a] hover:text-[#f0ede8]"
            >
              <Download size={13} />
              Download All
            </button>
          )}
        </div>

        {/* Live estimate */}
        {estimateLine && chunks.length === 0 && (
          <p className="mb-4 text-[11px] text-[#555555]">{estimateLine}</p>
        )}

        {/* Warnings */}
        {isOverLimit && (
          <div className="mb-4 flex items-center gap-2 border border-red-900/50 bg-[#1a1010] px-4 py-3 text-xs text-red-300">
            <AlertCircle size={14} className="shrink-0" />
            Script exceeds {MAX_CHARS.toLocaleString()} characters. Please trim it down.
          </div>
        )}

        {chunkTooLarge && (
          <div className="mb-4 flex items-center gap-2 border border-yellow-900/50 bg-[#1a1500] px-4 py-3 text-xs text-yellow-300">
            <AlertCircle size={14} className="shrink-0" />
            Chunk size ({chunkSize.toLocaleString()}) is larger than your script ({scriptLen.toLocaleString()} chars).
            {' '}Set it below <span className="mx-1 font-semibold">{scriptLen.toLocaleString()}</span> to get multiple chunks.
          </div>
        )}

        {tooManyParts && (
          <div className="mb-4 flex items-center gap-2 border border-yellow-900/50 bg-[#1a1500] px-4 py-3 text-xs text-yellow-300">
            <AlertCircle size={14} className="shrink-0" />
            Can't split into {numParts} parts — script only has {scriptLen.toLocaleString()} characters.
            {' '}Max: <span className="mx-1 font-semibold">{scriptLen}</span>.
          </div>
        )}

        {onePart && (
          <div className="mb-4 flex items-center gap-2 border border-yellow-900/50 bg-[#1a1500] px-4 py-3 text-xs text-yellow-300">
            <AlertCircle size={14} className="shrink-0" />
            Set at least 2 parts to split.
          </div>
        )}

        {error && <p className="mb-4 text-xs text-red-400">{error}</p>}

        {/* Output */}
        {chunks.length > 0 && (
          <div className="mt-4 space-y-4">
            <div className="border-b border-[#222222] pb-3">
              <p className="text-[12px] text-[#666666]">
                <span className="text-[#f0ede8]">{chunks.length} parts</span>
                {' · '}
                <span className="text-[#f0ede8]">~{resolvedCharsEach.toLocaleString()} chars</span> each
                {' · '}
                <span className="text-[#f0ede8]">{OVERLAP_CHARS}-char</span> overlap tail
              </p>
            </div>

            {chunks.map((chunk, i) => (
              <ScriptSplitterChunkCard
                key={i}
                chunk={chunk}
                index={i}
                total={chunks.length}
                charsEach={resolvedCharsEach}
                onSendToBroll={handleSendToBroll}
                onSendToTranslator={handleSendToTranslator}
              />
            ))}
          </div>
        )}

      </section>

      {/* Clear confirmation */}
      <ConfirmModal
        open={showClearModal}
        title="Clear everything?"
        body="This will remove your script and all split parts. Session memory will also be wiped. This cannot be undone."
        cancelLabel="Cancel"
        confirmLabel="Yes, Clear"
        tone="danger"
        onCancel={() => setShowClearModal(false)}
        onConfirm={() => {
          setShowClearModal(false);
          setScript('');
          setChunks([]);
          setError(null);
        }}
      />
    </WorkspaceLayout>
  );
}
