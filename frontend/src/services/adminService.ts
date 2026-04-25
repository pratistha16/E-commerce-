import api from '@/lib/api';

export interface Tenant {
  id: string | number;
  schema_name: string;
  name: string;
  created_on: string;
  is_approved: boolean;
  is_active: boolean;
  domains: {
    id: string | number;
    domain: string;
    is_primary: boolean;
  }[];
}

export interface SystemStats {
  total_tenants: number;
  total_users: number;
  total_orders: number;
  total_revenue: number;
  pending_tenants: number;
  top_tenants: {
    tenant_name: string;
    revenue: number;
  }[];
  revenue_over_time: {
    month: string;
    revenue: number;
  }[];
}

export interface UserStats {
  total_users: number;
  vendors: number;
  customers: number;
  admins: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const adminService = {
  getSystemAnalytics: async () => {
    const response = await api.get<SystemStats>('/tenants/analytics/');
    return response.data;
  },
  
  getTenants: async (page = 1) => {
    const response = await api.get<PaginatedResponse<Tenant>>(`/tenants/clients/?page=${page}`);
    return response.data;
  },
  
  getPendingTenants: async () => {
    const response = await api.get<PaginatedResponse<Tenant>>('/tenants/clients/?is_approved=false');
    return response.data.results;
  },
  
  createTenant: async (data: { name: string; schema_name: string; domain_name: string }) => {
    const response = await api.post<Tenant>('/tenants/clients/', data);
    return response.data;
  },

  provisionMerchant: async (data: any) => {
    const response = await api.post('/tenants/clients/provision/', data);
    return response.data;
  },
  
  deleteTenant: async (id: string | number) => {
    await api.delete(`/tenants/clients/${id}/`);
  },
  
  approveTenant: async (id: number) => {
    const response = await api.post(`/tenants/clients/${id}/approve/`);
    return response.data;
  },
  
  toggleTenantActive: async (id: number) => {
    const response = await api.post(`/tenants/clients/${id}/toggle_active/`);
    return response.data;
  },
  
  getUsers: async (page = 1, filters = {}) => {
    const params = new URLSearchParams({ page: page.toString(), ...filters });
    const response = await api.get<PaginatedResponse<any>>(`/auth/management/?${params.toString()}`);
    return response.data;
  },
  
  getUserStats: async () => {
    const response = await api.get<UserStats>('/auth/management/stats/');
    return response.data;
  },
  
  updateUser: async (id: string | number, data: any) => {
    const response = await api.patch(`/auth/management/${id}/`, data);
    return response.data;
  },
  
  toggleUserActive: async (id: string | number) => {
    const response = await api.post(`/auth/management/${id}/toggle_active/`);
    return response.data;
  },

  resetUserPassword: async (id: string | number, password: string) => {
    const response = await api.post(`/auth/management/${id}/reset_password/`, { password });
    return response.data;
  },
  
  createUser: async (data: any) => {
    const response = await api.post('/auth/management/', data);
    return response.data;
  },

  deleteUser: async (id: string | number) => {
    await api.delete(`/auth/management/${id}/`);
  },
  
  getModerationData: async (type: 'products' | 'orders', page = 1, search = '') => {
    const params = new URLSearchParams({ 
      type, 
      page: page.toString(), 
      search: search 
    });
    const response = await api.get<PaginatedResponse<any>>(`/tenants/moderation/?${params.toString()}`);
    return response.data;
  },
  
  getGlobalSettings: async () => {
    const response = await api.get<GlobalSettings>('/tenants/settings/current/');
    return response.data;
  },
  
  updateGlobalSettings: async (data: Partial<GlobalSettings>) => {
    const response = await api.patch<GlobalSettings>('/tenants/settings/current/', data);
    return response.data;
  }
};

export interface GlobalSettings {
  id: string | number;
  commission_percentage: number;
  global_tax_percentage: number;
  default_shipping_fee: number;
  updated_at: string;
}
