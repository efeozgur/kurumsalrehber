export interface Department {
  id: number;
  name: string;
  parentId: number | null;
  _count?: { contacts: number };
}

export interface Title {
  id: number;
  name: string;
  _count?: { contacts: number };
}

export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  sicilNo: string | null;
  titleId: number | null;
  title: Title | null;
  phoneInternal: string | null;
  phoneMobile: string | null;
  email: string | null;
  avatar: string | null;
  departmentId: number | null;
  department: Department | null;
  isFav: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  username: string;
  role: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface Stats {
  contactCount: number;
  departmentCount: number;
  userCount: number;
  recentContacts: Contact[];
  departmentDistribution: { name: string; value: number }[];
  titleDistribution: { name: string; value: number }[];
}

export interface AnalyticsSummary {
  todaySearches: number;
  totalSearches: number;
  noResultSearches: number;
  noResultRate: number;
  avgResultCount: number;
}

export interface SearchTerm {
  query: string;
  count: number;
}

export interface TopContactView {
  contact: Contact | null;
  count: number;
}

export interface HourlyUsage {
  hour: number;
  count: number;
}

export interface DailyUsage {
  date: string;
  count: number;
}

export interface NoResultQuery {
  query: string | null;
  createdAt: string;
}

export interface FavStat {
  id: number;
  firstName: string;
  lastName: string;
  department: string | null;
  title: string | null;
  favoritedAt: string;
}
