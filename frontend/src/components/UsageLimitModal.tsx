import { useNavigate } from 'react-router-dom';

type Props = {
  open: boolean;
  tier: string;
  used: number;
  limit: number;
  onClose: () => void;
};

const TIER_LABELS: Record<string, string> = {
  free: 'Free',
  pro: 'Pro',
  ultra: 'Ultra',
};

const UPGRADE_MAP: Record<string, { next: string; icon: string }> = {
  free: { next: 'Pro (20 outputs/month)', icon: '🚀' },
  pro:  { next: 'Ultra (unlimited)',       icon: '⚡' },
};

export function UsageLimitModal({ open, tier, used, limit, onClose }: Props) {
  const navigate = useNavigate();

  if (!open) return null;

  const tierLabel = TIER_LABELS[tier] ?? tier;
  const upgrade = UPGRADE_MAP[tier];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md border border-[#e8380d]/30 bg-[#0f0f0f] shadow-[0_0_60px_rgba(232,56,13,0.15)]">
        {/* Header */}
        <div className="border-b border-[#e8380d]/20 bg-[#e8380d]/6 px-6 py-4">
          <p className="text-[10px] uppercase tracking-[3px] text-[#e8380d]">Limit Reached</p>
          <h2 className="mt-1 font-['Bebas_Neue'] text-[28px] tracking-[1px] text-[#f0ede8]">
            Output Limit Reached
          </h2>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-[#9a9a9a] leading-relaxed">
            You've used <span className="text-[#f0ede8] font-semibold">{used} / {limit}</span> outputs
            on the <span className="text-[#e8380d] font-semibold">{tierLabel}</span> plan this month.
          </p>

          {/* Usage bar */}
          <div className="space-y-1.5">
            <div className="h-1.5 w-full bg-[#222222] overflow-hidden">
              <div
                className="h-full bg-[#e8380d] transition-all"
                style={{ width: `${Math.min((used / limit) * 100, 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-[#555555] uppercase tracking-[1.5px]">{used} of {limit} outputs used</p>
          </div>

          {upgrade ? (
            <div className="border border-[#252525] bg-[#141414] px-4 py-3">
              <p className="text-[10px] uppercase tracking-[2px] text-[#555555]">Upgrade to</p>
              <p className="mt-0.5 text-sm font-semibold text-[#f0ede8]">
                {upgrade.icon} {upgrade.next}
              </p>
              <p className="mt-1 text-xs text-[#666666]">
                Get more outputs and unlock unlimited access.
              </p>
            </div>
          ) : null}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 border-t border-[#1e1e1e] px-6 py-4">
          {upgrade ? (
            <button
              type="button"
              onClick={() => { onClose(); navigate('/account/pricing'); }}
              className="flex-1 border border-[#e8380d]/50 bg-[#e8380d]/10 py-2.5 text-xs font-semibold uppercase tracking-[1.5px] text-[#e8380d] transition-all hover:bg-[#e8380d]/20 hover:border-[#e8380d]"
            >
              View Plans
            </button>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-[#2a2a2a] bg-[#161616] py-2.5 text-xs font-semibold uppercase tracking-[1.5px] text-[#888888] transition-colors hover:text-[#f0ede8]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
