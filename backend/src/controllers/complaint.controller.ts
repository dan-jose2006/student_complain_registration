import { Response, NextFunction } from 'express';
import { ComplaintService } from '../services/complaint.service';
import { ApiResponse } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export class ComplaintController {
  static async createComplaint(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        ApiResponse.error(res, 'Unauthorized', 401);
        return;
      }
      const complaint = await ComplaintService.createComplaint(req.user.userId, req.body);
      ApiResponse.success(res, complaint, 'Complaint submitted successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async getMyComplaints(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        ApiResponse.error(res, 'Unauthorized', 401);
        return;
      }

      const { search, status, category, priority } = req.query;
      const complaints = await ComplaintService.getMyComplaints(req.user.userId, {
        search: search as string,
        status: status as any,
        category: category as any,
        priority: priority as any,
      });

      ApiResponse.success(res, complaints, 'Complaints retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getComplaintById(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        ApiResponse.error(res, 'Unauthorized', 401);
        return;
      }
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        ApiResponse.error(res, 'Invalid complaint ID', 400);
        return;
      }

      const complaint = await ComplaintService.getComplaintById(
        id,
        req.user.userId,
        req.user.role
      );
      ApiResponse.success(res, complaint, 'Complaint details retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async submitFeedback(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        ApiResponse.error(res, 'Unauthorized', 401);
        return;
      }
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        ApiResponse.error(res, 'Invalid complaint ID', 400);
        return;
      }

      const feedback = await ComplaintService.submitFeedback(
        id,
        req.user.userId,
        req.body
      );
      ApiResponse.success(res, feedback, 'Feedback submitted successfully', 201);
    } catch (error) {
      next(error);
    }
  }
}
