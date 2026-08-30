import { Response, NextFunction } from 'express';
import { AIService } from '../services/ai.service';
import { AdminService } from '../services/admin.service';
import { ApiResponse } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export class AIController {
  static async analyzeComplaint(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { title, description, location } = req.body;
      const result = await AIService.analyzeComplaint(title, description, location);
      ApiResponse.success(res, result, 'Complaint analyzed successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getAdminInsights(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Gather non-sensitive complaint statistics
      const metrics = await AdminService.getDashboardMetrics();
      const allComplaints = await AdminService.getAllComplaints();

      const categoryCounts: Record<string, number> = {};
      metrics.charts.categories.forEach((cat) => {
        categoryCounts[cat.name] = cat.count;
      });

      const recentSampleTitles = allComplaints.slice(0, 10).map((c: any) => c.title);

      const insights = await AIService.generateAdminInsights({
        total: metrics.summary.total,
        pending: metrics.summary.pending,
        inProgress: metrics.summary.inProgress,
        resolved: metrics.summary.resolved,
        highPriority: metrics.summary.highPriority,
        categoryCounts,
        recentSampleTitles,
      });

      ApiResponse.success(res, insights, 'Admin insights generated successfully');
    } catch (error) {
      next(error);
    }
  }
}
