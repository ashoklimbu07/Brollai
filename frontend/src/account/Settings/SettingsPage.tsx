import { useState } from 'react';
import { Crown, Rocket, Sparkle, Zap, type LucideIcon } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ConfirmModal } from '../../tools/ManualStory/ConfirmModal';
import { WorkspaceLayout } from '../../workspace/WorkspaceLayout';

type PlanFeature = { text: string; locked?: boolean };
type PlanConfig = {
  label: string;
  Icon: LucideIcon;
  color: string;
  border: string;
  bg: string;
  glow: string;
  features: PlanFeature[];
};

// Plan definitions — features listed per tier
const PLAN_CONFIG: Record<string, PlanConfig> = {
  admin: {
    label: 'Admin',
    Icon: Crown,
    color: 'text-[#e8380d]',
    border: 'border-[#e8380d]/40',
    bg: 'bg-[#e8380d]/6',
    glow: 'shadow-[0_0_32px_rgba(232,56,13,0.12)]',
    features: [
      { text: 'Unlimited tool outputs' },
      { text: 'Access to all tools' },
      { text: 'User management panel' },
      { text: 'Full tier control' },
      { text: 'Priority processing' },
    ],
  },
  ultra: {
    label: 'Ultra',
    Icon: Zap,
    color: 'text-[#a78bfa]',
    border: 'border-[#a78bfa]/40',
    bg: 'bg-[#a78bfa]/6',
    glow: 'shadow-[0_0_32px_rgba(167,139,250,0.10)]',
    features: [
      { text: 'Unlimited tool outputs' },
      { text: 'Access to all tools' },
      { text: 'Generation history' },
      { text: 'Priority processing' },
      { text: 'Early feature access' },
    ],
  },
  pro: {
    label: 'Pro',
    Icon: Rocket,
    color: 'text-[#34d399]',
    border: 'border-[#34d399]/40',
    bg: 'bg-[#34d399]/6',
    glow: 'shadow-[0_0_32px_rgba(52,211,153,0.08)]',
    features: [
      { text: '20 outputs per month' },
      { text: 'Access to all tools' },
      { text: 'Generation history' },
      { text: 'Other tools' },
      { text: 'Standard processing' },
    ],
  },
  free: {
    label: 'Free',
    Icon: Sparkle,
    color: 'text-[#888888]',
    border: 'border-[#333333]',
    bg: 'bg-[#151515]',
    glow: '',
    features: [
      { text: '3 outputs per month' },
      { text: 'Access to all tools' },
      { text: 'Prompt parser' },
      { text: 'Script splitter' },
      { text: 'Standard processing' },
      { text: 'Generation history', locked: true },
      { text: 'Other tools', locked: true },
    ],
  },
};

