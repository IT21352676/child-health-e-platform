import { Router } from 'express';
import { FeedbackController } from '../controllers/feedback.controller';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { CreateFeedbackSchema, UpdateFeedbackSchema, GetFeedbackQuerySchema } from '../schemas/feedback.schemas';
import { z } from 'zod';

const router = Router();
const feedbackController = new FeedbackController();

// Parameter validation schema
const FeedbackIdSchema = z.object({
  feedbackId: z.string().min(1, 'Feedback ID is required')
});

// POST /api/v1/feedback - Create new feedback
router.post(
  '/',
  validateBody(CreateFeedbackSchema),
  feedbackController.createFeedback.bind(feedbackController)
);

// GET /api/v1/feedback - Get feedback with optional filters
router.get(
  '/',
  validateQuery(GetFeedbackQuerySchema),
  feedbackController.getFeedback.bind(feedbackController)
);

// GET /api/v1/feedback/stats - Get feedback statistics
router.get(
  '/stats',
  feedbackController.getFeedbackStats.bind(feedbackController)
);

// GET /api/v1/feedback/:feedbackId - Get specific feedback
router.get(
  '/:feedbackId',
  validateParams(FeedbackIdSchema),
  feedbackController.getFeedbackById.bind(feedbackController)
);

// PUT /api/v1/feedback/:feedbackId - Update feedback
router.put(
  '/:feedbackId',
  validateParams(FeedbackIdSchema),
  validateBody(UpdateFeedbackSchema),
  feedbackController.updateFeedback.bind(feedbackController)
);

// DELETE /api/v1/feedback/:feedbackId - Delete feedback
router.delete(
  '/:feedbackId',
  validateParams(FeedbackIdSchema),
  feedbackController.deleteFeedback.bind(feedbackController)
);

export default router;
