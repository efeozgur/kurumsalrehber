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

  getStats: () => request<any>('/admin/stats'),

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
};
