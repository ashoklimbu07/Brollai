import { ExternalLink, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { WorkspaceLayout } from '../../workspace/WorkspaceLayout';
import { useAuth } from '../../auth/AuthContext';

// ─── Tool registry ────────────────────────────────────────────────────────────

type ToolEntry = {
  name: string;
  description: string;
  /** Small red warning shown inside the card */
  warning?: string;
  /** Custom label for the action button — defaults to "Open Tool" */
  linkLabel?: string;
  href: string;
  tier: 'free' | 'pro';
};

const OTHER_TOOLS: ToolEntry[] = [
  {
    name: 'Cutline AI',
    description: 'Advanced version of Video Scene Analyzer — gives both AI image prompts and video prompts, but output has text overlays and noise. Clean the output using the next tool — Prompt Cleaner.',
    href: 'https://cutlineai.vercel.app/',
    tier: 'pro',
  },
  {
    name: 'Prompt Cleaner',
    description: 'Removes text overlays and cleans prompts fully for both image and video — no noise, no clutter.',
    warning: 'Wake up the server before you click the Clean button.',
    href: 'https://aipromptextractor.vercel.app/',
    tier: 'pro',
  },
  {
    name: 'Flow Automation Extension — Beta',
    description: 'Automate your image creation using this browser extension. Download and install the extension to start automation.',
    linkLabel: 'Download Folder',
    href: 'https://drive.google.com/drive/folders/14hHRZun0Yh9Rt_DPie116WPDUCpVmE-O?usp=sharing',
    tier: 'pro',
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export function OtherToolsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const isFree = user?.role !== 'admin' && user?.tier === 'free';

  // ── Free tier: blurred preview + upgrade overlay ──────────────────────────
  if (isFree) {
    return (
      <WorkspaceLayout>
        <section className="relative h-full w-full overflow-hidden border border-[#222222] bg-[#111111] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:p-6 md:p-8 lg:p-10">

          {/* Blurred fake content */}
          <div className="pointer-events-none select-none blur-sm opacity-40">
            <div className="mb-8">
              <h1 className="font-['Bebas_Neue'] text-[28px] tracking-[1px] text-[#f0ede8] sm:text-[36px] lg:text-[40px]">
                Other Tools
              </h1>
              <p className="mt-1 text-sm text-[#8a8a8a]">
                Access to already deployed tools. Pro and above unlocks the full catalogue.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {OTHER_TOOLS.map((tool) => (
                <div key={tool.name} className="flex flex-col gap-4 bg-[#0f0f0f] p-5">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-[#f0ede8]">{tool.name}</span>
                      {tool.tier === 'pro' && (
                        <span className="border border-[#a78bfa]/40 bg-[#a78bfa]/10 px-1.5 py-0.5 text-[9px] uppercase tracking-[2px] text-[#a78bfa]">
                          Pro+
                        </span>
                      )}
                    </div>
                    <p className="text-xs leading-5 text-[#666666]">{tool.description}</p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 border border-[#2a2a2a] bg-[#181818] px-3 py-1.5 text-[11px] text-[#aaaaaa]">
                    <ExternalLink size={11} /> {tool.linkLabel ?? 'Open Tool'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upgrade overlay — same pattern as HistoryPage */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full max-w-md border border-[#e8380d]/30 bg-[#0d0d0d]/95 p-8 text-center shadow-[0_0_60px_rgba(232,56,13,0.12)]">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center border border-[#e8380d]/30 bg-[#e8380d]/10">
                <Lock size={20} className="text-[#e8380d]" />
              </div>
              <h2 className="font-['Bebas_Neue'] text-[28px] tracking-[1px] text-[#f0ede8]">
                Other Tools Locked
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#888888]">
                Access to deployed tools is available on{' '}
                <span className="font-medium text-[#34d399]">Pro</span> and above.
                Upgrade to unlock the full catalogue.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/account/pricing')}
                  className="w-full border border-[#e8380d]/50 bg-[#e8380d]/10 py-3 text-xs font-semibold uppercase tracking-[2px] text-[#e8380d] transition-all hover:border-[#e8380d] hover:bg-[#e8380d]/20"
                >
                  View Plans → Upgrade
                </button>
                <p className="text-[10px] uppercase tracking-[1.5px] text-[#444444]">
                  Contact admin for access
                </p>
              </div>
            </div>
          </div>

        </section>
      </WorkspaceLayout>
    );
  }

  // ── Pro+ tier: full access ────────────────────────────────────────────────
  return (
    <WorkspaceLayout>
      <section className="h-full w-full overflow-y-auto border border-[#222222] bg-[#111111] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:p-6 md:p-8 lg:p-10">

        <div className="mb-8">
          <h1 className="font-['Bebas_Neue'] text-[28px] tracking-[1px] sm:text-[36px] lg:text-[40px]">
            Other Tools
          </h1>
          <p className="mt-1 text-sm leading-5 text-[#8a8a8a]">
            Access to already deployed tools outside this workspace.{' '}
            <span className="text-[#cccccc]">Pro and above</span> unlocks the full catalogue.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {OTHER_TOOLS.map((tool, i) => (
            <div
              key={tool.name}
              style={{ animationDelay: `${i * 100}ms` }}
              className="group relative flex flex-col justify-between gap-4 overflow-hidden bg-[#0f0f0f] p-5
                         opacity-0 animate-[fadeSlideUp_0.45s_ease_forwards]
                         transition-all duration-300
                         hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
            >
              {/* Subtle red glow line on hover */}
              <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e8380d]/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold text-[#f0ede8]">{tool.name}</span>
                  {tool.tier === 'pro' && (
                    <span className="border border-[#a78bfa]/40 bg-[#a78bfa]/10 px-1.5 py-0.5 text-[9px] uppercase tracking-[2px] text-[#a78bfa]">
                      Pro+
                    </span>
                  )}
                </div>
                <p className="text-xs leading-5 text-[#666666]">{tool.description}</p>
                {tool.warning && (
                  <p className="text-xs text-[#e8380d]">⚠ {tool.warning}</p>
                )}
              </div>

              <a
                href={tool.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 border border-[#2a2a2a] bg-[#181818] px-3 py-1.5 text-[11px] text-[#aaaaaa]
                           transition-all duration-200
                           hover:border-[#e8380d]/40 hover:bg-[#e8380d]/8 hover:text-[#e8380d]"
              >
                <ExternalLink size={11} />
                {tool.linkLabel ?? 'Open Tool'}
              </a>
            </div>
          ))}
        </div>

        {/* Keyframe for card entrance */}
        <style>{`
          @keyframes fadeSlideUp {
            from { opacity: 0; transform: translateY(16px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>

      </section>
    </WorkspaceLayout>
  );
}
