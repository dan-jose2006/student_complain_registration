import { z } from 'zod';

export const complaintCategoryEnum = z.enum([
  'WIFI_IT',
  'ELECTRICAL',
  'PLUMBING',
  'CLASSROOM_EQUIPMENT',
  'HOSTEL_MAINTENANCE',
  'CLEANLINESS',
  'TRANSPORT',
  'INFRASTRUCTURE',
  'SECURITY',
  'OTHER',
]);

export const priorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH']);

export const complaintStatusEnum = z.enum(['PENDING', 'IN_PROGRESS', 'RESOLVED']);

export const createComplaintSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters long'),
  category: complaintCategoryEnum,
  location: z.string().min(2, 'Location is required').max(150),
  priority: priorityEnum.default('MEDIUM'),
  // Optional AI suggestions captured at creation
  aiCategory: z.string().optional().nullable(),
  aiPriority: z.string().optional().nullable(),
  aiSummary: z.string().optional().nullable(),
  aiReason: z.string().optional().nullable(),
  aiDepartment: z.string().optional().nullable(),
  aiConfidence: z.number().optional().nullable(),
});

export const updateComplaintStatusSchema = z.object({
  status: complaintStatusEnum.optional(),
  priority: priorityEnum.optional(),
});

export const submitFeedbackSchema = z.object({
  rating: z.number().int().min(1, 'Rating must be at least 1 star').max(5, 'Rating cannot exceed 5 stars'),
  comment: z.string().max(1000).optional().nullable(),
});
