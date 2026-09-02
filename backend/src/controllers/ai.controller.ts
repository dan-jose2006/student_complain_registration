// Import Express Response and NextFunction types
import { Response, NextFunction } from 'express';
// Import AI service providing natural language triage, rephrasing, and insights
import { AIService } from '../services/ai.service';
// Import Admin service to collect campus statistics for AI analysis
import { AdminService } from '../services/admin.service';
// Import standardized API response builder
import { ApiResponse } from '../utils/response';
// Import authenticated request type
import { AuthenticatedRequest } from '../types';

/**
 * AIController
 * Exposes endpoints for real-time natural language triage, automated description improvement,
 * and high-level administrator strategic insight generation.
 */
export class AIController {
  /**
   * Handles POST /api/ai/analyze-complaint
   * Automatically classifies category, urgency, department, summary, and confidence score.
   */
  static async analyzeComplaint(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Extract title, description, and location from request body
      const { title, description, location } = req.body;
      // Invoke AI analysis service
      const result = await AIService.analyzeComplaint(title, description, location);
      // Return HTTP 200 with structured classification payload
      ApiResponse.success(res, result, 'Complaint analyzed successfully');
    } catch (error) {
      // Forward error to global handler
      next(error);
    }
  }

  /**
   * Handles POST /api/ai/reframe-description
   * Rephrases student input into a clear, professional, and well-structured complaint description.
   */
  static async reframeDescription(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Extract description and optional title
      const { description, title } = req.body;
      // Reframe description using Groq LLM
      const result = await AIService.reframeDescription(description, title);
      // Return HTTP 200 with reframed text
      ApiResponse.success(res, result, 'Description reframed successfully');
    } catch (error) {
      // Forward error to global handler
      next(error);
    }
  }

  /**
   * Handles POST /api/ai/admin-insights
   * Generates actionable institutional summaries, risk areas, and preventative maintenance strategies.
   */
  static async getAdminInsights(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Gather aggregated complaint metrics from database
      const metrics = await AdminService.getDashboardMetrics();
      // Gather full complaints list
      const allComplaints = await AdminService.getAllComplaints();

      // Transform category metrics into key-value counts
      const categoryCounts: Record<string, number> = {};
      metrics.charts.categories.forEach((cat) => {
        categoryCounts[cat.name] = cat.count;
      });

      // Extract a sample of 10 recent titles for contextual trend discovery
      const recentSampleTitles = allComplaints.slice(0, 10).map((c: any) => c.title);

      // Invoke LLM to generate administrative strategic insights
      const insights = await AIService.generateAdminInsights({
        total: metrics.summary.total,
        pending: metrics.summary.pending,
        inProgress: metrics.summary.inProgress,
        resolved: metrics.summary.resolved,
        highPriority: metrics.summary.highPriority,
        categoryCounts,
        recentSampleTitles,
      });

      // Return HTTP 200 with generated strategic insights
      ApiResponse.success(res, insights, 'Admin insights generated successfully');
    } catch (error) {
      // Forward error to global handler
      next(error);
    }
  }
}

