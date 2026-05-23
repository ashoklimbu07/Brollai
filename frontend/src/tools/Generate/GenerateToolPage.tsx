import { useEffect, useRef, type ChangeEvent } from 'react';
import { CircleHelp, Send, Trash2, Upload } from 'lucide-react';
import { ScriptInput } from '../../components/ScriptInput';
import { useBrollGenerator } from '../../hooks/useBrollGenerator';
import { apiService } from '../../services/api.service';
import { WorkspaceLayout } from '../../workspace/WorkspaceLayout';

export function GenerateToolPage() {
  const {
    script,
    setScript,
    brollPromptsJson,
    brollPromptsPlain,
    totalScenes,
    isGenerating,
    showBrollOutput,
    showStyleOptions,
    selectedStyle,
    setSelectedStyle,
    desiredScenes,
    setDesiredScenes,
    error,
    handleGenerateClick,
    handleGenerateBroll,
    cancelGenerateBroll,
    showClearDialog,
    handleClearClick,
    confirmClear,
    cancelClear,
    showDeleteBrollDialog,
    handleDeleteBrollClick,
    confirmDeleteBroll,
    cancelDeleteBroll,
    showComingSoon,
    dismissComingSoon,
  } = useBrollGenerator();
  const promptRef = useRef<HTMLTextAreaElement | null>(null);
  const uploadTextRef = useRef<HTMLInputElement | null>(null);

  const handlePromptGenerate = () => {
    if (!script.trim() || !selectedStyle || desiredScenes === null) {
      promptRef.current?.focus();
      return;
    }
    void handleGenerateBroll();
  };

  const handleUploadTextClick = () => {
    uploadTextRef.current?.click();
  };

  useEffect(() => {
    void apiService.wakeBackend();
  }, []);

  const handleUploadTextChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const textContent = await file.text();
    setScript(textContent);
    promptRef.current?.focus();
    event.target.value = '';
  };

  const trimmedLength = script.trim().length;
  const MIN_SCRIPT_CHARACTERS = 800;
  const MAX_SCRIPT_CHARACTERS = (selectedStyle === '2d_nepal_theme' || selectedStyle === 'documentary') ? 2000 : 1500;
  const isScriptLengthInvalid =
    trimmedLength > 0 && (trimmedLength < MIN_SCRIPT_CHARACTERS || trimmedLength > MAX_SCRIPT_CHARACTERS);
  const scriptValidationErrors = [
    'Please enter a script first',
    'Please select a style first',
    'Please enter scene number',
    'Scene number must be between 25 and 35',
  ];
  const shouldHideInlineError =
    !!error &&
    (scriptValidationErrors.includes(error) ||
      error.includes(`between ${MIN_SCRIPT_CHARACTERS} and ${MAX_SCRIPT_CHARACTERS} characters`) ||
      // Backwards compatible with older backend/frontend validations
      error.includes('between 1000 and 1500 characters') ||
      error.includes('between 800 and 1500 characters') ||
      error.includes('between 800 and 2000 characters'));
  const displayError = shouldHideInlineError ? null : error;

  return (
    <WorkspaceLayout>
      <section className="h-full w-full overflow-y-auto border border-[#222222] bg-[#111111] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:p-6 md:p-8 lg:p-10">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <h1 className="font-['Bebas_Neue'] text-[28px] tracking-[1px] sm:text-[36px] lg:text-[40px]">
            What Are You Creating Today?
          </h1>
          <div className="flex flex-col items-start gap-1 sm:items-end">
            {(script || showBrollOutput) && (
              <button
                type="button"
                onClick={handleClearClick}
                disabled={isGenerating}
                className="inline-flex items-center gap-1.5 border border-red-900/60 bg-[#1a1010] px-3 py-1.5 text-xs font-medium text-red-300 transition-colors hover:bg-[#241313] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 size={14} />
                Clear
              </button>
            )}
          </div>
        </div>
        <div>
          <div className="group relative overflow-hidden rounded-[4px] border border-[#2f2f2f] bg-[#121212] transition-[border-color,box-shadow,background-color] duration-300 group-focus-within:border-[#ff5a2f] group-focus-within:bg-[#161110] group-focus-within:shadow-[0_0_0_1px_rgba(255,90,47,0.62),0_0_0_4px_rgba(255,90,47,0.30),0_0_36px_rgba(255,90,47,0.40),0_0_56px_rgba(255,90,47,0.22)]">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[4px] bg-[radial-gradient(130%_110%_at_50%_50%,rgba(255,90,47,0.46),transparent_72%)] opacity-0 transition-opacity duration-300 group-focus-within:opacity-100"
            />
            <div className="relative z-10 m-[1px] rounded-[3px] bg-[#121212]">
              <textarea
                ref={promptRef}
                rows={4}
                value={script}
                onChange={(event) => setScript(event.target.value)}
                onKeyDown={(event) => {
                  if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
                    event.preventDefault();
                    handlePromptGenerate();
                  }
                }}
                placeholder="Describe your video topic or paste your script. BrollAI will handle the rest."
                className="min-h-[120px] w-full resize-y border-0 bg-transparent p-3 text-sm text-[#f0ede8] placeholder:text-[#666666] outline-none transition-colors duration-200 focus:ring-0 sm:p-4 sm:text-[15px]"
              />
            </div>
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] leading-5 sm:text-xs">
            <span
              className={`font-medium tracking-[0.2px] ${
                selectedStyle ? (isScriptLengthInvalid ? 'text-red-400' : 'text-[#8a8a8a]') : 'text-transparent'
              }`}
            >
              {selectedStyle
                ? (isScriptLengthInvalid
                  ? `Script must be between ${MIN_SCRIPT_CHARACTERS} and ${MAX_SCRIPT_CHARACTERS} characters.`
                  : `Ideal length: ${MIN_SCRIPT_CHARACTERS}-${MAX_SCRIPT_CHARACTERS} characters.`)
                : 'Validation message placeholder'}
            </span>
            <span
              className={`rounded border px-2 py-0.5 font-semibold tabular-nums ${
                selectedStyle && isScriptLengthInvalid
                  ? 'border-red-500/40 bg-red-500/10 text-red-300'
                  : 'border-[#303030] bg-[#171717] text-[#9a9a9a]'
              }`}
            >
              {trimmedLength} chars
            </span>
          </div>
        </div>

        <div className="mt-4 border-t border-[#252525] pt-3">
          <input
            ref={uploadTextRef}
            type="file"
            accept=".txt,.md,.rtf,.json,.csv,.srt"
            className="hidden"
            onChange={handleUploadTextChange}
          />

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleUploadTextClick}
              className="inline-flex items-center gap-1.5 border border-[#252525] bg-[#1e1e1e] px-3 py-1.5 text-xs font-medium text-[#888888] hover:text-[#f0ede8]"
            >
              <Upload size={14} />
              Upload Text
            </button>
            <p className="text-[11px] text-[#555555]">AI can make mistakes. Always review exports.</p>
          </div>

          <p className="mt-4 text-xs uppercase tracking-[.8px] text-[#888888]">Choose style / templates</p>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <button
            type="button"
            onClick={() => setSelectedStyle('transparent_skeleton')}
            disabled={isGenerating}
            className={`relative rounded-md border p-4 text-left transition-colors ${
              selectedStyle === 'transparent_skeleton'
                ? 'border-[#e8380d] bg-[#e8380d]/12'
                : 'border-[#2e2e2e] bg-[#161616] hover:border-[#e8380d]/60'
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <button
              type="button"
              aria-label="More info about Transparent Skeleton"
              onClick={(event) => event.stopPropagation()}
              className="group absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-sm text-[#b0b0b0]/40 transition-opacity hover:text-[#f0ede8] hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#ff5a2f]/40"
            >
              <CircleHelp size={14} />
              <span className="pointer-events-none absolute bottom-full right-0 z-20 mb-2 w-[280px] rounded border border-[#3a2a25] bg-[#171311] p-2.5 text-left text-[11px] leading-5 text-[#e8ddd7] opacity-0 shadow-[0_12px_30px_rgba(0,0,0,0.45)] transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">
                X-ray / translucent character look. Emphasizes see-through bones, subtle internal glow, high contrast edges,
                and a clean dark background for readable “transparent” anatomy shots.
              </span>
            </button>

            <p className="text-sm font-semibold text-[#f0ede8]">Transparent Skeleton</p>
            <p className="mt-1 text-xs text-[#888888]">What if translucent character?</p>
          </button>
          <button
            type="button"
            onClick={() => setSelectedStyle('2d_animation')}
            disabled={isGenerating}
            className={`relative rounded-md border p-4 text-left transition-colors ${
              selectedStyle === '2d_animation'
                ? 'border-[#e8380d] bg-[#e8380d]/12'
                : 'border-[#2e2e2e] bg-[#161616] hover:border-[#e8380d]/60'
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-[#f0ede8]">2D Animation</p>
            </div>
            <button
              type="button"
              aria-label="More info about 2D Animation"
              onClick={(event) => event.stopPropagation()}
              className="group absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-sm text-[#b0b0b0]/40 transition-opacity hover:text-[#f0ede8] hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#ff5a2f]/40"
            >
              <CircleHelp size={14} />
              <span className="pointer-events-none absolute bottom-full right-0 z-20 mb-2 w-[280px] rounded border border-[#3a2a25] bg-[#171311] p-2.5 text-left text-[11px] leading-5 text-[#e8ddd7] opacity-0 shadow-[0_12px_30px_rgba(0,0,0,0.45)] transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">
                Hand-drawn 2D style with clean line art, flat colors, and simple backgrounds. Best when your prompt is short
                and clear (who/what/where), so scenes stay consistent and readable.
              </span>
            </button>

            <p className="mt-1 text-xs text-[#888888]">Short prompt, classic hand-drawn look</p>
          </button>
          <button
            type="button"
            onClick={() => setSelectedStyle('2d_nepal_theme')}
            disabled={isGenerating}
            className={`relative rounded-md border p-4 text-left transition-colors ${
              selectedStyle === '2d_nepal_theme'
                ? 'border-[#e8380d] bg-[#e8380d]/12'
                : 'border-[#2e2e2e] bg-[#161616] hover:border-[#e8380d]/60'
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <button
              type="button"
              aria-label="More info about 2D Nepali Theme"
              onClick={(event) => event.stopPropagation()}
              className="group absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-sm text-[#b0b0b0]/40 transition-opacity hover:text-[#f0ede8] hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#ff5a2f]/40"
            >
              <CircleHelp size={14} />
              <span className="pointer-events-none absolute bottom-full right-0 z-20 mb-2 w-[280px] rounded border border-[#3a2a25] bg-[#171311] p-2.5 text-left text-[11px] leading-5 text-[#e8ddd7] opacity-0 shadow-[0_12px_30px_rgba(0,0,0,0.45)] transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">
                2D hand-drawn style set entirely in Nepal — Nepali characters in authentic clothing, Newari architecture,
                terraced hills, temples, and festival environments. Supports Nepali and English input.
              </span>
            </button>

            <p className="text-sm font-semibold text-[#f0ede8]">2D Nepali Theme</p>
            <p className="mt-1 text-xs text-[#888888]">Nepali characters &amp; cultural setting</p>
          </button>

          {/* Documentary style card */}
          <button
            type="button"
            onClick={() => setSelectedStyle('documentary')}
            disabled={isGenerating}
            className={`relative rounded-md border p-4 text-left transition-colors ${
              selectedStyle === 'documentary'
                ? 'border-[#e8380d] bg-[#e8380d]/12'
                : 'border-[#2e2e2e] bg-[#161616] hover:border-[#e8380d]/60'
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <button
              type="button"
              aria-label="More info about Documentary style"
              onClick={(event) => event.stopPropagation()}
              className="group absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-sm text-[#b0b0b0]/40 transition-opacity hover:text-[#f0ede8] hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#ff5a2f]/40"
            >
              <CircleHelp size={14} />
              <span className="pointer-events-none absolute bottom-full right-0 z-20 mb-2 w-[280px] rounded border border-[#3a2a25] bg-[#171311] p-2.5 text-left text-[11px] leading-5 text-[#e8ddd7] opacity-0 shadow-[0_12px_30px_rgba(0,0,0,0.45)] transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">
                Premium documentary cinematography — photorealistic, handheld energy, natural lighting, and a consistent
                teal-and-orange LUT across all scenes. Best for real-world stories, biographical content, and social topics.
                Supports 1000–2000 character scripts.
              </span>
            </button>

            <p className="text-sm font-semibold text-[#f0ede8]">Documentary</p>
            <p className="mt-1 text-xs text-[#888888]">Photorealistic, cinematic, real-world feel</p>
          </button>
        </div>

        <div className="mt-4 border-t border-[#252525] pt-3">
          <div className="mb-3">
            <label htmlFor="desired-scenes" className="mb-1 block text-xs uppercase tracking-[.8px] text-[#888888]">
              Desired scenes (25-35) *
            </label>
            <input
              id="desired-scenes"
              type="number"
              min={25}
              max={35}
              required
              disabled={isGenerating}
              value={desiredScenes ?? ''}
              onChange={(event) => {
                const value = event.target.value;
                setDesiredScenes(value === '' ? null : Number(value));
              }}
              placeholder="e.g. 30"
              className="w-full max-w-[220px] border border-[#2f2f2f] bg-[#161616] px-3 py-2 text-sm text-[#f0ede8] outline-none transition-colors focus:border-[#ff5a2f] disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
          <div className="flex w-full justify-end">
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              {isGenerating ? (
                <button
                  type="button"
                  onClick={cancelGenerateBroll}
                  className="inline-flex items-center justify-center gap-1.5 border border-[#252525] bg-[#1e1e1e] px-4 py-2 text-xs font-semibold uppercase tracking-[.6px] text-[#f0ede8] transition-colors hover:border-[#ff4d20]"
                >
                  Cancel
                </button>
              ) : null}
              <button
                type="button"
                onClick={handlePromptGenerate}
                disabled={isGenerating || !script.trim() || !selectedStyle || desiredScenes === null}
                className="inline-flex items-center justify-center gap-2 border border-[#e8380d] bg-[#e8380d] px-7 py-3 text-sm font-semibold uppercase tracking-[.7px] text-white transition-colors hover:border-[#ff4d20] hover:bg-[#ff4d20] disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-[220px]"
              >
                <Send size={16} />
                {isGenerating ? 'Generating...' : 'Generate B-roll'}
              </button>
            </div>
          </div>
        </div>

        <ScriptInput
          script={script}
          setScript={setScript}
          brollPromptsJson={brollPromptsJson}
          brollPromptsPlain={brollPromptsPlain}
          totalScenes={totalScenes}
          desiredScenes={desiredScenes}
          onGenerateClick={handleGenerateClick}
          onGenerateBroll={handleGenerateBroll}
          onCancelGenerateBroll={cancelGenerateBroll}
          isGenerating={isGenerating}
          showBrollOutput={showBrollOutput}
          showStyleOptions={showStyleOptions}
          selectedStyle={selectedStyle}
          setSelectedStyle={setSelectedStyle}
          error={displayError}
          showClearDialog={showClearDialog}
          onClear={handleClearClick}
          confirmClear={confirmClear}
          cancelClear={cancelClear}
          showDeleteBrollDialog={showDeleteBrollDialog}
          onDeleteBroll={handleDeleteBrollClick}
          confirmDeleteBroll={confirmDeleteBroll}
          cancelDeleteBroll={cancelDeleteBroll}
          showComingSoon={showComingSoon}
          onDismissComingSoon={dismissComingSoon}
          hideEditorSection
          hidePrimaryGenerateButton
          hideStyleOptions
        />
      </section>
    </WorkspaceLayout>
  );
}
