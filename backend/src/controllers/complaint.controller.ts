// Import Express response and next-middleware callback types
import { Response, NextFunction } from 'express';
// Import business logic layer for complaints
import { ComplaintService } from '../services/complaint.service';
// Import standardized JSON response formatting utility
import { ApiResponse } from '../utils/response';
// Import custom Express Request type augmented with authenticated user token payload
import { AuthenticatedRequest } from '../types';

/**
 * ComplaintController
 * Handles incoming HTTP requests for creating, listing, viewing, and reviewing complaints.
 */
export class ComplaintController {
  /**
   * Handles POST /api/complaints
   * Creates a new complaint for the authenticated student.
   */
  static async createComplaint(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Guard check: verify that user payload was attached by authentication middleware
      if (!req.user) {
        ApiResponse.error(res, 'Unauthorized', 401);
        return;
      }
      // Delegate complaint creation to service layer with authenticated student's ID and validated body
      const complaint = await ComplaintService.createComplaint(req.user.userId, req.body);
      // Return 201 Created status code with the newly created complaint record
      ApiResponse.success(res, complaint, 'Complaint submitted successfully', 201);
    } catch (error) {
      // Forward any runtime exceptions to global errorHandler middleware
      next(error);
    }
  }

  /**
   * Handles GET /api/complaints/my
   * Lists complaints filed by the requesting student, with optional search and filtering.
   */
  static async getMyComplaints(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Guard check: verify that user is authenticated
      if (!req.user) {
        ApiResponse.error(res, 'Unauthorized', 401);
        return;
      }

      // Extract optional search and filter queries from URL query parameters
      const { search, status, category, priority } = req.query;
      // Fetch student's matching complaints from service layer
      const complaints = await ComplaintService.getMyComplaints(req.user.userId, {
        search: search as string,
        status: status as any,
        category: category as any,
        priority: priority as any,
      });

      // Return 200 OK with the complaints array
      ApiResponse.success(res, complaints, 'Complaints retrieved successfully');
    } catch (error) {
      // Forward error to global error handler
      next(error);
    }
  }

  /**
   * Handles GET /api/complaints/:id
   * Retrieves single complaint by ID, verifying that students can only see their own tickets.
   */
  static async getComplaintById(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Guard check: verify authentication
      if (!req.user) {
        ApiResponse.error(res, 'Unauthorized', 401);
        return;
      }
      // Parse numeric route parameter :id
      const id = parseInt(req.params.id, 10);
      // Validate that :id is a valid integer
      if (isNaN(id)) {
        ApiResponse.error(res, 'Invalid complaint ID', 400);
        return;
      }

      // Retrieve complaint ensuring role-based access checks
      const complaint = await ComplaintService.getComplaintById(
        id,
        req.user.userId,
        req.user.role
      );
      // Return 200 OK with the complaint details
      ApiResponse.success(res, complaint, 'Complaint details retrieved successfully');
    } catch (error) {
      // Pass exception to global error handler
      next(error);
    }
  }

  /**
   * Handles POST /api/complaints/:id/feedback
   * Allows the student to submit a satisfaction rating and comment on a resolved complaint.
   */
  static async submitFeedback(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Guard check: verify authentication
      if (!req.user) {
        ApiResponse.error(res, 'Unauthorized', 401);
        return;
      }
      // Parse numeric route parameter :id
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        ApiResponse.error(res, 'Invalid complaint ID', 400);
        return;
      }

      // Submit feedback record through service layer
      const feedback = await ComplaintService.submitFeedback(
        id,
        req.user.userId,
        req.body
      );
      // Return 201 Created with saved feedback object
      ApiResponse.success(res, feedback, 'Feedback submitted successfully', 201);
    } catch (error) {
      // Forward error to global error handler
      next(error);
    }
  }
}

