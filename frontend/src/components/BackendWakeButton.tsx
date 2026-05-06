const DEFAULT_LOCAL_API_BASE_URL = 'http://localhost:3000/api';

const normalizeApiBaseUrl = (rawBaseUrl?: string): string => {
  const trimmed = (rawBaseUrl || DEFAULT_LOCAL_API_BASE_URL).replace(/\/+$/, '');
  return /\/api$/i.test(trimmed) ? trimmed : `${trimmed}/api`;
};

const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL);
const BACKEND_HEALTH_URL = `${API_BASE_URL}/health`;

export const BackendWakeButton = () => {
  const handleWakeServer = () => {
    window.open(BACKEND_HEALTH_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="mt-4 border border-[#222222] bg-[#0d0d0d] p-3 text-left">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#666666]">Server Status</p>
      <p className="mt-2 text-sm text-[#9fefc3]">
        Serving running OK. Click the button to wake/open backend health page.
      </p>
      <button
        type="button"
        onClick={handleWakeServer}
        className="mt-3 inline-flex items-center gap-2 border border-[#ff3c00] bg-[#ff3c00]/10 px-4 py-2 text-sm font-semibold text-[#ff8c6a] transition-all duration-200 hover:bg-[#ff3c00]/20"
      >
        Wake Up Server
      </button>
    </div>
  );
};
