import prisma from '../config/prisma';
import { ComplaintCategory, Priority, ComplaintStatus } from '../types';

export class ComplaintService {
  /**
   * Creates a new complaint for authenticated student.
   */
  static async createComplaint(
    userId: string,
    data: {
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
  ) {
    return prisma.complaint.create({
      data: {
        userId,
        title: data.title,
        description: data.description,
        category: data.category,
        location: data.location,
        priority: data.priority || 'MEDIUM',
        status: 'PENDING',
        aiCategory: data.aiCategory,
        aiPriority: data.aiPriority,
        aiSummary: data.aiSummary,
        aiReason: data.aiReason,
        aiDepartment: data.aiDepartment,
        aiConfidence: data.aiConfidence,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        feedback: true,
      },
    });
  }

  /**
   * Retrieves all complaints raised by a specific student.
   */
  static async getMyComplaints(
    userId: string,
    filters?: {
      search?: string;
      status?: ComplaintStatus;
      category?: ComplaintCategory;
      priority?: Priority;
    }
  ) {
    const where: any = { userId };

    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.category) {
      where.category = filters.category;
    }
    if (filters?.priority) {
      where.priority = filters.priority;
    }
    if (filters?.search && filters.search.trim() !== '') {
      const q = filters.search.trim();
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { location: { contains: q, mode: 'insensitive' } },
      ];
    }

    return prisma.complaint.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        feedback: true,
      },
    });
  }

  /**
   * Retrieves single complaint details with ownership enforcement.
   */
  static async getComplaintById(id: number, userId: string, userRole: string) {
    const complaint = await prisma.complaint.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        feedback: true,
      },
    });

    if (!complaint) {
      const error: any = new Error('Complaint not found');
      error.statusCode = 404;
      throw error;
    }

    // Role-based ownership check
    if (userRole === 'STUDENT' && complaint.userId !== userId) {
      const error: any = new Error('Unauthorized: You do not have permission to view this complaint');
      error.statusCode = 403;
      throw error;
    }

    return complaint;
  }

  /**
   * Submits 1-5 star feedback for a resolved complaint.
   */
  static async submitFeedback(
    complaintId: number,
    userId: string,
    data: { rating: number; comment?: string | null }
  ) {
    const complaint = await prisma.complaint.findUnique({
      where: { id: complaintId },
      include: { feedback: true },
    });

    if (!complaint) {
      const error: any = new Error('Complaint not found');
      error.statusCode = 404;
      throw error;
    }

    if (complaint.userId !== userId) {
      const error: any = new Error('Unauthorized: You can only provide feedback for your own complaints');
      error.statusCode = 403;
      throw error;
    }

    if (complaint.status !== 'RESOLVED') {
      const error: any = new Error('Feedback can only be submitted once the complaint is RESOLVED');
      error.statusCode = 400;
      throw error;
    }

    if (complaint.feedback) {
      const error: any = new Error('Feedback has already been submitted for this complaint');
      error.statusCode = 409;
      throw error;
    }

    return prisma.feedback.create({
      data: {
        complaintId,
        userId,
        rating: data.rating,
        comment: data.comment || null,
      },
    });
  }
}
