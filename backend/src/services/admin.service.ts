import prisma from '../config/prisma';
import { ComplaintCategory, Priority, ComplaintStatus } from '../types';

export class AdminService {
  /**
   * Generates full administrative analytics and dashboard metrics.
   */
  static async getDashboardMetrics() {
    const [
      total,
      pending,
      inProgress,
      resolved,
      highPriority,
      complaints,
    ] = await Promise.all([
      prisma.complaint.count(),
      prisma.complaint.count({ where: { status: 'PENDING' } }),
      prisma.complaint.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.complaint.count({ where: { status: 'RESOLVED' } }),
      prisma.complaint.count({ where: { priority: 'HIGH' } }),
      prisma.complaint.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
          feedback: true,
        },
      }),
    ]);

    const resolutionRate = total > 0 ? Math.round((resolved / total) * 1000) / 10 : 0;

    // Today's reports
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayReports = complaints.filter((c: any) => new Date(c.createdAt) >= startOfToday).length;

    // Category distribution
    const categoryCounts: Record<string, number> = {
      WIFI_IT: 0,
      ELECTRICAL: 0,
      PLUMBING: 0,
      CLASSROOM_EQUIPMENT: 0,
      HOSTEL_MAINTENANCE: 0,
      CLEANLINESS: 0,
      TRANSPORT: 0,
      INFRASTRUCTURE: 0,
      SECURITY: 0,
      OTHER: 0,
    };

    complaints.forEach((c: any) => {
      if (categoryCounts[c.category] !== undefined) {
        categoryCounts[c.category]++;
      }
    });

    const categoryData = Object.entries(categoryCounts).map(([name, count]) => ({
      name,
      displayName: name.replace('_', ' '),
      count,
    }));

    // Status distribution
    const statusData = [
      { name: 'PENDING', displayName: 'Pending', count: pending, color: '#f59e0b' },
      { name: 'IN_PROGRESS', displayName: 'In Progress', count: inProgress, color: '#3b82f6' },
      { name: 'RESOLVED', displayName: 'Resolved', count: resolved, color: '#10b981' },
    ];

    // Priority distribution
    const priorityCounts: Record<string, number> = { LOW: 0, MEDIUM: 0, HIGH: 0 };
    complaints.forEach((c: any) => {
      if (priorityCounts[c.priority] !== undefined) {
        priorityCounts[c.priority]++;
      }
    });
    const priorityData = Object.entries(priorityCounts).map(([name, count]) => ({
      name,
      count,
    }));

    // Timeline trends (last 7 days)
    const last7Days: { date: string; created: number; resolved: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayComplaints = complaints.filter(
        (c: any) => new Date(c.createdAt).toISOString().split('T')[0] === dateStr
      );
      const dayResolved = complaints.filter(
        (c: any) => c.status === 'RESOLVED' && new Date(c.updatedAt).toISOString().split('T')[0] === dateStr
      );

      last7Days.push({
        date: dateStr,
        created: dayComplaints.length,
        resolved: dayResolved.length,
      });
    }

    return {
      summary: {
        total,
        pending,
        inProgress,
        resolved,
        highPriority,
        resolutionRate,
        todayReports,
      },
      charts: {
        categories: categoryData,
        status: statusData,
        priority: priorityData,
        trends: last7Days,
      },
      recentComplaints: complaints.slice(0, 6),
    };
  }

  /**
   * Retrieves all complaints with search and filtering for admin table.
   */
  static async getAllComplaints(filters?: {
    search?: string;
    status?: ComplaintStatus;
    category?: ComplaintCategory;
    priority?: Priority;
  }) {
    const where: any = {};

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
        { user: { name: { contains: q, mode: 'insensitive' } } },
        { user: { email: { contains: q, mode: 'insensitive' } } },
      ];
    }

    return prisma.complaint.findMany({
      where,
      orderBy: { createdAt: 'desc' },
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
   * Updates status or priority of a complaint.
   */
  static async updateComplaint(
    id: number,
    data: {
      status?: ComplaintStatus;
      priority?: Priority;
    }
  ) {
    const complaint = await prisma.complaint.findUnique({ where: { id } });
    if (!complaint) {
      const error: any = new Error('Complaint not found');
      error.statusCode = 404;
      throw error;
    }

    const updateData: any = {};
    if (data.status) updateData.status = data.status;
    if (data.priority) updateData.priority = data.priority;

    return prisma.complaint.update({
      where: { id },
      data: updateData,
      include: {
        user: { select: { id: true, name: true, email: true } },
        feedback: true,
      },
    });
  }
}
