// Import Zod validation library for runtime schema declaration and type validation
import { z } from 'zod';

/**
 * Enum Schema: Complaint Category
 * Defines all allowable campus complaint categories accepted by the system.
 */
export const complaintCategoryEnum = z.enum([
  'WIFI_IT',              // Network, internet connectivity, or campus software issues
  'ELECTRICAL',           // Power outages, faulty wiring, fans, or lighting
  'PLUMBING',             // Water leaks, tap issues, drainage problems
  'CLASSROOM_EQUIPMENT',  // Projectors, smart boards, benches, or podiums
  'HOSTEL_MAINTENANCE',   // Furniture, room locks, or general hostel living repairs
  'CLEANLINESS',          // Sanitation, waste management, washrooms, or campus litter
  'TRANSPORT',            // Campus shuttle, parking, or bus service concerns
  'INFRASTRUCTURE',       // Structural defects, roads, pathways, or building walls
  'SECURITY',             // Safety hazards, lighting at night, or security checkpoints
  'OTHER',                // General inquiries or miscellaneous campus issues
]);

/**
 * Enum Schema: Priority Levels
 * Defines the triage urgency of a complaint.
 */
export const priorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH']);

/**
 * Enum Schema: Complaint Lifecycle Statuses
 * Tracks progression from submission to resolution.
 */
export const complaintStatusEnum = z.enum(['PENDING', 'IN_PROGRESS', 'RESOLVED']);

/**
 * Validation Schema: Create Complaint Request Body
 * Enforces rules when a student creates a new complaint ticket.
 */
export const createComplaintSchema = z.object({
  // Complaint headline: required string with minimum 3 and maximum 200 characters
  title: z.string().min(3, 'Title must be at least 3 characters long').max(200),
  // Detailed description: requires at least 10 characters for informative clarity
  description: z.string().min(10, 'Description must be at least 10 characters long'),
  // Validated against the permitted complaint category enum list
  category: complaintCategoryEnum,
  // Campus location or building/room description (between 2 and 150 characters)
  location: z.string().min(2, 'Location is required').max(150),
  // Priority level (defaults to MEDIUM if omitted by client)
  priority: priorityEnum.default('MEDIUM'),
  // Optional AI suggestions captured at creation:
  aiCategory: z.string().optional().nullable(),     // AI suggested category
  aiPriority: z.string().optional().nullable(),     // AI suggested priority
  aiSummary: z.string().optional().nullable(),      // AI generated concise summary
  aiReason: z.string().optional().nullable(),       // AI rationale for classification
  aiDepartment: z.string().optional().nullable(),   // AI suggested department
  aiConfidence: z.number().optional().nullable(),   // AI classification confidence score (0 to 1)
});

/**
 * Validation Schema: Admin Update Complaint Request Body
 * Allows administrators to update complaint status and/or priority.
 */
export const updateComplaintStatusSchema = z.object({
  // New lifecycle status (optional in patch)
  status: complaintStatusEnum.optional(),
  // New priority level (optional in patch)
  priority: priorityEnum.optional(),
});

/**
 * Validation Schema: Submit Feedback Request Body
 * Validates rating and optional comment from students once complaint is resolved.
 */
export const submitFeedbackSchema = z.object({
  // Integer rating score from 1 (poor) to 5 (excellent)
  rating: z.number().int().min(1, 'Rating must be at least 1 star').max(5, 'Rating cannot exceed 5 stars'),
  // Optional feedback review notes up to 1000 characters
  comment: z.string().max(1000).optional().nullable(),
});

