import { useCallback, useEffect, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { WorkspaceLayout } from '../workspace/WorkspaceLayout';
import { adminApi, type AdminUser } from './adminApi';
import { ConfirmModal } from '../tools/ManualStory/ConfirmModal';

const TIER_OPTIONS = ['free', 'pro', 'ultra'] as const;

const TIER_COLORS: Record<string, string> = {
  free:  'text-[#888888] border-[#444444] bg-[#1a1a1a]',
  pro:   'text-[#34d399] border-[#34d399]/40 bg-[#34d399]/8',
  ultra: 'text-[#a78bfa] border-[#a78bfa]/40 bg-[#a78bfa]/8',
};

const ROLE_COLORS: Record<string, string> = {
  admin: 'text-[#e8380d] border-[#e8380d]/40 bg-[#e8380d]/8',
  user:  'text-[#888888] border-[#333333] bg-[#1a1a1a]',
};

// Usage cap per tier — ∞ for unlimited
const TIER_LIMIT_LABEL: Record<string, string> = {
  free:  '3',
  pro:   '20',
  ultra: '∞',
};

const TIER_LIMIT_COLOR: Record<string, string> = {
  free:  'text-[#666666]',
  pro:   'text-[#34d399]',
  ultra: 'text-[#a78bfa]',
};

function formatDate(dateStr?: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

/** Returns renewal date (tierStartedAt + 30 days) and days remaining */
function getRenewal(user: AdminUser): { date: string; daysLeft: number } | null {
  // Admin has no cycle
  if (user.role === 'admin') return null;

  // Use tierStartedAt if set, else fall back to createdAt (free default)
  const startStr = user.tierStartedAt ?? user.createdAt;
  if (!startStr) return null;

  const startMs = new Date(startStr).getTime();
  const renewalMs = startMs + 30 * 24 * 60 * 60 * 1000;
  const daysLeft = Math.ceil((renewalMs - Date.now()) / (24 * 60 * 60 * 1000));

  return {
    date: new Date(renewalMs).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric',
    }),
    daysLeft,
  };
}

