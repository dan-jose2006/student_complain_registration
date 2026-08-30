import { z } from 'zod';

export const analyzeComplaintSchema = z.object({
  title: z.string().min(3, 'Title is required for AI analysis'),
  description: z.string().min(5, 'Description is required for AI analysis'),
  location: z.string().optional().nullable(),
});
