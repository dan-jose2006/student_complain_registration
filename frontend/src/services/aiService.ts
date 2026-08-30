import { apiRequest } from './api';
import { AIComplaintAnalysis, AIAdminInsights } from '../types';

export const aiService = {
  async analyzeComplaint(payload: {
    title: string;
    description: string;
    location?: string | null;
  }): Promise<AIComplaintAnalysis> {
    return apiRequest<AIComplaintAnalysis>('/ai/analyze-complaint', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getAdminInsights(): Promise<AIAdminInsights> {
    return apiRequest<AIAdminInsights>('/ai/admin-insights', {
      method: 'POST',
    });
  },
};
