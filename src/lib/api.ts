export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://rydra-be.onrender.com/api'
    : 'http://localhost:5002/api');

// In-Memory SWR Client Cache for Instant Admin Navigation
interface CacheRecord<T = any> {
  data: T;
  timestamp: number;
}
const adminCache = new Map<string, CacheRecord>();
const inFlightAdminRequests = new Map<string, Promise<any>>();

export function invalidateAdminCache(pattern?: string) {
  if (!pattern) {
    adminCache.clear();
    return;
  }
  for (const k of adminCache.keys()) {
    if (k.includes(pattern)) adminCache.delete(k);
  }
}

async function fetcher<T>(
  endpoint: string,
  options?: RequestInit & { ttlMs?: number; skipCache?: boolean }
): Promise<T> {
  const method = (options?.method || 'GET').toUpperCase();
  const isGet = method === 'GET';
  const cacheKey = `${method}:${endpoint}`;
  const ttl = options?.ttlMs ?? 15000; // 15s default SWR window

  // Instant SWR Hit
  if (isGet && !options?.skipCache) {
    const cached = adminCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data as T;
    }
  }

  // Deduplicate concurrent in-flight requests
  if (isGet && inFlightAdminRequests.has(cacheKey)) {
    return inFlightAdminRequests.get(cacheKey)!;
  }

  const runRequest = async () => {
    try {
      let authHeader = 'Bearer jwt_mock_token_usr_superadmin_SUPER_ADMIN';
      if (typeof window !== 'undefined') {
        const storedToken = localStorage.getItem('rydra_admin_token');
        if (storedToken) {
          authHeader = `Bearer ${storedToken}`;
        }
      }

      const res = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
        ...options,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP error ${res.status}`);
      }

      const data = await res.json();

      // Store in SWR cache
      if (isGet) {
        adminCache.set(cacheKey, { data, timestamp: Date.now() });
      } else {
        // Automatically invalidate related caches on mutation
        invalidateAdminCache();
      }

      return data as T;
    } catch (error: any) {
      console.error(`API Fetch Error [${endpoint}]:`, error.message);
      throw error;
    }
  };

  const promise = runRequest();
  if (isGet) {
    inFlightAdminRequests.set(cacheKey, promise);
    promise.finally(() => inFlightAdminRequests.delete(cacheKey));
  }

  return promise;
}

export const adminApi = {
  getAnalytics: () => fetcher<any>('/admin/analytics'),
  getUsers: (params?: { search?: string; role?: string; status?: string }) => {
    const q = new URLSearchParams(params as any).toString();
    return fetcher<{ users: any[] }>(`/admin/users?${q}`);
  },
  login: (email: string, password: string) =>
    fetcher<{ message: string; token: string; user: any }>('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  updateUserStatus: (id: string, status: string) =>
    fetcher<{ user: any }>(`/admin/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  deleteUser: (id: string) =>
    fetcher<{ success: boolean; message: string }>(`/admin/users/${id}`, {
      method: 'DELETE',
    }),
  getDrivers: (params?: { status?: string; category?: string }) => {
    const q = new URLSearchParams(params as any).toString();
    return fetcher<{ drivers: any[] }>(`/admin/drivers?${q}`);
  },
  updateDriverVerification: (id: string, status: string) =>
    fetcher<{ driver: any }>(`/admin/drivers/${id}/verification`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  getRides: (params?: { status?: string; paymentMethod?: string }) => {
    const q = new URLSearchParams(params as any).toString();
    return fetcher<{ rides: any[] }>(`/admin/rides?${q}`);
  },
  getWalletLedger: () => fetcher<{ transactions: any[] }>('/admin/wallet/ledger'),
  getAuditLogs: (params?: { search?: string; action?: string; entity?: string }) => {
    const q = new URLSearchParams(params as any).toString();
    return fetcher<{ auditLogs: any[] }>(`/admin/audit-logs?${q}`);
  },
  getSafetyAlerts: () => fetcher<{ alerts: any[] }>('/admin/safety/alerts'),
  updateSafetyAlert: (id: string, status: string, notes?: string) =>
    fetcher<{ alert: any }>(`/admin/safety/alerts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    }),
  getSupportCases: () => fetcher<{ cases: any[] }>('/admin/support/cases'),
  updateSupportCase: (id: string, status: string, resolutionNotes?: string) =>
    fetcher<{ case: any }>(`/admin/support/cases/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, resolutionNotes }),
    }),
  getSettings: () => fetcher<{ settings: any }>('/admin/settings'),
  updateSettings: (settings: any) =>
    fetcher<{ settings: any }>('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    }),
  getApiKeys: () => fetcher<{ apiKeys: any }>('/admin/api-keys'),
  updateApiKeys: (apiKeys: any) =>
    fetcher<{ apiKeys: any }>('/admin/api-keys', {
      method: 'PUT',
      body: JSON.stringify(apiKeys),
    }),
  getPromotions: () => fetcher<{ promotions: any[] }>('/admin/promotions'),
  createPromotion: (data: any) =>
    fetcher<{ promotion: any }>('/admin/promotions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

