import type { BrollStyle } from '../../hooks/useBrollGenerator';
import { CircleHelp } from 'lucide-react';

// Shared classes for style option buttons in this legacy component
const baseBtn = 'group relative w-full p-3 border text-left transition-all duration-200';
const activeBtn = 'border-[#ff3c00] bg-[#171717] ring-1 ring-[#ff3c00]/30';
const inactiveBtn = 'border-[#2b2b2b] bg-[#111111] hover:border-[#ff3c00]/70';
const infoBtn =
  'group absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-sm text-[#b0b0b0]/40 transition-opacity hover:text-[#f0ede8] hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#ff3c00]/40';
const tooltip =
  'pointer-events-none absolute bottom-full right-0 z-20 mb-2 w-[280px] rounded border border-[#3a2a25] bg-[#171311] p-2.5 text-left text-[11px] leading-5 text-[#e8ddd7] opacity-0 shadow-[0_12px_30px_rgba(0,0,0,0.45)] transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100';

export function ScriptInputStyleOptions(props: {
  isGenerating: boolean;
  selectedStyle: BrollStyle;
  setSelectedStyle: (style: BrollStyle) => void;
}) {
  const { isGenerating, selectedStyle, setSelectedStyle } = props;

  const btnClass = (style: BrollStyle) =>
    `${baseBtn} ${selectedStyle === style ? activeBtn : inactiveBtn} ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-4 bg-[#0d0d0d] border border-[#222222]">
        <h3 className="text-xs font-bold text-[#ff3c00] uppercase tracking-wider mb-3">
          Select Style
        </h3>

        <div className="space-y-2">
          {/* Transparent Skeleton */}
          <button
            type="button"
            onClick={() => setSelectedStyle('transparent_skeleton')}
            disabled={isGenerating}
            className={btnClass('transparent_skeleton')}
          >
            <button
              type="button"
              aria-label="More info about Transparent Skeleton"
              onClick={(event) => event.stopPropagation()}
              className={infoBtn}
            >
              <CircleHelp size={14} />
              <span className={tooltip}>
                X-ray / translucent character look. Emphasizes see-through bones, subtle internal glow, high contrast edges,
                and a clean dark background for readable "transparent" anatomy shots.
              </span>
            </button>
            <div className="font-bold text-[#f0ede8] text-xs">Transparent Skeleton</div>
            <div className="text-[10px] text-[#888888] mt-0.5">What if translucent character?</div>
          </button>

          {/* 2D Animation */}
          <button
            type="button"
            onClick={() => setSelectedStyle('2d_animation')}
            disabled={isGenerating}
            className={btnClass('2d_animation')}
          >
            <button
              type="button"
              aria-label="More info about 2D Animation"
              onClick={(event) => event.stopPropagation()}
              className={infoBtn}
            >
              <CircleHelp size={14} />
              <span className={tooltip}>
                Hand-drawn 2D style with clean line art, flat colors, and simple backgrounds. Best when your prompt is short
                and clear (who/what/where), so scenes stay consistent and readable.
              </span>
            </button>
            <div className="font-bold text-[#f0ede8] text-xs">2D Animation</div>
            <div className="text-[10px] text-[#888888] mt-0.5">Short prompt, classic hand-drawn look</div>
          </button>

          {/* 2D Nepali Theme */}
          <button
            type="button"
            onClick={() => setSelectedStyle('2d_nepal_theme')}
            disabled={isGenerating}
            className={btnClass('2d_nepal_theme')}
          >
            <button
              type="button"
              aria-label="More info about 2D Nepali Theme"
              onClick={(event) => event.stopPropagation()}
              className={infoBtn}
            >
              <CircleHelp size={14} />
              <span className={tooltip}>
                2D hand-drawn style set entirely in Nepal — Nepali characters in authentic clothing, Newari architecture,
                terraced hills, temples, and festival environments. Supports Nepali and English input.
              </span>
            </button>
            <div className="font-bold text-[#f0ede8] text-xs">2D Nepali Theme</div>
            <div className="text-[10px] text-[#888888] mt-0.5">Nepali characters &amp; cultural setting</div>
          </button>

          {/* Documentary */}
          <button
            type="button"
            onClick={() => setSelectedStyle('documentary')}
            disabled={isGenerating}
            className={btnClass('documentary')}
          >
            <button
              type="button"
              aria-label="More info about Documentary style"
              onClick={(event) => event.stopPropagation()}
              className={infoBtn}
            >
              <CircleHelp size={14} />
              <span className={tooltip}>
                Premium documentary cinematography — photorealistic, handheld energy, natural lighting, and a consistent
                teal-and-orange LUT. Best for real-world stories, biographical content, and social topics.
                Supports 1000–2000 character scripts.
              </span>
            </button>
            <div className="font-bold text-[#f0ede8] text-xs">Documentary</div>
            <div className="text-[10px] text-[#888888] mt-0.5">Photorealistic, cinematic, real-world feel</div>
          </button>
        </div>
      </div>
    </div>
  );
}
