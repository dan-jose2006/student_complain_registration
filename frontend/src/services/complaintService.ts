import { apiRequest } from './api';
import {
  Complaint,
  Feedback,
  ComplaintCategory,
  Priority,
  ComplaintStatus,
} from '../types';

export interface CreateComplaintPayload {
  title: string;
  description: string;
  category: ComplaintCategory;
  location: string;
  priority?: Priority;
  aiCategory?: string | null;
  aiPriority?: string | null;
  aiSummary?: string | null;
  aiReason?: string | null;
  aiDepartment?: string | null;
  aiConfidence?: number | null;
}

export interface ComplaintFilters {
  search?: string;
  status?: ComplaintStatus;
  category?: ComplaintCategory;
  priority?: Priority;
}

export const complaintService = {
  async createComplaint(payload: CreateComplaintPayload): Promise<Complaint> {
    return apiRequest<Complaint>('/complaints', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getMyComplaints(filters?: ComplaintFilters): Promise<Complaint[]> {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.priority) params.append('priority', filters.priority);

    const qs = params.toString();
    return apiRequest<Complaint[]>(`/complaints/my${qs ? `?${qs}` : ''}`);
  },

  async getComplaintById(id: number | string): Promise<Complaint> {
    return apiRequest<Complaint>(`/complaints/${id}`);
  },

  async submitFeedback(
    complaintId: number | string,
    rating: number,
    comment?: string
  ): Promise<Feedback> {
    return apiRequest<Feedback>(`/complaints/${complaintId}/feedback`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment }),
    });
  },
};
