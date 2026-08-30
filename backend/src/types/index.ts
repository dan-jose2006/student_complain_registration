import { Request } from 'express';

export type UserRole = 'STUDENT' | 'ADMIN';

export type ComplaintCategory =
  | 'WIFI_IT'
  | 'ELECTRICAL'
  | 'PLUMBING'
  | 'CLASSROOM_EQUIPMENT'
  | 'HOSTEL_MAINTENANCE'
  | 'CLEANLINESS'
  | 'TRANSPORT'
  | 'INFRASTRUCTURE'
  | 'SECURITY'
  | 'OTHER';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export type ComplaintStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export interface AIComplaintAnalysisResult {
  suggestedCategory: ComplaintCategory;
  suggestedPriority: Priority;
  summary: string;
  reason: string;
  suggestedDepartment: string;
  confidence: number;
}

export interface AIAdminInsightsResult {
  overview: string;
  keyTrends: string[];
  potentialRisks: string[];
  recommendedActions: string[];
  categoryHotspots: {
    category: string;
    count: number;
    trend: 'increasing' | 'stable' | 'decreasing';
  }[];
  generatedAt: string;
}
