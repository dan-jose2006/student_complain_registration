// Import Prisma database client singleton instance
import prisma from '../config/prisma';
// Import domain enum types for complaints, priorities, and statuses
import { ComplaintCategory, Priority, ComplaintStatus } from '../types';

/**
 * AdminService
 * Encapsulates administrative business logic including aggregation metrics,
 * multi-criteria search/filtering, and status/priority management.
 */
export class AdminService {
  /**
   * Generates full administrative analytics and dashboard metrics.
   * Runs concurrent queries via Prisma for fast dashboard loading.
   */
  static async getDashboardMetrics() {
    // Execute multiple aggregation and listing queries in parallel to minimize response latency
    const [
      total,         // Count of all complaints in the database
      pending,       // Count of complaints waiting to be reviewed
      inProgress,    // Count of complaints currently being handled
      resolved,      // Count of completed/closed complaints
      highPriority,  // Count of complaints marked with HIGH urgency
      complaints,    // List of all complaints with user and feedback relations for in-memory analytics
    ] = await Promise.all([
      prisma.complaint.count(),
      prisma.complaint.count({ where: { status: 'PENDING' } }),
      prisma.complaint.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.complaint.count({ where: { status: 'RESOLVED' } }),
      prisma.complaint.count({ where: { priority: 'HIGH' } }),
      prisma.complaint.findMany({
        orderBy: { createdAt: 'desc' }, // Order newest complaints first
        include: {
          user: { select: { id: true, name: true, email: true } }, // Include student details
          feedback: true, // Include student rating and review if resolved
        },
      }),
    ]);

    // Calculate percentage resolution rate rounded to 1 decimal place
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 1000) / 10 : 0;

    // Calculate start of current day in local server time for today's incoming reports
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    // Count how many complaints were filed since midnight today
    const todayReports = complaints.filter((c: any) => new Date(c.createdAt) >= startOfToday).length;

    // Initialize category distribution counters with zero for all supported categories
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

    // Aggregate tally count per complaint category
    complaints.forEach((c: any) => {
      if (categoryCounts[c.category] !== undefined) {
        categoryCounts[c.category]++;
      }
    });

    // Format category distribution into chart-ready objects with human-readable display names
    const categoryData = Object.entries(categoryCounts).map(([name, count]) => ({
      name,
      displayName: name.replace(/_/g, ' '),
      count,
    }));

    // Format status distribution for UI donut/pie chart visualization with predefined theme colors
    const statusData = [
      { name: 'PENDING', displayName: 'Pending', count: pending, color: '#f59e0b' },
      { name: 'IN_PROGRESS', displayName: 'In Progress', count: inProgress, color: '#3b82f6' },
      { name: 'RESOLVED', displayName: 'Resolved', count: resolved, color: '#10b981' },
    ];

    // Tally distribution across LOW, MEDIUM, and HIGH priorities
    const priorityCounts: Record<string, number> = { LOW: 0, MEDIUM: 0, HIGH: 0 };
    complaints.forEach((c: any) => {
      if (priorityCounts[c.priority] !== undefined) {
        priorityCounts[c.priority]++;
      }
    });
    // Format priority breakdown for charts
    const priorityData = Object.entries(priorityCounts).map(([name, count]) => ({
      name,
      count,
    }));

    // Compute day-by-day submission and resolution trends over the past 7 days
    const last7Days: { date: string; created: number; resolved: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i); // Offset backwards by i days
      const dateStr = d.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      // Count complaints created on dateStr
      const dayComplaints = complaints.filter(
        (c: any) => new Date(c.createdAt).toISOString().split('T')[0] === dateStr
      );
      // Count complaints resolved on dateStr
      const dayResolved = complaints.filter(
        (c: any) => c.status === 'RESOLVED' && new Date(c.updatedAt).toISOString().split('T')[0] === dateStr
      );

      // Push daily metrics entry
      last7Days.push({
        date: dateStr,
        created: dayComplaints.length,
        resolved: dayResolved.length,
      });
    }

    // Return compiled metrics and the 6 most recent complaints for dashboard quick-view
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
   * Supports search across title, description, location, student name, and student email.
   */
  static async getAllComplaints(filters?: {
    search?: string;
    status?: ComplaintStatus;
    category?: ComplaintCategory;
    priority?: Priority;
  }) {
    // Dynamic Prisma where query clause
    const where: any = {};

    // Filter by lifecycle status if provided
    if (filters?.status) {
      where.status = filters.status;
    }
    // Filter by category if provided
    if (filters?.category) {
      where.category = filters.category;
    }
    // Filter by priority urgency if provided
    if (filters?.priority) {
      where.priority = filters.priority;
    }
    // Perform case-insensitive multi-field search if search query string is specified
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

    // Execute query with applied filters and return newest complaints first
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
   * Throws 404 error if complaint with given ID does not exist.
   */
  static async updateComplaint(
    id: number,
    data: {
      status?: ComplaintStatus;
      priority?: Priority;
    }
  ) {
    // Check if target complaint exists before attempting update
    const complaint = await prisma.complaint.findUnique({ where: { id } });
    if (!complaint) {
      const error: any = new Error('Complaint not found');
      error.statusCode = 404;
      throw error;
    }

    // Prepare updated fields payload
    const updateData: any = {};
    if (data.status) updateData.status = data.status;
    if (data.priority) updateData.priority = data.priority;

    // Perform database update and return updated complaint with user and feedback relations
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