export function AccountSettingsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const fullName = user?.name?.trim() || '';
  const [firstName = 'User'] = fullName.split(/\s+/).filter(Boolean);
  const displayName = fullName || firstName;
  const email = user?.email?.trim() || 'No email available';
  const userInitial = firstName.charAt(0).toUpperCase() || 'U';
  const profilePicture = user?.picture?.trim() || '';

  // Determine which plan config to show
  const planKey = user?.role === 'admin' ? 'admin' : (user?.tier ?? 'free');
  const plan = PLAN_CONFIG[planKey]!;

  return (
    <WorkspaceLayout>
      <section className="relative w-full overflow-hidden border border-[#232323] bg-[linear-gradient(180deg,_#131313_0%,_#0d0d0d_100%)] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.45)] sm:p-6 md:p-8">
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,_rgba(255,60,0,0.2)_0%,_rgba(255,60,0,0)_70%)]" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-52 w-52 rounded-full bg-[radial-gradient(circle,_rgba(255,90,40,0.14)_0%,_rgba(255,90,40,0)_72%)]" />

        <div className="relative">
          <p className="text-[11px] uppercase tracking-[2.5px] text-[#ff7b57]">Account</p>
          <h1 className="mt-2 font-['Bebas_Neue'] text-[32px] tracking-[1.2px] text-[#f0ede8] sm:text-[36px]">Settings</h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#9f9f9f]">
            Manage your signed-in profile details and account session.
          </p>
        </div>

        <div className="relative mt-7 border-t border-[#232323] pt-6">
          <div className="flex items-center gap-4 border-b border-[#232323] pb-5">
            {profilePicture ? (
              <img
                src={profilePicture}
                alt={`${displayName} profile`}
                className="h-14 w-14 shrink-0 rounded-full border border-[#2d2d2d] object-cover shadow-[0_0_0_3px_rgba(255,255,255,0.03)]"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#2d2d2d] bg-[#1a1a1a] text-lg font-semibold text-[#f0ede8] shadow-[0_0_0_3px_rgba(255,255,255,0.03)]">
                {userInitial}
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold text-[#f0ede8]">{displayName}</p>
              <p className="truncate text-sm text-[#a0a0a0]">{email}</p>
            </div>
          </div>

          <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-md border border-[#262626] bg-[linear-gradient(180deg,_#181818_0%,_#141414_100%)] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
              <dt className="text-[11px] uppercase tracking-[2px] text-[#777777]">Name</dt>
              <dd className="mt-1 text-sm font-medium text-[#ececec]">{displayName}</dd>
            </div>
            <div className="rounded-md border border-[#262626] bg-[linear-gradient(180deg,_#181818_0%,_#141414_100%)] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
              <dt className="text-[11px] uppercase tracking-[2px] text-[#777777]">Email</dt>
              <dd className="mt-1 break-all text-sm font-medium text-[#ececec]">{email}</dd>
            </div>
          </dl>

          {/* Current plan card */}
          <div className={`mt-6 overflow-hidden border ${plan.border} ${plan.glow}`}>
            {/* Header strip */}
            <div className={`${plan.bg} flex items-center justify-between border-b ${plan.border} px-5 py-3`}>
              <div className="flex items-center gap-2.5">
                <plan.Icon size={18} className={plan.color} strokeWidth={1.5} />
                <p className={`font-['Bebas_Neue'] text-[26px] tracking-[1px] ${plan.color}`}>{plan.label}</p>
                <span className="text-[10px] uppercase tracking-[2px] text-[#555555]">Current Plan</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e] shadow-[0_0_6px_rgba(34,197,94,0.8)] animate-pulse" />
                <span className="text-[10px] uppercase tracking-[1.5px] text-[#22c55e]">Active</span>
              </div>
            </div>

            {/* Body — features left, action right */}
            <div className="flex flex-col gap-0 sm:flex-row">
              {/* Features */}
              <div className="flex-1 bg-[#0d0d0d] px-5 py-4">
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature.text} className="flex items-center gap-2.5 text-sm">
                      <span className={`shrink-0 text-xs font-bold ${feature.locked ? 'text-[#3a3a3a]' : plan.color}`}>
                        {feature.locked ? '✕' : '✓'}
                      </span>
                      <span className={feature.locked ? 'text-[#3a3a3a] line-through' : 'text-[#b0b0b0]'}>
                        {feature.text}
                      </span>
                      {feature.locked && (
                        <span className="ml-auto text-[9px] uppercase tracking-[1px] text-[#444444]">Pro+</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right action panel */}
              <div className={`flex flex-col gap-3 border-t sm:border-t-0 sm:border-l ${plan.border} bg-[#0a0a0a] px-5 py-4 sm:w-56 sm:shrink-0`}>
                <p className="text-[9px] uppercase tracking-[2px] text-[#444444]">Plan Actions</p>
                {planKey === 'admin' && (
                  <button
                    type="button"
                    onClick={() => navigate('/admin')}
                    className={`flex items-center gap-2 border ${plan.border} bg-[#e8380d]/8 px-4 py-2.5 text-sm font-semibold ${plan.color} transition-all hover:bg-[#e8380d]/18 hover:shadow-[0_0_20px_rgba(232,56,13,0.15)] whitespace-nowrap`}
                  >
                    <Crown size={14} strokeWidth={1.5} />
                    <span>Manage Users</span>
                    <span className="ml-auto text-[#e8380d]/50">→</span>
                  </button>
                )}
                {planKey === 'free' && (
                  <button
                    type="button"
                    onClick={() => navigate('/account/pricing')}
                    className="flex items-center gap-2 border border-[#333333] bg-[#151515] px-4 py-2.5 text-sm font-semibold text-[#888888] transition-all hover:border-[#e8380d]/40 hover:text-[#e8380d] whitespace-nowrap"
                  >
                    <span>View Plans</span>
                    <span className="ml-auto">→</span>
                  </button>
                )}
                {(planKey === 'pro' || planKey === 'ultra') && (
                  <button
                    type="button"
                    onClick={() => navigate('/account/pricing')}
                    className={`flex items-center gap-2 border ${plan.border} bg-transparent px-4 py-2.5 text-sm font-semibold ${plan.color} opacity-60 hover:opacity-100 transition-opacity whitespace-nowrap`}
                  >
                    <span>View Plans</span>
                    <span className="ml-auto">→</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Logout */}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setLogoutConfirmOpen(true)}
              className="inline-flex items-center gap-2 border border-[#e8380d]/50 bg-[#e8380d]/10 px-5 py-2.5 text-sm font-semibold uppercase tracking-[1.5px] text-[#e8380d] transition-all hover:bg-[#e8380d]/20 hover:border-[#e8380d] hover:text-[#ff6b40]"
            >
              Logout
            </button>
          </div>
        </div>
      </section>

      <ConfirmModal
        open={logoutConfirmOpen}
        title="Sign out?"
        body="You will need to sign in again to use the workspace."
        cancelLabel="Cancel"
        confirmLabel="Logout"
        tone="danger"
        onCancel={() => setLogoutConfirmOpen(false)}
        onConfirm={() => {
          setLogoutConfirmOpen(false);
          void logout().then(() => navigate('/login', { replace: true }));
        }}
      />
    </WorkspaceLayout>
  );
}