export function AdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [resetingId, setResetingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  const [pendingTierChange, setPendingTierChange] = useState<{
    user: AdminUser;
    newTier: string;
  } | null>(null);

  const [pendingReset, setPendingReset] = useState<AdminUser | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.getUsers();
      setUsers(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  // Filter by email or name — case-insensitive
  const filteredUsers = searchQuery.trim()
    ? users.filter((u) =>
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users;

  const applyTierChange = async (user: AdminUser, tier: string) => {
    setSavingId(user._id);
    setError(null);
    try {
      const updated = await adminApi.setTier(user._id, tier);
      setUsers((prev) => prev.map((u) => u._id === updated._id ? { ...u, ...updated } : u));
      setSuccessId(user._id);
      setTimeout(() => setSuccessId(null), 1500);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update tier');
    } finally {
      setSavingId(null);
    }
  };

  const handleTierSelectChange = (user: AdminUser, newTier: string) => {
    if (newTier === (user.tier ?? 'free')) return;
    setPendingTierChange({ user: { ...user, tier: (user.tier ?? 'free') as AdminUser['tier'] }, newTier });
  };

  const applyResetUsage = async (user: AdminUser) => {
    setResetingId(user._id);
    setError(null);
    try {
      await adminApi.resetUsage(user._id);
      setUsers((prev) => prev.map((u) => u._id === user._id ? { ...u, usageCount: 0 } : u));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to reset usage');
    } finally {
      setResetingId(null);
    }
  };

  return (
    <WorkspaceLayout>
      <section className="relative w-full overflow-hidden border border-[#232323] bg-[linear-gradient(180deg,_#131313_0%,_#0d0d0d_100%)] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.45)] sm:p-6 md:p-8">
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,_rgba(255,60,0,0.15)_0%,_rgba(255,60,0,0)_70%)]" />

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[2.5px] text-[#ff7b57]">Admin</p>
            <h1 className="mt-2 font-['Bebas_Neue'] text-[32px] tracking-[1.2px] text-[#f0ede8] sm:text-[36px]">
              User Management
            </h1>
            <p className="mt-2 text-sm text-[#9f9f9f]">
              View all registered users, change their tier, and reset usage.
            </p>
          </div>
          <button
            type="button"
            onClick={() => { void load(); }}
            disabled={loading}
            className="mt-2 shrink-0 border border-[#2a2a2a] bg-[#161616] p-2 text-[#888888] transition-colors hover:text-[#f0ede8] disabled:opacity-50"
            title="Refresh"
          >
            <RotateCcw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {error && (
          <div className="mt-4 border border-[#4a1f1f] bg-[#2a1414] px-4 py-2 text-sm text-[#ff8d8d]">
            {error}
          </div>
        )}

        {!loading && (
          <div className="mt-5 flex flex-wrap gap-4 border border-[#242424] bg-[#0f0f0f] px-5 py-3">
            <div className="text-center">
              <p className="text-[20px] font-['Bebas_Neue'] tracking-[1px] text-[#f0ede8]">{users.length}</p>
              <p className="text-[10px] uppercase tracking-[1.5px] text-[#555555]">Total Users</p>
            </div>
            <div className="w-px bg-[#242424]" />
            {(['free', 'pro', 'ultra'] as const).map((tier) => (
              <div key={tier} className="text-center">
                <p className={`text-[20px] font-['Bebas_Neue'] tracking-[1px] ${TIER_COLORS[tier].split(' ')[0]}`}>
                  {users.filter((u) => u.role !== 'admin' && (u.tier ?? 'free') === tier).length}
                </p>
                <p className="text-[10px] uppercase tracking-[1.5px] text-[#555555]">{tier}</p>
              </div>
            ))}
            <div className="w-px bg-[#242424]" />
            <div className="text-center">
              <p className="text-[20px] font-['Bebas_Neue'] tracking-[1px] text-[#e8380d]">
                {users.filter((u) => u.role === 'admin').length}
              </p>
              <p className="text-[10px] uppercase tracking-[1.5px] text-[#555555]">Admins</p>
            </div>
          </div>
        )}

        {/* Search bar */}
        <div className="mt-5 flex items-center gap-2 border border-[#242424] bg-[#0f0f0f] px-4 py-2">
          <span className="text-[#444444] text-sm">⌕</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by email or name…"
            className="flex-1 bg-transparent text-sm text-[#f0ede8] placeholder:text-[#444444] outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-[#555555] hover:text-[#f0ede8] text-xs transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        <div className="mt-3 overflow-x-auto">
          {loading ? (
            <div className="space-y-2 animate-pulse">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 border border-[#242424] bg-[#171717]" />
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <p className="text-sm text-[#888888]">
              {searchQuery ? `No users match "${searchQuery}".` : 'No users found.'}
            </p>
          ) : (
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#242424] text-left">
                  <th className="pb-2 pr-4 text-[10px] uppercase tracking-[2px] text-[#555555]">User</th>
                  <th className="pb-2 pr-4 text-[10px] uppercase tracking-[2px] text-[#555555]">Role</th>
                  <th className="pb-2 pr-4 text-[10px] uppercase tracking-[2px] text-[#555555]">Tier</th>
                  <th className="pb-2 pr-4 text-[10px] uppercase tracking-[2px] text-[#555555]">Usage</th>
                  <th className="pb-2 pr-4 text-[10px] uppercase tracking-[2px] text-[#555555]">Last Login</th>
                  <th className="pb-2 pr-4 text-[10px] uppercase tracking-[2px] text-[#555555]">Renewal</th>
                  <th className="pb-2 text-[10px] uppercase tracking-[2px] text-[#555555]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e1e]">
                {filteredUsers.map((user) => {
                  const isAdmin = user.role === 'admin';
                  const isSaving = savingId === user._id;
                  const isReseting = resetingId === user._id;
                  const isSuccess = successId === user._id;
                  const effectiveTier = user.tier ?? 'free';
                  const renewal = getRenewal(user);

                  return (
                    <tr key={user._id} className="group hover:bg-[#141414] transition-colors">
                      <td className="py-3 pr-4">
                        <p className="font-medium text-[#f0ede8] truncate max-w-[180px]">{user.name}</p>
                        <p className="text-xs text-[#666666] truncate max-w-[180px]">{user.email}</p>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`border px-2 py-0.5 text-[9px] uppercase tracking-[1.5px] font-semibold ${ROLE_COLORS[user.role ?? 'user']}`}>
                          {isAdmin ? '👑 Admin' : 'User'}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        {isAdmin ? (
                          <span className="text-xs text-[#555555]">—</span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <select
                              value={effectiveTier}
                              disabled={isSaving}
                              onChange={(e) => handleTierSelectChange(user, e.target.value)}
                              className={`border bg-[#111111] px-2 py-1 text-xs focus:outline-none disabled:opacity-60 ${TIER_COLORS[effectiveTier]}`}
                            >
                              {TIER_OPTIONS.map((t) => (
                                <option key={t} value={t}>{t}</option>
                              ))}
                            </select>
                            {isSaving && <span className="text-[10px] text-[#666666]">Saving…</span>}
                            {isSuccess && <span className="text-[10px] text-[#22c55e]">✓ Saved</span>}
                          </div>
                        )}
                      </td>
                      {/* Usage: used / limit */}
                      <td className="py-3 pr-4">
                        {isAdmin ? (
                          <span className="text-xs text-[#555555]">∞</span>
                        ) : (
                          <span className="text-xs tabular-nums text-[#c0c0c0]">
                            {user.usageCount ?? 0}
                            <span className="text-[#444444]"> / </span>
                            <span className={TIER_LIMIT_COLOR[effectiveTier]}>
                              {TIER_LIMIT_LABEL[effectiveTier]}
                            </span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 pr-4 text-xs text-[#666666]">
                        {formatDate(user.lastLoginAt)}
                      </td>
                      {/* Renewal date — 30 days from tierStartedAt or createdAt */}
                      <td className="py-3 pr-4">
                        {isAdmin || !renewal ? (
                          <span className="text-xs text-[#555555]">—</span>
                        ) : (
                          <div>
                            <p className="text-xs text-[#c0c0c0]">{renewal.date}</p>
                            <p className={`text-[10px] ${renewal.daysLeft <= 5 ? 'text-[#e8380d]' : 'text-[#555555]'}`}>
                              {renewal.daysLeft > 0 ? `${renewal.daysLeft}d left` : 'Expired'}
                            </p>
                          </div>
                        )}
                      </td>
                      <td className="py-3">
                        {!isAdmin && (
                          <button
                            type="button"
                            disabled={isReseting}
                            onClick={() => setPendingReset(user)}
                            title="Reset usage count"
                            className="inline-flex items-center gap-1 border border-[#2a2a2a] bg-[#161616] px-2 py-1 text-[10px] uppercase tracking-[1px] text-[#888888] transition-colors hover:border-[#e8380d]/50 hover:text-[#e8380d] disabled:opacity-50"
                          >
                            <RotateCcw size={10} className={isReseting ? 'animate-spin' : ''} />
                            Reset
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Tier change confirmation */}
      <ConfirmModal
        open={pendingTierChange !== null}
        title="Change Tier?"
        body={
          pendingTierChange
            ? `Change ${pendingTierChange.user.name}'s tier from "${pendingTierChange.user.tier}" to "${pendingTierChange.newTier}"?`
            : ''
        }
        cancelLabel="Cancel"
        confirmLabel="Yes, Change"
        onCancel={() => setPendingTierChange(null)}
        onConfirm={() => {
          if (!pendingTierChange) return;
          const { user, newTier } = pendingTierChange;
          setPendingTierChange(null);
          void applyTierChange(user, newTier);
        }}
      />

      {/* Reset usage confirmation */}
      <ConfirmModal
        open={pendingReset !== null}
        title="Reset Usage?"
        body={
          pendingReset
            ? `Reset ${pendingReset.name}'s usage back to 0? They'll get their full quota back immediately.`
            : ''
        }
        cancelLabel="Cancel"
        confirmLabel="Yes, Reset"
        tone="danger"
        onCancel={() => setPendingReset(null)}
        onConfirm={() => {
          if (!pendingReset) return;
          const user = pendingReset;
          setPendingReset(null);
          void applyResetUsage(user);
        }}
      />
    </WorkspaceLayout>
  );
}
