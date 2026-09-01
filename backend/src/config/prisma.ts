import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { logger } from '../utils/logger';

// Real Prisma Client
const realPrisma = new PrismaClient({
  log: ['error'],
});

// Resilient In-Memory Storage Adapter for local execution without live Postgres instance
class ResilientDB {
  users: any[] = [];
  complaints: any[] = [];
  feedbacks: any[] = [];
  private initialized = false;
  private complaintIdCounter = 101;

  constructor() {
    this.seedDefaults();
  }

  private seedDefaults() {
    if (this.initialized) return;
    this.initialized = true;

    const salt = bcrypt.genSaltSync(10);
    const adminHash = bcrypt.hashSync('Admin@123', salt);
    const studentHash = bcrypt.hashSync('Student@123', salt);

    const admin = {
      id: 'usr_admin_01',
      name: 'Campus Administrator',
      email: 'admin@campuscare.com',
      passwordHash: adminHash,
      role: 'ADMIN',
      createdAt: new Date(Date.now() - 30 * 86400000),
      updatedAt: new Date(Date.now() - 30 * 86400000),
    };

    const student1 = {
      id: 'usr_student_01',
      name: 'Alex Turner',
      email: 'student@campuscare.com',
      passwordHash: studentHash,
      role: 'STUDENT',
      createdAt: new Date(Date.now() - 20 * 86400000),
      updatedAt: new Date(Date.now() - 20 * 86400000),
    };

    const student2 = {
      id: 'usr_student_02',
      name: 'Jane Doe',
      email: 'jane.doe@campuscare.com',
      passwordHash: studentHash,
      role: 'STUDENT',
      createdAt: new Date(Date.now() - 15 * 86400000),
      updatedAt: new Date(Date.now() - 15 * 86400000),
    };

    const student3 = {
      id: 'usr_student_03',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@campuscare.com',
      passwordHash: studentHash,
      role: 'STUDENT',
      createdAt: new Date(Date.now() - 10 * 86400000),
      updatedAt: new Date(Date.now() - 10 * 86400000),
    };

    this.users.push(admin, student1, student2, student3);

    const daysAgo = (d: number, h = 0) => new Date(Date.now() - d * 86400000 - h * 3600000);

    const initialComplaints = [
      {
        id: 1,
        userId: student1.id,
        title: 'Frequent Wi-Fi disconnections on Central Library 3rd floor',
        description: 'The campus Wi-Fi access point AP-LIB-03 drops signal every 5 to 10 minutes during peak study hours.',
        category: 'WIFI_IT',
        location: 'Central Library – 3rd Floor East Wing',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        createdAt: daysAgo(2, 4),
        updatedAt: daysAgo(0, 5),
        aiCategory: 'WIFI_IT',
        aiPriority: 'HIGH',
        aiSummary: 'Library 3rd floor access point AP-LIB-03 unstable during study hours.',
        aiReason: 'High concurrent user load affecting academic research access.',
        aiDepartment: 'Information Technology Services',
        aiConfidence: 0.95,
      },
      {
        id: 2,
        userId: student1.id,
        title: "Water pipe dripping in Ground Floor Men's Washroom",
        description: 'The drainage pipe beneath the second washbasin is continuously leaking, causing water puddles near the washroom entryway.',
        category: 'PLUMBING',
        location: 'Academic Block A – Ground Floor',
        priority: 'HIGH',
        status: 'RESOLVED',
        createdAt: daysAgo(6),
        updatedAt: daysAgo(3),
        aiCategory: 'PLUMBING',
        aiPriority: 'HIGH',
        aiSummary: 'Washroom pipe leakage causing floor puddling.',
        aiReason: 'Slip and hygiene hazard requiring rapid estate maintenance.',
        aiDepartment: 'Estate & Plumbing Services',
        aiConfidence: 0.94,
      },
      {
        id: 3,
        userId: student1.id,
        title: 'AC unit blowing ambient air in Seminar Hall B',
        description: 'The split AC unit on the left wall produces a loud buzzing noise and does not provide cool air.',
        category: 'ELECTRICAL',
        location: 'Admin Building – Seminar Hall B',
        priority: 'MEDIUM',
        status: 'PENDING',
        createdAt: daysAgo(0, 8),
        updatedAt: daysAgo(0, 8),
        aiCategory: 'ELECTRICAL',
        aiPriority: 'MEDIUM',
        aiSummary: 'Seminar Hall B air conditioner cooling failure with compressor noise.',
        aiReason: 'Ventilation issue causing thermal discomfort for scheduled lectures.',
        aiDepartment: 'Electrical Maintenance Wing',
        aiConfidence: 0.91,
      },
      {
        id: 4,
        userId: student1.id,
        title: 'Loose window latch in Hostel Block 1 Room 204',
        description: 'The sliding window latch is detached from the frame. Window rattles violently during monsoon winds.',
        category: 'HOSTEL_MAINTENANCE',
        location: 'Boys Hostel 1 – Room 204',
        priority: 'LOW',
        status: 'RESOLVED',
        createdAt: daysAgo(9),
        updatedAt: daysAgo(7),
        aiCategory: 'HOSTEL_MAINTENANCE',
        aiPriority: 'LOW',
        aiSummary: 'Window latch mechanical fault in room 204.',
        aiReason: 'Minor residential repair request.',
        aiDepartment: 'Student Residence Administration',
        aiConfidence: 0.89,
      },
      {
        id: 5,
        userId: student2.id,
        title: 'Projector HDMI port damaged in Classroom 102',
        description: 'The HDMI cable socket on the instructor podium is physically bent. Faculty cannot project lecture slides.',
        category: 'CLASSROOM_EQUIPMENT',
        location: 'Science Block – Classroom 102',
        priority: 'HIGH',
        status: 'RESOLVED',
        createdAt: daysAgo(4),
        updatedAt: daysAgo(2),
        aiCategory: 'CLASSROOM_EQUIPMENT',
        aiPriority: 'HIGH',
        aiSummary: 'Damaged podium HDMI port hindering class presentations.',
        aiReason: 'Classroom multimedia outage halts instructional activities.',
        aiDepartment: 'Academic Media & AV Support',
        aiConfidence: 0.96,
      },
      {
        id: 6,
        userId: student2.id,
        title: 'Cafeteria outdoor dining tables not cleared regularly',
        description: 'Lunch trays and food waste remain on patio tables for over 3 hours during peak afternoon.',
        category: 'CLEANLINESS',
        location: 'Student Activity Center – Cafeteria Patio',
        priority: 'MEDIUM',
        status: 'IN_PROGRESS',
        createdAt: daysAgo(1, 10),
        updatedAt: daysAgo(0, 4),
        aiCategory: 'CLEANLINESS',
        aiPriority: 'MEDIUM',
        aiSummary: 'Delayed food tray clearance on cafeteria outdoor patio.',
        aiReason: 'Sanitation standard compliance needed for dining areas.',
        aiDepartment: 'Sanitation & Housekeeping',
        aiConfidence: 0.93,
      },
      {
        id: 7,
        userId: student2.id,
        title: 'Campus shuttle Route 3 consistently 25 mins late',
        description: 'The morning 8:15 AM bus from Metro Station arrives past 8:40 AM every Tuesday and Thursday.',
        category: 'TRANSPORT',
        location: 'Metro Station – Shuttle Pick-up Bay',
        priority: 'MEDIUM',
        status: 'PENDING',
        createdAt: daysAgo(1, 14),
        updatedAt: daysAgo(1, 14),
        aiCategory: 'TRANSPORT',
        aiPriority: 'MEDIUM',
        aiSummary: 'Route 3 morning campus shuttle timing delay.',
        aiReason: 'Transit schedule variance impacting student class punctuality.',
        aiDepartment: 'Campus Logistics & Transport',
        aiConfidence: 0.92,
      },
      {
        id: 8,
        userId: student2.id,
        title: 'Broken paver block on North Botanical Walkway',
        description: 'Several stone pavers have shifted and cracked, creating a sharp raised edge.',
        category: 'INFRASTRUCTURE',
        location: 'Campus North Zone – Botanical Garden Path',
        priority: 'LOW',
        status: 'PENDING',
        createdAt: daysAgo(3),
        updatedAt: daysAgo(3),
        aiCategory: 'INFRASTRUCTURE',
        aiPriority: 'LOW',
        aiSummary: 'Displaced paver stones on pedestrian botanical walkway.',
        aiReason: 'Minor trip hazard along illuminated outdoor pathway.',
        aiDepartment: 'Civil Infrastructure & Grounds',
        aiConfidence: 0.88,
      },
      {
        id: 9,
        userId: student3.id,
        title: 'Streetlight #14 flickering continuously near Gate 2',
        description: 'The tall LED lamppost right before the parking entrance strobes violently at night.',
        category: 'ELECTRICAL',
        location: 'Gate 2 – Perimeter Ring Road',
        priority: 'MEDIUM',
        status: 'IN_PROGRESS',
        createdAt: daysAgo(2, 6),
        updatedAt: daysAgo(0, 6),
        aiCategory: 'ELECTRICAL',
        aiPriority: 'MEDIUM',
        aiSummary: 'Perimeter lamppost #14 strobe flickering at night.',
        aiReason: 'Night road illumination safety concern for vehicle drivers and cyclists.',
        aiDepartment: 'Electrical Maintenance Wing',
        aiConfidence: 0.94,
      },
      {
        id: 10,
        userId: student3.id,
        title: 'Motorbikes parking in reserved bicycle bays',
        description: 'Fuel motorcycles have crowded the pedal bicycle stand near the gymnasium.',
        category: 'SECURITY',
        location: 'Sports Complex – Cycle Stand',
        priority: 'MEDIUM',
        status: 'RESOLVED',
        createdAt: daysAgo(5),
        updatedAt: daysAgo(2),
        aiCategory: 'SECURITY',
        aiPriority: 'MEDIUM',
        aiSummary: 'Unauthorized motorcycle encroachment in bicycle stand.',
        aiReason: 'Parking policy enforcement required by campus security personnel.',
        aiDepartment: 'Campus Security Division',
        aiConfidence: 0.91,
      },
    ];

    this.complaints.push(...initialComplaints);
    this.complaintIdCounter = 11;

    this.feedbacks.push(
      {
        id: 'fb_01',
        complaintId: 2,
        userId: student1.id,
        rating: 5,
        comment: 'Plumbing technician arrived within 3 hours and repaired the pipe. Excellent response time!',
        createdAt: daysAgo(3, -2),
      },
      {
        id: 'fb_02',
        complaintId: 4,
        userId: student1.id,
        rating: 4,
        comment: 'Carpenter fixed the latch with new screws. Secure now.',
        createdAt: daysAgo(7, -1),
      },
      {
        id: 'fb_03',
        complaintId: 5,
        userId: student2.id,
        rating: 5,
        comment: 'AV support team installed a brand-new switcher. Lecture presentations working smoothly.',
        createdAt: daysAgo(2, -2),
      },
      {
        id: 'fb_04',
        complaintId: 10,
        userId: student3.id,
        rating: 4,
        comment: 'Security placed dedicated bollards. Stand is clear.',
        createdAt: daysAgo(2, -1),
      }
    );
  }

