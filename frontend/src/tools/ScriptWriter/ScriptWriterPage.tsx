import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightLeft, Copy, Download, Eye, Sparkles, Trash2, Upload, X } from 'lucide-react';
import { apiService } from '../../services/api.service';
import { ConfirmModal } from '../ManualStory/ConfirmModal';
import { WorkspaceLayout } from '../../workspace/WorkspaceLayout';

// ---------------------------------------------------------------------------
// Translation direction templates
// ---------------------------------------------------------------------------
type TranslationDirection = 'ne->en' | 'en->ne';

const TRANSLATION_TEMPLATES: {
  id: TranslationDirection;
  from: string;
  to: string;
  sub: string;
}[] = [
  { id: 'ne->en', from: 'Nepali', to: 'English', sub: 'Translate Nepali script to English' },
  { id: 'en->ne', from: 'English', to: 'Nepali', sub: 'Translate English script to Nepali' },
];

const MAX_CHARS = 2000;

// ---------------------------------------------------------------------------
// Persist input text to sessionStorage across tab navigation
// ---------------------------------------------------------------------------
const STORAGE_KEY = 'scriptwriter:text';

function useScriptWriterState(): [string, (v: string) => void] {
  const [value, setValue] = useState<string>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) ?? '';
    } catch {
      return '';
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore quota / private-mode errors
    }
  }, [value]);

  return [value, setValue];
}

// ---------------------------------------------------------------------------
// Persist translated output to sessionStorage across tab navigation
// ---------------------------------------------------------------------------
const OUTPUT_STORAGE_KEY = 'scriptwriter:translatedText';

function useTranslatedTextState(): [string, (v: string) => void] {
  const [value, setValue] = useState<string>(() => {
    try {
      return sessionStorage.getItem(OUTPUT_STORAGE_KEY) ?? '';
    } catch {
      return '';
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(OUTPUT_STORAGE_KEY, value);
    } catch {
      // ignore quota / private-mode errors
    }
  }, [value]);

  return [value, setValue];
}

// ---------------------------------------------------------------------------

