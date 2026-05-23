import { useNavigate } from 'react-router-dom';
import { downloadBrollJSON, downloadBrollPlainText, extractSceneBlocks } from './ScriptInput.helpers';

// sessionStorage key that PromptParserPage reads on mount
const PARSER_INPUT_KEY = 'promptparser:input';

export function ScriptInputBrollOutput(props: {
  isGenerating: boolean;
  brollPromptsJson: string;
  brollPromptsPlain: string;
  totalScenes: number;
  desiredScenes?: number | null;
  onDeleteBroll: () => void;
}) {
  const { isGenerating, brollPromptsJson, brollPromptsPlain, totalScenes, desiredScenes, onDeleteBroll } = props;
  const navigate = useNavigate();

  const sceneBlocks = extractSceneBlocks({ brollPromptsJson, brollPromptsPlain });
  const parsedCount = sceneBlocks.length;

  // Try to get the real count from the JSON array first — the plain-text splitter
  // returns 1 when the JSON has no blank lines between objects.
  const jsonArrayCount = (() => {
    if (!brollPromptsJson) return 0;
    try {
      const arr = JSON.parse(brollPromptsJson) as unknown;
      return Array.isArray(arr) ? arr.length : 0;
    } catch { return 0; }
  })();

  const shouldTrustDesiredScenes =
    !!desiredScenes && desiredScenes > 1 && totalScenes === 1 && parsedCount <= 1 && jsonArrayCount <= 1;

  const sceneCount =
    jsonArrayCount > 1          ? jsonArrayCount  :   // best source: actual JSON array length
    totalScenes > 1             ? totalScenes     :   // backend-reported
    shouldTrustDesiredScenes    ? desiredScenes   :   // fallback when output is still streaming
    parsedCount || desiredScenes || 0;

  // Send the raw JSON output to Prompt Parser — parser reads this key on mount
  const handleSendToParser = () => {
    const payload = brollPromptsJson || brollPromptsPlain;
    try { sessionStorage.setItem(PARSER_INPUT_KEY, payload); } catch { /* ignore */ }
    navigate('/tools/prompt-cleaner');
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-4 bg-[#0d0d0d] border border-[#222222] relative">
        <div className="mb-3 flex items-center justify-between gap-3 border-b border-[#222222] pb-2">
          {/* Left: title + scene count + parse button */}
          <div className="flex flex-col gap-1.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#34d399]">
              B-Roll Scenes Created Successfully
            </h3>
            <div className="flex items-center gap-3">
              <p className="text-xs text-[#8a8a8a]">Total scenes: {sceneCount}</p>
              <button
                type="button"
                onClick={handleSendToParser}
                title="Open output in Prompt Parser"
                className="inline-flex items-center gap-1.5 border border-[#2a2a2a] bg-[#181818] px-2.5 py-1 text-[10px] uppercase tracking-[1.5px] text-[#888888] transition-colors hover:border-[#444444] hover:text-[#f0ede8]"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h7" />
                </svg>
                Parse Each Prompt
              </button>
            </div>
          </div>

          {/* Right: delete only */}
          <button
            type="button"
            onClick={onDeleteBroll}
            disabled={isGenerating}
            className="p-1.5 text-[#ff8c6a] hover:bg-[#20110d] hover:text-[#ffb8a3] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            title="Delete B-Roll output"
            aria-label="Delete B-Roll output"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {/* Download Buttons - JSON and Plain Text */}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => downloadBrollJSON({ brollPromptsJson, brollPromptsPlain })}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#ff3c00] hover:bg-[#ff5a28] border border-[#ff3c00] text-white text-sm font-bold transition-all duration-200 active:scale-[0.98]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download B-Roll JSON (TXT)
            </button>

            {/* Download plain text */}
            <button
              type="button"
              onClick={() => downloadBrollPlainText({ brollPromptsJson, brollPromptsPlain })}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-transparent border border-[#ff3c00] text-[#ff8c6a] hover:bg-[#20110d] text-sm font-bold transition-all duration-200 active:scale-[0.98]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download B-Roll Text (TXT)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