  // Model Operations
  get user() {
    return {
      findUnique: async ({ where }: any) => {
        if (where.id) return this.users.find((u) => u.id === where.id) || null;
        if (where.email) return this.users.find((u) => u.email.toLowerCase() === where.email.toLowerCase()) || null;
        return null;
      },
      create: async ({ data }: any) => {
        const newUser = {
          id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        this.users.push(newUser);
        return newUser;
      },
      deleteMany: async () => {
        this.users = [];
        return { count: 0 };
      },
    };
  }

  get complaint() {
    return {
      findMany: async (args?: any) => {
        let results = [...this.complaints];

        if (args?.where) {
          const w = args.where;
          if (w.userId) results = results.filter((c) => c.userId === w.userId);
          if (w.status) results = results.filter((c) => c.status === w.status);
          if (w.category) results = results.filter((c) => c.category === w.category);
          if (w.priority) results = results.filter((c) => c.priority === w.priority);
          if (w.OR) {
            results = results.filter((c) => {
              const u = this.users.find((user) => user.id === c.userId);
              return w.OR.some((clause: any) => {
                if (clause.title) return c.title.toLowerCase().includes(clause.title.contains.toLowerCase());
                if (clause.description) return c.description.toLowerCase().includes(clause.description.contains.toLowerCase());
                if (clause.location) return c.location.toLowerCase().includes(clause.location.contains.toLowerCase());
                if (clause.user?.name && u) return u.name.toLowerCase().includes(clause.user.name.contains.toLowerCase());
                if (clause.user?.email && u) return u.email.toLowerCase().includes(clause.user.email.contains.toLowerCase());
                return false;
              });
            });
          }
        }

        // Sort by createdAt desc by default
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        // Attach relations
        return results.map((c) => ({
          ...c,
          user: this.users.find((u) => u.id === c.userId) || { id: c.userId, name: 'Student', email: 'student@campuscare.com' },
          feedback: this.feedbacks.find((f) => f.complaintId === c.id) || null,
        }));
      },
      findUnique: async ({ where }: any) => {
        const c = this.complaints.find((comp) => comp.id === where.id);
        if (!c) return null;
        return {
          ...c,
          user: this.users.find((u) => u.id === c.userId) || { id: c.userId, name: 'Student', email: 'student@campuscare.com' },
          feedback: this.feedbacks.find((f) => f.complaintId === c.id) || null,
        };
      },
      count: async (args?: any) => {
        let results = [...this.complaints];
        if (args?.where?.status) results = results.filter((c) => c.status === args.where.status);
        if (args?.where?.priority) results = results.filter((c) => c.priority === args.where.priority);
        return results.length;
      },
      create: async ({ data }: any) => {
        const newComplaint = {
          id: this.complaintIdCounter++,
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        this.complaints.unshift(newComplaint);
        return {
          ...newComplaint,
          user: this.users.find((u) => u.id === newComplaint.userId) || { id: newComplaint.userId, name: 'Student', email: 'student@campuscare.com' },
          feedback: null,
        };
      },
      update: async ({ where, data }: any) => {
        const idx = this.complaints.findIndex((c) => c.id === where.id);
        if (idx === -1) throw new Error('Complaint not found');
        this.complaints[idx] = {
          ...this.complaints[idx],
          ...data,
          updatedAt: new Date(),
        };
        const c = this.complaints[idx];
        return {
          ...c,
          user: this.users.find((u) => u.id === c.userId),
          feedback: this.feedbacks.find((f) => f.complaintId === c.id) || null,
        };
      },
      deleteMany: async () => {
        this.complaints = [];
        return { count: 0 };
      },
    };
  }

  get feedback() {
    return {
      create: async ({ data }: any) => {
        const fb = {
          id: `fb_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          ...data,
          createdAt: new Date(),
        };
        this.feedbacks.push(fb);
        return fb;
      },
      deleteMany: async () => {
        this.feedbacks = [];
        return { count: 0 };
      },
    };
  }

  async $disconnect() {}
}

// Resilient DB instance
const resilientDb = new ResilientDB();

// Determine if live database should be default
const hasValidDbUrl = Boolean(process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost:5432'));
let useFallback = !hasValidDbUrl;

if (hasValidDbUrl) {
  logger.info('🐘 PostgreSQL database target detected in environment');
}

// Test connection check
realPrisma
  .$queryRaw`SELECT 1`
  .then(() => {
    useFallback = false;
    logger.info('🐘 PostgreSQL database connected successfully via Prisma');
  })
  .catch((err: any) => {
    if (!hasValidDbUrl) {
      useFallback = true;
      logger.info('📦 Local in-memory PostgreSQL simulation mode active (Seamless Zero-Config Execution)');
    } else {
      logger.error('PostgreSQL connection check failed, continuing with direct Prisma Client:', err?.message || err);
    }
  });

// Proxy router: routes to realPrisma or resilientDb dynamically
export const prisma: any = new Proxy(
  {},
  {
    get(_target, prop) {
      if (useFallback) {
        return (resilientDb as any)[prop];
      }
      return (realPrisma as any)[prop];
    },
  }
);

export default prisma;
