import { useRef, useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { apiService } from '../../services/api.service';
import { ConfirmModal } from '../ManualStory/ConfirmModal';
import { WorkspaceLayout } from '../../workspace/WorkspaceLayout';
import { ScriptTranslatorInput } from './ScriptTranslatorInput';
import { ScriptTranslatorToolbar } from './ScriptTranslatorToolbar';
import { ScriptTranslatorResult } from './ScriptTranslatorResult';
import { useScriptInput, useTranslatedOutput } from './scriptTranslator.hooks';
import { downloadTextFile } from './scriptTranslator.utils';
import { MAX_CHARS, type TranslationDirection } from './scriptTranslator.types';

export function ScriptTranslatorPage() {
  const [text, setText] = useScriptInput();
  const [translatedText, setTranslatedText] = useTranslatedOutput();
  const [selectedDirection, setSelectedDirection] = useState<TranslationDirection | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Confirm dialogs
  const [showClearModal, setShowClearModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRetranslateModal, setShowRetranslateModal] = useState(false);

  const uploadRef = useRef<HTMLInputElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const navigate = useNavigate();

  const isOverLimit = text.trim().length > MAX_CHARS;
  const canTranslate = !!text.trim() && selectedDirection !== null && !isOverLimit && !isTranslating;

  // -------------------------------------------------------------------------

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setText(await file.text());
    e.target.value = '';
  };

  const handleTranslate = async (skipExistingCheck = false) => {
    if (!canTranslate || !selectedDirection) return;
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
      setPreviewOpen(false);
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return;
      setError(e instanceof Error ? e.message : 'Translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
      abortRef.current = null;
    }
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
    downloadTextFile(translatedText, `script-${selectedDirection ?? 'translated'}.txt`);
  };

  const handleSendToBroll = () => {
    if (!translatedText) return;
    try { localStorage.setItem('broll_script', translatedText); } catch { /* ignore */ }
    navigate('/tools/generate');
  };

  // -------------------------------------------------------------------------

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

        {/* Input area */}
        <ScriptTranslatorInput
          text={text}
          isTranslating={isTranslating}
          uploadRef={uploadRef}
          onTextChange={setText}
          onFileChange={(e) => { void handleFileChange(e); }}
        />

        {/* Toolbar: upload, direction, translate */}
        <ScriptTranslatorToolbar
          selectedDirection={selectedDirection}
          isTranslating={isTranslating}
          canTranslate={canTranslate}
          onUploadClick={() => uploadRef.current?.click()}
          onSelectDirection={setSelectedDirection}
          onTranslate={() => { void handleTranslate(); }}
          onCancel={() => abortRef.current?.abort()}
        />

        {/* Inline error */}
        {error && <p className="mt-2 text-xs text-red-400">{error}</p>}

        {/* Result strip + preview modal */}
        <ScriptTranslatorResult
          translatedText={translatedText}
          copied={copied}
          previewOpen={previewOpen}
          onPreviewOpen={() => setPreviewOpen(true)}
          onPreviewClose={() => setPreviewOpen(false)}
          onCopy={() => { void handleCopy(); }}
          onDownload={handleDownload}
          onSendToBroll={handleSendToBroll}
          onDeleteClick={() => setShowDeleteModal(true)}
        />

        {/* Confirm: clear input */}
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
            setPreviewOpen(false);
          }}
        />

        {/* Confirm: delete output */}
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
            setPreviewOpen(false);
          }}
        />

        {/* Confirm: overwrite existing translation */}
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

      </section>
    </WorkspaceLayout>
  );
}
