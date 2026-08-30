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

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface Feedback {
  id: string;
  complaintId: number;
  userId: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
}

export interface Complaint {
  id: number;
  userId: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  location: string;
  priority: Priority;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
  aiCategory?: string | null;
  aiPriority?: string | null;
  aiSummary?: string | null;
  aiReason?: string | null;
  aiDepartment?: string | null;
  aiConfidence?: number | null;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  feedback?: Feedback | null;
}

export interface AIComplaintAnalysis {
  suggestedCategory: ComplaintCategory;
  suggestedPriority: Priority;
  summary: string;
  reason: string;
  suggestedDepartment: string;
  confidence: number;
}

export interface AIAdminInsights {
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

export interface AdminDashboardData {
  summary: {
    total: number;
    pending: number;
    inProgress: number;
    resolved: number;
    highPriority: number;
    resolutionRate: number;
    todayReports: number;
  };
  charts: {
    categories: { name: string; displayName: string; count: number }[];
    status: { name: string; displayName: string; count: number; color: string }[];
    priority: { name: string; count: number }[];
    trends: { date: string; created: number; resolved: number }[];
  };
  recentComplaints: Complaint[];
}

export interface ApiSuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