function downloadTextFile(text: string, filename: string) {
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------

export function ScriptWriterPage() {
  const [text, setText] = useScriptWriterState();
  const [translatedText, setTranslatedText] = useTranslatedTextState();
  const [selectedDirection, setSelectedDirection] = useState<TranslationDirection | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Result panel: collapsed by default so it doesn't crowd the form
  const [resultExpanded, setResultExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  // Confirm dialogs
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRetranslateModal, setShowRetranslateModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const uploadRef = useRef<HTMLInputElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const navigate = useNavigate();

  const trimmedLength = text.trim().length;
  const isOverLimit = trimmedLength > MAX_CHARS;
  const canTranslate = !!text.trim() && selectedDirection !== null && !isOverLimit && !isTranslating;

  const handleUploadClick = () => uploadRef.current?.click();

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const content = await file.text();
    setText(content);
    event.target.value = '';
  };

  const handleTranslate = async (skipExistingCheck = false) => {
    if (!canTranslate || !selectedDirection) return;

    // Warn if output already exists — don't silently overwrite
    if (!skipExistingCheck && translatedText) {
      setShowRetranslateModal(true);
      return;
    }

    setError(null);
    setTranslatedText('');
    setIsTranslating(true);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const result = await apiService.translateScript(text.trim(), selectedDirection, ctrl.signal);
      setTranslatedText(result.translatedText);
      setResultExpanded(false);
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return;
      setError(e instanceof Error ? e.message : 'Translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
      abortRef.current = null;
    }
  };

  const handleDeleteOutput = () => {
    setShowDeleteModal(true);
  };

  const handleCancel = () => {
    abortRef.current?.abort();
  };

  const handleCopy = async () => {
    if (!translatedText) return;
    try {
      await navigator.clipboard.writeText(translatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // ignore
    }
  };

  const handleDownload = () => {
    if (!translatedText) return;
    const direction = selectedDirection ?? 'translated';
    downloadTextFile(translatedText, `script-${direction}.txt`);
  };

  // Hand off the translated text to the Generate B-roll tool as its input script
  const handleSendToBroll = () => {
    if (!translatedText) return;
    // GenerateToolPage reads script from localStorage key 'broll_script'
    try {
      localStorage.setItem('broll_script', translatedText);
    } catch {
      // ignore storage errors
    }
    navigate('/tools/generate');
  };

  return (
    <WorkspaceLayout>
      <section className="h-full w-full overflow-y-auto border border-[#222222] bg-[#111111] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:p-6 md:p-8 lg:p-10">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-['Bebas_Neue'] text-[28px] tracking-[1px] sm:text-[36px] lg:text-[40px]">
              Script Translator
            </h1>
            <p className="mt-1 text-sm leading-5 text-[#8a8a8a]">
              Paste or upload your script and translate it into another language. Supports{' '}
              <span className="text-[#cccccc]">.txt</span> file upload.
            </p>
          </div>

          {text && (
            <button
              type="button"
              onClick={() => setShowClearModal(true)}
              disabled={isTranslating}
              className="inline-flex items-center gap-1.5 border border-red-900/60 bg-[#1a1010] px-3 py-1.5 text-xs font-medium text-red-300 transition-colors hover:bg-[#241313] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 size={14} />
              Clear
            </button>
          )}
        </div>

        {/* Textarea */}
        <div className="group relative overflow-hidden rounded-[4px] border border-[#2f2f2f] bg-[#121212] transition-[border-color,box-shadow,background-color] duration-300 focus-within:border-[#ff5a2f] focus-within:bg-[#161110] focus-within:shadow-[0_0_0_1px_rgba(255,90,47,0.62),0_0_0_4px_rgba(255,90,47,0.30),0_0_36px_rgba(255,90,47,0.40),0_0_56px_rgba(255,90,47,0.22)]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[4px] bg-[radial-gradient(130%_110%_at_50%_50%,rgba(255,90,47,0.46),transparent_72%)] opacity-0 transition-opacity duration-300 group-focus-within:opacity-100"
          />
          <div className="relative z-10 m-[1px] rounded-[3px] bg-[#121212]">
            <textarea
              rows={8}
              value={text}
              onChange={(e) => setText(e.target.value)}
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
          <span className={`rounded border px-2 py-0.5 text-[11px] font-semibold tabular-nums ${
            isOverLimit
              ? 'border-red-500/40 bg-red-500/10 text-red-300'
              : 'border-[#303030] bg-[#171717] text-[#9a9a9a]'
          }`}>
            {trimmedLength} / {MAX_CHARS}
          </span>
        </div>

        {/* Toolbar + templates + translate in one compact row-group */}
        <div className="mt-3 border-t border-[#252525] pt-3 space-y-3">

          {/* Row 1: upload + warning */}
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={uploadRef}
              type="file"
              accept=".txt,text/plain"
              className="hidden"
              onChange={(e) => { void handleFileChange(e); }}
            />
            <button
              type="button"
              onClick={handleUploadClick}
              disabled={isTranslating}
              className="inline-flex items-center gap-1.5 border border-[#252525] bg-[#1e1e1e] px-3 py-1.5 text-xs font-medium text-[#888888] transition-colors hover:text-[#f0ede8] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Upload size={14} />
              Upload TXT
            </button>
            <p className="text-[11px] text-[#555555]">AI can make mistakes. Always review your script.</p>
          </div>

          {/* Row 2: direction cards + translate button side by side */}
          <div className="flex flex-wrap items-center gap-3">
            <p className="w-full text-[10px] uppercase tracking-[.8px] text-[#666666]">Translation Direction</p>

            {TRANSLATION_TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedDirection(t.id)}
                disabled={isTranslating}
                className={`flex items-center gap-2 rounded border px-3 py-2 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
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

            {/* Translate / Cancel — inline with cards */}
            <div className="ml-auto flex items-center gap-2">
              {isTranslating && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex items-center justify-center gap-1.5 border border-[#252525] bg-[#1e1e1e] px-4 py-2 text-xs font-semibold uppercase tracking-[.6px] text-[#f0ede8] transition-colors hover:border-[#ff4d20]"
                >
                  Cancel
                </button>
              )}
              <button
                type="button"
                onClick={() => { void handleTranslate(); }}
                disabled={!canTranslate}
                className="inline-flex min-w-[160px] items-center justify-center gap-2 border border-[#e8380d] bg-[#e8380d] px-6 py-2.5 text-sm font-semibold uppercase tracking-[.7px] text-white transition-colors hover:border-[#ff4d20] hover:bg-[#ff4d20] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ArrowRightLeft size={14} />
                {isTranslating ? 'Translating...' : 'Translate'}
              </button>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="mt-2 text-xs text-red-400">{error}</p>
        )}

        {/* Result — compact status strip with left-corner Preview button */}
        {translatedText && (
          <div className="mt-4 flex items-center gap-2 rounded border border-[#1e2e1e] bg-[#0f1a0f] px-3 py-2">
            {/* Green dot indicator */}
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-400" />
            <span className="text-[11px] text-green-400 font-medium">Translation ready</span>
            <span className="text-[11px] text-[#555555] tabular-nums">
              · {translatedText.trim().length} chars
            </span>

            {/* Preview button — left of action group */}
            <button
              type="button"
              onClick={() => setResultExpanded(true)}
              className="ml-2 inline-flex items-center gap-1 rounded border border-[#252525] bg-[#1e1e1e] px-2 py-1 text-[11px] text-[#888888] transition-colors hover:text-[#f0ede8]"
            >
              <Eye size={11} />
              Preview
            </button>

            {/* Action buttons */}
            <div className="ml-auto flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => { void handleCopy(); }}
                className="inline-flex items-center gap-1 rounded border border-[#252525] bg-[#1e1e1e] px-2 py-1 text-[11px] text-[#888888] transition-colors hover:text-[#f0ede8]"
              >
                <Copy size={11} />
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-1 rounded border border-[#252525] bg-[#1e1e1e] px-2 py-1 text-[11px] text-[#888888] transition-colors hover:text-[#f0ede8]"
              >
                <Download size={11} />
                Download
              </button>
              {/* Send to Generate B-roll */}
              <button
                type="button"
                onClick={handleSendToBroll}
                className="inline-flex items-center gap-1 rounded border border-[#e8380d]/60 bg-[#1e1e1e] px-2 py-1 text-[11px] text-[#e8380d] transition-colors hover:bg-[#e8380d]/10"
                title="Use this translation as input for Generate B-roll"
              >
                <Sparkles size={11} />
                Generate B-roll
              </button>
              {/* Delete — danger tone */}
              <button
                type="button"
                onClick={handleDeleteOutput}
                className="inline-flex items-center gap-1 rounded border border-red-900/50 bg-[#1a1010] px-2 py-1 text-[11px] text-red-400 transition-colors hover:bg-[#241313]"
                title="Delete translation output"
              >
                <Trash2 size={11} />
              </button>
            </div>
          </div>
        )}

        {/* Clear input confirmation */}
        <ConfirmModal
          open={showClearModal}
          title="Clear Script?"
          body="This will clear your input script and any existing translation. This cannot be undone."
          cancelLabel="Cancel"
          confirmLabel="Yes, Clear"
          tone="danger"
          onCancel={() => setShowClearModal(false)}
          onConfirm={() => {
            setShowClearModal(false);
            setText('');
            setTranslatedText('');
            setError(null);
            setResultExpanded(false);
          }}
        />

        {/* Delete output confirmation */}
        <ConfirmModal
          open={showDeleteModal}
          title="Delete Translation?"
          body="This will permanently remove the translated output. You'll need to translate again to get it back."
          cancelLabel="Cancel"
          confirmLabel="Yes, Delete"
          tone="danger"
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={() => {
            setShowDeleteModal(false);
            setTranslatedText('');
            setResultExpanded(false);
          }}
        />

        {/* Retranslate-over-existing confirmation */}
        <ConfirmModal
          open={showRetranslateModal}
          title="Overwrite Translation?"
          body="You already have a translation. Running again will replace it. Download or copy it first if you need it."
          cancelLabel="Cancel"
          confirmLabel="Yes, Translate Again"
          onCancel={() => setShowRetranslateModal(false)}
          onConfirm={() => {
            setShowRetranslateModal(false);
            void handleTranslate(true);
          }}
        />

        {/* Preview modal overlay */}
        {resultExpanded && translatedText && (          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onClick={() => setResultExpanded(false)}
          >
            <div
              className="relative w-full max-w-2xl rounded-md border border-[#2a2a2a] bg-[#0e0e0e] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between border-b border-[#1e1e1e] px-4 py-3">
                <div className="flex items-center gap-2">
                  <Eye size={13} className="text-[#888888]" />
                  <span className="text-xs font-semibold text-[#f0ede8]">Translation Preview</span>
                  <span className="text-[11px] text-[#555555]">{translatedText.trim().length} chars</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => { void handleCopy(); }}
                    className="inline-flex items-center gap-1 rounded border border-[#252525] bg-[#1a1a1a] px-2 py-1 text-[11px] text-[#888888] transition-colors hover:text-[#f0ede8]"
                  >
                    <Copy size={11} />
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="inline-flex items-center gap-1 rounded border border-[#252525] bg-[#1a1a1a] px-2 py-1 text-[11px] text-[#888888] transition-colors hover:text-[#f0ede8]"
                  >
                    <Download size={11} />
                    Download
                  </button>
                  <button
                    type="button"
                    onClick={() => setResultExpanded(false)}
                    className="ml-1 inline-flex items-center justify-center rounded border border-[#252525] bg-[#1a1a1a] p-1 text-[#888888] transition-colors hover:text-[#f0ede8]"
                    aria-label="Close preview"
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>

              {/* Scrollable content */}
              <div className="max-h-[60vh] overflow-y-auto px-4 py-4">
                <pre className="whitespace-pre-wrap text-xs leading-relaxed text-[#d0ccc6] sm:text-sm">
                  {translatedText}
                </pre>
              </div>
            </div>
          </div>
        )}

      </section>
    </WorkspaceLayout>
  );
}
