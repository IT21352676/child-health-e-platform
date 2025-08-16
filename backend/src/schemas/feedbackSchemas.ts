import { z } from 'zod';

// Validation for creating feedback
export const CreateFeedbackSchema = z.object({
  appointment_id: z.string().min(1, 'Appointment ID is required'),
  user_id: z.string().min(1, 'User ID is required'),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  comment: z.string().optional(),
});

// Validation for updating feedback
export const UpdateFeedbackSchema = z.object({
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5').optional(),
  comment: z.string().optional(),
});

// Validation for feedback query parameters
export const GetFeedbackQuerySchema = z.object({
  appointment_id: z.string().optional(),
  user_id: z.string().optional(),
  rating: z.string().transform(val => parseInt(val)).pipe(z.number().min(1).max(5)).optional(),
  limit: z.string().transform(val => parseInt(val)).pipe(z.number().min(1).max(100)).optional(),
  offset: z.string().transform(val => parseInt(val)).pipe(z.number().min(0)).optional(),
});

export type CreateFeedbackRequest = z.infer<typeof CreateFeedbackSchema>;
export type UpdateFeedbackRequest = z.infer<typeof UpdateFeedbackSchema>;
export type GetFeedbackQuery = z.infer<typeof GetFeedbackQuerySchema>;
