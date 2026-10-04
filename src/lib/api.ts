const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function fetcher<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer jwt_mock_token_usr_superadmin_SUPER_ADMIN',
      },
      ...options,
      cache: 'no-store',
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP error ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    console.error(`API Fetch Error [${endpoint}]:`, error.message);
    throw error;
  }
}

export const adminApi = {
  getAnalytics: () => fetcher<any>('/admin/analytics'),
  getUsers: (params?: { search?: string; role?: string; status?: string }) => {
    const q = new URLSearchParams(params as any).toString();
    return fetcher<{ users: any[] }>(`/admin/users?${q}`);
  },
  updateUserStatus: (id: string, status: string) =>
    fetcher<{ user: any }>(`/admin/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
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

