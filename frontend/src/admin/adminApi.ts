import { getAuthHeaders } from '../auth/authToken';

const DEFAULT_LOCAL_API_BASE_URL = 'http://localhost:3000/api';

const normalizeApiBaseUrl = (rawBaseUrl?: string): string => {
  const trimmed = (rawBaseUrl || DEFAULT_LOCAL_API_BASE_URL).replace(/\/+$/, '');
  return /\/api$/i.test(trimmed) ? trimmed : `${trimmed}/api`;
};

const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL);

export type AdminUser = {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  tier: 'free' | 'pro' | 'ultra';
  usageCount: number;
  usageResetAt?: string;
  tierStartedAt?: string;
  lastLoginAt?: string;
  createdAt: string;
  provider: string;
};

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...(init?.headers ?? {}),
    },
    credentials: 'include',
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(body.error ?? `Request failed (${res.status})`);
  }

  return res.json() as Promise<T>;
}

export const adminApi = {
  /** Fetch all users */
  getUsers: () => apiFetch<{ users: AdminUser[] }>('/admin/users').then((d) => d.users),

  /** Update a user's tier */
  setTier: (id: string, tier: string) =>
    apiFetch<{ user: AdminUser }>(`/admin/users/${id}/tier`, {
      method: 'PUT',
      body: JSON.stringify({ tier }),
    }).then((d) => d.user),

  /** Reset a user's usage counter */
  resetUsage: (id: string) =>
    apiFetch<{ user: AdminUser }>(`/admin/users/${id}/reset-usage`, {
      method: 'POST',
    }).then((d) => d.user),
};
