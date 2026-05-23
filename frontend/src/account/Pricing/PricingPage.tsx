import { useAuth } from '../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { WorkspaceLayout } from '../../workspace/WorkspaceLayout';
import { Crown, Rocket, Sparkle, Zap, type LucideIcon } from 'lucide-react';

type PlanKey = 'free' | 'pro' | 'ultra' | 'admin';

const PLANS: {
  key: PlanKey;
  label: string;
  Icon: LucideIcon;
  color: string;
  border: string;
  bg: string;
  glow: string;
  price: string;
  outputs: string;
  features: { text: string; locked?: boolean }[];
}[] = [
  {
    key: 'free',
    label: 'Free',
    Icon: Sparkle,
    color: 'text-[#888888]',
    border: 'border-[#333333]',
    bg: 'bg-[#111111]',
    glow: '',
    price: '$0',
    outputs: '3 outputs / month',
    features: [
      { text: 'B-roll generator' },
      { text: 'Video scene analyzer' },
      { text: 'Script translator' },
      { text: 'Manual story builder' },
      { text: 'Prompt parser' },
      { text: 'Script splitter' },
      { text: 'Generation history', locked: true },
      { text: 'Other tools', locked: true },
    ],
  },
  {
    key: 'pro',
    label: 'Pro',
    Icon: Rocket,
    color: 'text-[#34d399]',
    border: 'border-[#34d399]/40',
    bg: 'bg-[#111111]',
    glow: 'shadow-[0_0_40px_rgba(52,211,153,0.07)]',
    price: '$4.99',
    outputs: '20 outputs / month',
    features: [
      { text: 'Everything in Free' },
      { text: '20 outputs per month' },
      { text: 'Generation history' },
      { text: 'Other tools access' },
    ],
  },
  {
    key: 'ultra',
    label: 'Ultra',
    Icon: Zap,
    color: 'text-[#a78bfa]',
    border: 'border-[#a78bfa]/40',
    bg: 'bg-[#111111]',
    glow: 'shadow-[0_0_40px_rgba(167,139,250,0.08)]',
    price: '$15.99',
    outputs: 'Unlimited outputs',
    features: [
      { text: 'Everything in Pro' },
      { text: 'Unlimited generations' },
      { text: 'Priority processing' },
      { text: 'Early feature access' },
    ],
  },
];

const ADMIN_PLAN = {
  key: 'admin' as PlanKey,
  label: 'Admin',
  Icon: Crown,
  color: 'text-[#e8380d]',
  border: 'border-[#e8380d]/40',
  bg: 'bg-[#111111]',
  glow: 'shadow-[0_0_40px_rgba(232,56,13,0.10)]',
  price: 'Internal',
  outputs: 'Unlimited outputs',
  features: [
    { text: 'No restrictions', locked: false },
    { text: 'All tools unlocked', locked: false },
    { text: 'User management panel', locked: false },
    { text: 'Tier control for all users', locked: false },
    { text: 'Priority processing', locked: false },
    { text: 'Full platform access', locked: false },
  ],
};

