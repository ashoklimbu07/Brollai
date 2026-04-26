import type { BrollStyle } from '../../hooks/useBrollGenerator';
import { CircleHelp } from 'lucide-react';

export function ScriptInputStyleOptions(props: {
  isGenerating: boolean;
  selectedStyle: BrollStyle;
  setSelectedStyle: (style: BrollStyle) => void;
}) {
  const { isGenerating, selectedStyle, setSelectedStyle } = props;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-4 bg-[#0d0d0d] border border-[#222222]">
        <h3 className="text-xs font-bold text-[#ff3c00] uppercase tracking-wider mb-3">
          Select Style
        </h3>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setSelectedStyle('transparent_skeleton')}
            disabled={isGenerating}
            className={`group relative w-full p-3 border text-left transition-all duration-200 ${
              selectedStyle === 'transparent_skeleton'
                ? 'border-[#ff3c00] bg-[#171717] ring-1 ring-[#ff3c00]/30'
                : 'border-[#2b2b2b] bg-[#111111] hover:border-[#ff3c00]/70'
            } ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <button
              type="button"
              aria-label="More info about Transparent Skeleton"
              onClick={(event) => event.stopPropagation()}
              className="group absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-sm text-[#b0b0b0]/40 transition-opacity hover:text-[#f0ede8] hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#ff3c00]/40"
            >
              <CircleHelp size={14} />
              <span className="pointer-events-none absolute bottom-full right-0 z-20 mb-2 w-[280px] rounded border border-[#3a2a25] bg-[#171311] p-2.5 text-left text-[11px] leading-5 text-[#e8ddd7] opacity-0 shadow-[0_12px_30px_rgba(0,0,0,0.45)] transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">
                X-ray / translucent character look. Emphasizes see-through bones, subtle internal glow, high contrast edges,
                and a clean dark background for readable “transparent” anatomy shots.
              </span>
            </button>

            <div className="font-bold text-[#f0ede8] text-xs">Transparent Skeleton</div>
            <div className="text-[10px] text-[#888888] mt-0.5">What if translucent character?</div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedStyle('2d_animation')}
            disabled={isGenerating}
            className={`group relative w-full p-3 border text-left transition-all duration-200 ${
              selectedStyle === '2d_animation'
                ? 'border-[#ff3c00] bg-[#171717] ring-1 ring-[#ff3c00]/30'
                : 'border-[#2b2b2b] bg-[#111111] hover:border-[#ff3c00]/70'
            } ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#f0ede8] text-xs">2D Animation</span>
            </div>
            <button
              type="button"
              aria-label="More info about 2D Animation"
              onClick={(event) => event.stopPropagation()}
              className="group absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-sm text-[#b0b0b0]/40 transition-opacity hover:text-[#f0ede8] hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#ff3c00]/40"
            >
              <CircleHelp size={14} />
              <span className="pointer-events-none absolute bottom-full right-0 z-20 mb-2 w-[280px] rounded border border-[#3a2a25] bg-[#171311] p-2.5 text-left text-[11px] leading-5 text-[#e8ddd7] opacity-0 shadow-[0_12px_30px_rgba(0,0,0,0.45)] transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">
                Hand-drawn 2D style with clean line art, flat colors, and simple backgrounds. Best when your prompt is short
                and clear (who/what/where), so scenes stay consistent and readable.
              </span>
            </button>
            <div className="text-[10px] text-[#888888] mt-0.5">
              Short prompt, classic hand-drawn look
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

