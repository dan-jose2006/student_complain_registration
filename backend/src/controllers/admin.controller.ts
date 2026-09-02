// Import Express Response and NextFunction types
import { Response, NextFunction } from 'express';
// Import admin business logic service
import { AdminService } from '../services/admin.service';
// Import standardized API response builder
import { ApiResponse } from '../utils/response';
// Import authenticated request type with attached user token payload
import { AuthenticatedRequest } from '../types';

/**
 * AdminController
 * Handles administrative HTTP requests for dashboard metrics, complaint listing/filtering,
 * individual ticket inspection, and status/priority updates.
 */
export class AdminController {
  /**
   * Handles GET /api/admin/dashboard
   * Returns aggregated platform analytics, resolution rates, and charts.
   */
  static async getDashboard(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Retrieve calculated metrics from AdminService
      const data = await AdminService.getDashboardMetrics();
      // Send HTTP 200 with dashboard data
      ApiResponse.success(res, data, 'Admin dashboard metrics retrieved successfully');
    } catch (error) {
      // Forward error to error handler
      next(error);
    }
  }

  /**
   * Handles GET /api/admin/complaints
   * Returns complaints matching optional search, category, status, and priority query filters.
   */
  static async getAllComplaints(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Extract filter parameters from query string
      const { search, status, category, priority } = req.query;
      // Fetch filtered complaint list
      const complaints = await AdminService.getAllComplaints({
        search: search as string,
        status: status as any,
        category: category as any,
        priority: priority as any,
      });
      // Send HTTP 200 with complaints array
      ApiResponse.success(res, complaints, 'Admin complaints retrieved successfully');
    } catch (error) {
      // Forward error to error handler
      next(error);
    }
  }

  /**
   * Handles GET /api/admin/complaints/:id
   * Returns full complaint details by numeric ID.
   */
  static async getComplaintById(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Parse ID parameter from URL route
      const id = parseInt(req.params.id, 10);
      // Validate that ID is an integer
      if (isNaN(id)) {
        ApiResponse.error(res, 'Invalid complaint ID', 400);
        return;
      }
      // Query complaints list
      const complaints = await AdminService.getAllComplaints();
      // Find matching complaint record
      const complaint = complaints.find((c: any) => c.id === id);
      // If not found, return 404 error
      if (!complaint) {
        ApiResponse.error(res, 'Complaint not found', 404);
        return;
      }
      // Send HTTP 200 with complaint record
      ApiResponse.success(res, complaint, 'Complaint details retrieved successfully');
    } catch (error) {
      // Forward error to error handler
      next(error);
    }
  }

  /**
   * Handles PATCH /api/admin/complaints/:id
   * Updates status (PENDING -> IN_PROGRESS -> RESOLVED) and/or priority of a complaint.
   */
  static async updateComplaint(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Parse numeric ID parameter from URL route
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        ApiResponse.error(res, 'Invalid complaint ID', 400);
        return;
      }

      // Update complaint status or priority in database
      const updated = await AdminService.updateComplaint(id, req.body);
      // Return HTTP 200 with updated complaint record
      ApiResponse.success(res, updated, 'Complaint updated successfully');
    } catch (error) {
      // Forward error to error handler
      next(error);
    }
  }
}

