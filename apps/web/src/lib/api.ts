const API_BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Bir hata oluştu' }));
    throw new Error(error.message || 'Bir hata oluştu');
  }

  return res.json();
}

export const api = {
  searchContacts: (q?: string, departmentId?: number, page = 1, limit = 20, titleId?: number, fav?: boolean) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (departmentId) params.set('departmentId', String(departmentId));
    if (titleId) params.set('titleId', String(titleId));
    if (fav) params.set('fav', 'true');
    params.set('page', String(page));
    params.set('limit', String(limit));
    return request<any>(`/contacts/search?${params}`);
  },

  getContact: (id: number) => request<any>(`/contacts/${id}`),

  getDepartments: () => request<any>('/departments'),

  getDepartmentTree: () => request<any>('/departments/tree'),

  login: (username: string, password: string) =>
    request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  setup: (username: string, password: string) =>
    request('/auth/setup', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  getMe: () => request<any>('/auth/me'),

  getUsers: () => request<any>('/auth/users'),

  createUser: (username: string, password: string, role?: string) =>
    request('/auth/users', {
      method: 'POST',
      body: JSON.stringify({ username, password, role }),
    }),

  deleteUser: (id: number) =>
    request(`/auth/users/${id}`, { method: 'DELETE' }),

  changePassword: (currentPassword: string, newPassword: string, userId?: number) =>
    request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword, userId }),
    }),

  forgotPassword: (username: string) =>
    request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ username }),
    }),

  resetPassword: (token: string, newPassword: string) =>
    request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    }),

  syncUsers: () =>
    request('/auth/sync-users', { method: 'POST' }),

  getStats: async () => {
    const res = await request<any>('/admin/stats');
    return res.data ?? res;
  },

  getAdminContacts: (page = 1, limit = 50, q?: string) => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(limit));
    if (q) params.set('q', q);
    return request<any>(`/admin/contacts?${params}`);
  },

  createContact: (data: any) =>
    request('/admin/contacts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateContact: (id: number, data: any) =>
    request(`/admin/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteContact: (id: number) =>
    request(`/admin/contacts/${id}`, { method: 'DELETE' }),

  createDepartment: (name: string, parentId?: number) =>
    request('/admin/departments', {
      method: 'POST',
      body: JSON.stringify({ name, parentId }),
    }),

  updateDepartment: (id: number, name: string, parentId?: number) =>
    request(`/admin/departments/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name, parentId }),
    }),

  deleteDepartment: (id: number) =>
    request(`/admin/departments/${id}`, { method: 'DELETE' }),

  getTitles: () => request<any>('/titles'),

  createTitle: (name: string) =>
    request('/admin/titles', {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),

  updateTitle: (id: number, name: string) =>
    request(`/admin/titles/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    }),

  deleteTitle: (id: number) =>
    request(`/admin/titles/${id}`, { method: 'DELETE' }),

  getTips: () => request<any>('/tips'),

  createTip: (text: string) =>
    request('/admin/tips', {
      method: 'POST',
      body: JSON.stringify({ text }),
    }),

  deleteTip: (id: number) =>
    request(`/admin/tips/${id}`, { method: 'DELETE' }),

  exportContacts: async (format: 'xlsx' | 'csv' = 'xlsx') => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/admin/contacts/export?format=${format}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Dışa aktarma hatası' }));
      throw new Error(err.message);
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kisiler.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  },

  toggleFavorite: (id: number) =>
    request<any>(`/contacts/${id}/favorite`, { method: 'PATCH' }),

  getFavorites: (page = 1, limit = 20) => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(limit));
    return request<any>(`/contacts/fav/list?${params}`);
  },

  importContacts: async (file: File) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/admin/contacts/import`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'İçe aktarma hatası' }));
      throw new Error(err.message);
    }
    return res.json();
  },

  getSettings: () => request<any>('/admin/settings'),

  updateSetting: (key: string, value: string) =>
    request<any>('/admin/settings', {
      method: 'POST',
      body: JSON.stringify({ key, value }),
    }),

  uploadFile: async (file: File) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/admin/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Yükleme hatası' }));
      throw new Error(err.message);
    }
    return res.json();
  },

  getModules: () => request<any>('/admin/modules'),

  getModuleStatus: async (key: string) => {
    const res = await request<any>(`/modules/${key}/status`);
    return res.data ?? res;
  },

  updateModule: (id: number, enabled: boolean) =>
    request<any>(`/admin/modules/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ enabled }),
    }),

  getMealPlans: (week?: string) =>
    request<any>(`/meal-plans${week ? `?week=${week}` : ''}`),

  getTodayMeal: () => request<any>('/meal-plans/today'),

  createMealPlan: (data: {
    weekStart: string; dayOfWeek: number;
    soup: string; mainDishes: string[]; salad: string;
  }) => request<any>('/admin/meal-plans', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateMealPlan: (id: number, data: {
    weekStart?: string; dayOfWeek?: number;
    soup?: string; mainDishes?: string[]; salad?: string;
  }) => request<any>(`/admin/meal-plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteMealPlan: (id: number) =>
    request<any>(`/admin/meal-plans/${id}`, { method: 'DELETE' }),

  getFoodItems: (category?: string) =>
    request<any>(`/food-items${category ? `?category=${category}` : ''}`),

  createFoodItem: (name: string, category: string) =>
    request<any>('/admin/food-items', {
      method: 'POST',
      body: JSON.stringify({ name, category }),
    }),

  logSearch: (query?: string, resultCount = 0) =>
    fetch(`${API_BASE}/analytics/log/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, resultCount }),
    }).catch(() => {}),

  logView: (contactId: number) =>
    fetch(`${API_BASE}/analytics/log/view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contactId }),
    }).catch(() => {}),

  logExport: () =>
    fetch(`${API_BASE}/analytics/log/export`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }).catch(() => {}),

  getAnalyticsSummary: async () => {
    const res = await request<any>('/admin/analytics/summary');
    return res.data ?? res;
  },

  getAnalyticsSearchTerms: async () => {
    const res = await request<any>('/admin/analytics/search-terms');
    return res.data ?? res;
  },

  getAnalyticsTopContacts: async () => {
    const res = await request<any>('/admin/analytics/top-contacts');
    return res.data ?? res;
  },

  getAnalyticsUsageHourly: async () => {
    const res = await request<any>('/admin/analytics/usage-hourly');
    return res.data ?? res;
  },

  getAnalyticsUsageDaily: async () => {
    const res = await request<any>('/admin/analytics/usage-daily');
    return res.data ?? res;
  },

  getAnalyticsNoResults: async () => {
    const res = await request<any>('/admin/analytics/no-results');
    return res.data ?? res;
  },

  getAnalyticsFavStats: async () => {
    const res = await request<any>('/admin/analytics/fav-stats');
    return res.data ?? res;
  },

  clearAnalytics: () =>
    request('/admin/analytics/clear', { method: 'DELETE' }),

  // ─── Import ──────────────────────────────────────────────

  importDiscover: async (file: File) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/admin/import/discover`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Dosya okuma hatası' }));
      throw new Error(err.message);
    }
    const json = await res.json();
    return json.data ?? json;
  },

  importExecute: async (file: File, config: any) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('config', JSON.stringify(config));
    const res = await fetch(`${API_BASE}/admin/import/execute`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'İçe aktarma hatası' }));
      throw new Error(err.message);
    }
    const json = await res.json();
    return json.data ?? json;
  },

  importClear: () =>
    request('/admin/import/clear', { method: 'POST' }),

  // ─── Vesayet ──────────────────────────────────────────────

  getWards: async () => {
    const res = await request<any>('/admin/vesayet/wards');
    return res.data ?? res;
  },

  getWard: async (id: number) => {
    const res = await request<any>(`/admin/vesayet/wards/${id}`);
    return res.data ?? res;
  },

  createWard: async (data: any) => {
    const res = await request<any>('/admin/vesayet/wards', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data ?? res;
  },

  updateWard: (id: number, data: any) =>
    request(`/admin/vesayet/wards/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteWard: (id: number) =>
    request(`/admin/vesayet/wards/${id}`, { method: 'DELETE' }),

  getWardAccounts: async (wardId: number) => {
    const res = await request<any>(`/admin/vesayet/wards/${wardId}/accounts`);
    return res.data ?? res;
  },

  createBankAccount: (data: any) =>
    request('/admin/vesayet/accounts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateBankAccount: (id: number, data: any) =>
    request(`/admin/vesayet/accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteBankAccount: (id: number) =>
    request(`/admin/vesayet/accounts/${id}`, { method: 'DELETE' }),

  getBanks: async () => {
    const res = await request<any>('/admin/vesayet/banks');
    return res.data ?? res;
  },

  createBank: (name: string) =>
    request('/admin/vesayet/banks', {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),

  updateBank: (id: number, name: string) =>
    request(`/admin/vesayet/banks/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    }),

  deleteBank: (id: number) =>
    request(`/admin/vesayet/banks/${id}`, { method: 'DELETE' }),

  getWardGoldAccounts: async (wardId: number) => {
    const res = await request<any>(`/admin/vesayet/wards/${wardId}/gold-accounts`);
    return res.data ?? res;
  },

  createGoldAccount: (data: any) =>
    request('/admin/vesayet/gold-accounts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateGoldAccount: (id: number, data: any) =>
    request(`/admin/vesayet/gold-accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteGoldAccount: (id: number) =>
    request(`/admin/vesayet/gold-accounts/${id}`, { method: 'DELETE' }),

  getExchangeRates: async () => {
    const res = await request<any>('/admin/vesayet/exchange-rates');
    return res.data ?? res;
  },

  getReportSummary: async () => {
    const res = await request<any>('/admin/vesayet/reports/summary');
    return res.data ?? res;
  },

  // ─── Teknik Servis ────────────────────────────────────────

  createServiceRequest: async (title: string, description: string, image?: File) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (image) formData.append('image', image);
    const res = await fetch(`${API_BASE}/teknik-servis`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Arıza kaydı hatası' }));
      throw new Error(err.message);
    }
    return res.json();
  },

  getMyRequests: async () => {
    const res = await request<any>('/teknik-servis/my');
    return res.data ?? res;
  },

  getAllRequests: async () => {
    const res = await request<any>('/teknik-servis/admin/all');
    return res.data ?? res;
  },

  getRequest: async (id: number) => {
    const res = await request<any>(`/teknik-servis/${id}`);
    return res.data ?? res;
  },

  updateRequestStatus: (id: number, status: string) =>
    request(`/teknik-servis/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  assignToSelf: (id: number) =>
    request(`/teknik-servis/admin/${id}/assign`, { method: 'PATCH' }),

  adminUpdateStatus: (id: number, status: string) =>
    request(`/teknik-servis/admin/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  resolveRequest: (id: number, resolution: string) =>
    request(`/teknik-servis/admin/${id}/resolve`, {
      method: 'PATCH',
      body: JSON.stringify({ resolution }),
    }),

  searchSolutions: async (q: string) => {
    const res = await request<any>(`/teknik-servis/solutions?q=${encodeURIComponent(q)}`);
    return res.data ?? res;
  },

  getTechAssignments: async () => {
    const res = await request<any>('/admin/teknik-servis/assignments');
    return res.data ?? res;
  },

  assignTechUser: (userId: number) =>
    request('/admin/teknik-servis/assignments', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    }),

  removeTechUser: (userId: number) =>
    request(`/admin/teknik-servis/assignments/${userId}`, { method: 'DELETE' }),

  getTechSettings: async () => {
    const res = await request<any>('/admin/teknik-servis/settings');
    return res.data ?? res;
  },

  updateTechSettings: (closedBy: string) =>
    request('/admin/teknik-servis/settings', {
      method: 'PATCH',
      body: JSON.stringify({ closedBy }),
    }),

  getTechSolutions: async () => {
    const res = await request<any>('/admin/teknik-servis/solutions');
    return res.data ?? res;
  },

  createTechSolution: (data: { title: string; description: string; keywords: string }) =>
    request('/admin/teknik-servis/solutions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  deleteTechSolution: (id: number) =>
    request(`/admin/teknik-servis/solutions/${id}`, { method: 'DELETE' }),
};