function PlanCard({
  plan,
  isCurrentPlan,
}: {
  plan: typeof PLANS[number] | typeof ADMIN_PLAN;
  isCurrentPlan: boolean;
}) {
  return (
    <div className={`relative flex flex-col border ${plan.border} ${plan.bg} ${plan.glow} overflow-hidden transition-all`}>
      {isCurrentPlan && (
        <div className={`absolute right-0 top-0 border-b border-l ${plan.border} px-2.5 py-1 text-[9px] uppercase tracking-[2px] font-semibold ${plan.color}`}>
          Current Plan
        </div>
      )}
      <div className={`border-b ${plan.border} px-5 py-4`}>
        <div className="flex items-center gap-2">
          <plan.Icon size={20} className={plan.color} strokeWidth={1.5} />
          <p className={`font-['Bebas_Neue'] text-[26px] tracking-[1px] ${plan.color}`}>{plan.label}</p>
        </div>
        <p className={`mt-1 font-['Bebas_Neue'] text-[32px] leading-none tracking-tight ${plan.color}`}>
          {plan.price}
          {plan.price !== '$0' && plan.price !== 'Internal' && (
            <span className="text-[14px] font-normal tracking-normal text-[#666666] ml-1">/mo</span>
          )}
        </p>
        <p className="mt-1 text-sm font-medium text-[#f0ede8]">{plan.outputs}</p>
      </div>
      <div className="flex-1 px-5 py-4">
        <ul className="space-y-2.5">
          {plan.features.map((f) => (
            <li key={f.text} className="flex items-start gap-2.5 text-sm">
              <span className={`mt-0.5 shrink-0 text-xs font-bold ${f.locked ? 'text-[#444444]' : plan.color}`}>
                {f.locked ? '✕' : '✓'}
              </span>
              <span className={f.locked ? 'text-[#444444] line-through' : 'text-[#b0b0b0]'}>{f.text}</span>
              {f.locked && (
                <span className="ml-auto shrink-0 border border-[#333333] px-1.5 py-0.5 text-[9px] uppercase tracking-[1px] text-[#555555]">
                  Pro+
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className={`border-t ${plan.border} px-5 py-4`}>
        {isCurrentPlan ? (
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e] animate-pulse shadow-[0_0_6px_rgba(34,197,94,0.8)]" />
            <span className="text-xs text-[#555555] uppercase tracking-[1.5px]">Active</span>
          </div>
        ) : (
          <p className="text-xs text-[#555555] leading-relaxed">
            Contact admin to upgrade —{' '}
            <span className="text-[#888888]">reach out directly for plan access.</span>
          </p>
        )}
      </div>
    </div>
  );
}

export function PricingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';
  const currentTier = isAdmin ? 'admin' : (user?.tier ?? 'free');

  return (
    <WorkspaceLayout>
      <section className="relative w-full overflow-hidden border border-[#232323] bg-[linear-gradient(180deg,_#131313_0%,_#0d0d0d_100%)] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.45)] sm:p-6 md:p-8">
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,_rgba(255,60,0,0.15)_0%,_rgba(255,60,0,0)_70%)]" />

        <div className="relative">
          <p className="text-[11px] uppercase tracking-[2.5px] text-[#ff7b57]">Account</p>
          <h1 className="mt-2 font-['Bebas_Neue'] text-[32px] tracking-[1.2px] text-[#f0ede8] sm:text-[36px]">Pricing</h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#9f9f9f]">
            {isAdmin
              ? 'You have full admin access with no restrictions.'
              : 'Choose the plan that fits your workflow. Contact admin to upgrade.'}
          </p>
        </div>

        {isAdmin && (
          <div className="relative mt-8 max-w-sm">
            <PlanCard plan={ADMIN_PLAN} isCurrentPlan={true} />
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {PLANS.map((plan) => (
            <PlanCard
              key={plan.key}
              plan={plan}
              isCurrentPlan={!isAdmin && currentTier === plan.key}
            />
          ))}
        </div>

        {!isAdmin && (
          <div className="mt-6 flex items-start justify-between gap-4 border border-[#252525] bg-[#0f0f0f] px-5 py-4">
            <p className="text-xs text-[#666666] leading-relaxed">
              <span className="text-[#888888] font-medium">Want to upgrade?</span>{' '}
              There's no self-serve payment yet. Contact the admin directly to get your tier updated.
            </p>
            {currentTier === 'free' && (
              <button
                type="button"
                onClick={() => navigate('/extra/history')}
                className="shrink-0 border border-[#e8380d]/40 bg-[#e8380d]/8 px-3 py-1.5 text-[10px] uppercase tracking-[1.5px] text-[#e8380d] transition-colors hover:bg-[#e8380d]/15"
              >
                See what you're missing
              </button>
            )}
          </div>
        )}
      </section>
    </WorkspaceLayout>
  );
}
