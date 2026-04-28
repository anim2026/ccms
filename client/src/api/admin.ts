import api from './client';
import { Complaint, PaginatedResponse } from './complaints';

export interface Dashboard {
  total: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  recent: Complaint[];
}

export interface Admin {
  id: string;
  name: string;
  email: string;
}

export const adminApi = {
  getAllComplaints: (params?: { page?: number; limit?: number; search?: string; status?: string; priority?: string }) =>
    api.get<PaginatedResponse>('/admin/complaints', { params }),

  assignComplaint: (id: string, assignedAdminId: string) =>
    api.patch<Complaint>(`/admin/complaints/${id}/assign`, { assignedAdminId }),

  updateStatus: (id: string, status: string) =>
    api.patch<Complaint>(`/admin/complaints/${id}/status`, { status }),

  getDashboard: () =>
    api.get<Dashboard>('/admin/dashboard'),

  getAdmins: () =>
    api.get<Admin[]>('/admin/admins'),

  getCategories: () =>
    api.get<{ id: string; name: string }[]>('/admin/categories'),

  complainUpdate: (id: string, data: { status?: string; assignedAdminId?: string }) =>
    api.put<Complaint>(`/admin/complaints/${id}`, data),
};
