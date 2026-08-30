import { Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service';
import { ApiResponse } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export class AdminController {
  static async getDashboard(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = await AdminService.getDashboardMetrics();
      ApiResponse.success(res, data, 'Admin dashboard metrics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getAllComplaints(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { search, status, category, priority } = req.query;
      const complaints = await AdminService.getAllComplaints({
        search: search as string,
        status: status as any,
        category: category as any,
        priority: priority as any,
      });
      ApiResponse.success(res, complaints, 'Admin complaints retrieved successfully');
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
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        ApiResponse.error(res, 'Invalid complaint ID', 400);
        return;
      }
      const complaints = await AdminService.getAllComplaints();
      const complaint = complaints.find((c: any) => c.id === id);
      if (!complaint) {
        ApiResponse.error(res, 'Complaint not found', 404);
        return;
      }
      ApiResponse.success(res, complaint, 'Complaint details retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async updateComplaint(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        ApiResponse.error(res, 'Invalid complaint ID', 400);
        return;
      }

      const updated = await AdminService.updateComplaint(id, req.body);
      ApiResponse.success(res, updated, 'Complaint updated successfully');
    } catch (error) {
      next(error);
    }
  }
}
