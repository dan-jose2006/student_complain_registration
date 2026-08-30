import { apiRequest } from './api';
import {
  AdminDashboardData,
  Complaint,
  ComplaintCategory,
  Priority,
  ComplaintStatus,
} from '../types';

export interface AdminComplaintFilters {
  search?: string;
  status?: ComplaintStatus;
  category?: ComplaintCategory;
  priority?: Priority;
}

export const adminService = {
  async getDashboard(): Promise<AdminDashboardData> {
    return apiRequest<AdminDashboardData>('/admin/dashboard');
  },

  async getAllComplaints(filters?: AdminComplaintFilters): Promise<Complaint[]> {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.priority) params.append('priority', filters.priority);

    const qs = params.toString();
    return apiRequest<Complaint[]>(`/admin/complaints${qs ? `?${qs}` : ''}`);
  },

  async getComplaintById(id: number | string): Promise<Complaint> {
    return apiRequest<Complaint>(`/admin/complaints/${id}`);
  },

  async updateComplaint(
    id: number | string,
    payload: { status?: ComplaintStatus; priority?: Priority }
  ): Promise<Complaint> {
    return apiRequest<Complaint>(`/admin/complaints/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },
};
