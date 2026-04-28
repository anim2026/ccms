import api from './client';

export interface Category {
  id: string;
  name: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  categoryId: string;
  category: Category;
  customerId: string;
  customer?: { id: string; name: string; email: string };
  assignedAdminId?: string;
  assignedAdmin?: { id: string; name: string; email: string } | null;
}

export interface PaginatedResponse {
  data: Complaint[];
  total: number;
  page: number;
  limit: number;
}

export const complaintApi = {
  create: (data: { title: string; description: string; categoryId: string; priority?: string }) =>
    api.post<Complaint>('/complaints', data),

  getMy: (page = 1, limit = 10) =>
    api.get<PaginatedResponse>(`/complaints/my?page=${page}&limit=${limit}`),

  getById: (id: string) =>
    api.get<Complaint>(`/complaints/${id}`),

  update: (id: string, data: Partial<{ title: string; description: string; categoryId: string; priority: string }>) =>
    api.put<Complaint>(`/complaints/${id}`, data),

  delete: (id: string) =>
    api.delete(`/complaints/${id}`),

  getCategories: () =>
    api.get<{ id: string; name: string }[]>('/complaints/categories'),
};
