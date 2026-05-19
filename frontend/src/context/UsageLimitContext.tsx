import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { UsageLimitModal } from '../components/UsageLimitModal';
import { UsageLimitError } from '../services/api.service';

type UsageLimitState = {
  open: boolean;
  tier: string;
  used: number;
  limit: number;
};

type UsageLimitContextValue = {
  /** Call this with any caught error — shows modal if it's a UsageLimitError */
  handleError: (err: unknown) => boolean;
};

const UsageLimitContext = createContext<UsageLimitContextValue | undefined>(undefined);

export function UsageLimitProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<UsageLimitState>({ open: false, tier: 'free', used: 0, limit: 5 });

  const handleError = useCallback((err: unknown): boolean => {
    if (err instanceof UsageLimitError) {
      setState({ open: true, tier: err.tier, used: err.used, limit: err.limit });
      return true;
    }
    return false;
  }, []);

  const close = useCallback(() => setState((s) => ({ ...s, open: false })), []);

  const value = useMemo(() => ({ handleError }), [handleError]);

  return (
    <UsageLimitContext.Provider value={value}>
      {children}
      <UsageLimitModal
        open={state.open}
        tier={state.tier}
        used={state.used}
        limit={state.limit}
        onClose={close}
      />
    </UsageLimitContext.Provider>
  );
}

export function useUsageLimit(): UsageLimitContextValue {
  const ctx = useContext(UsageLimitContext);
  if (!ctx) throw new Error('useUsageLimit must be used within UsageLimitProvider');
  return ctx;
}
