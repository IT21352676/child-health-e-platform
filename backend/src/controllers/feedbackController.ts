import { Request, Response, NextFunction } from 'express';
import { FeedbackService } from '../services/feedbackService';
import { CreateFeedbackSchema, UpdateFeedbackSchema, GetFeedbackQuerySchema } from '../schemas/feedbackSchemas';

export class FeedbackController {
  private feedbackService: FeedbackService;

  constructor() {
    this.feedbackService = new FeedbackService();
  }

  async createFeedback(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = CreateFeedbackSchema.parse(req.body);
      const feedback = await this.feedbackService.createFeedback(validatedData);

      res.status(201).json({
        status: 'success',
        message: 'Feedback created successfully',
        data: feedback
      });
    } catch (error) {
      next(error);
    }
  }

  async getFeedback(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedQuery = GetFeedbackQuerySchema.parse(req.query);
      const feedback = await this.feedbackService.getFeedbackByQuery(validatedQuery);

      res.status(200).json({
        status: 'success',
        data: feedback
      });
    } catch (error) {
      next(error);
    }
  }

  async getFeedbackById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { feedbackId } = req.params;
      const feedback = await this.feedbackService.getFeedbackById(feedbackId);

      if (!feedback) {
        res.status(404).json({
          status: 'error',
          message: 'Feedback not found'
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        data: feedback
      });
    } catch (error) {
      next(error);
    }
  }

  async updateFeedback(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { feedbackId } = req.params;
      const validatedData = UpdateFeedbackSchema.parse(req.body);

      const feedback = await this.feedbackService.updateFeedback(feedbackId, validatedData);

      res.status(200).json({
        status: 'success',
        message: 'Feedback updated successfully',
        data: feedback
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteFeedback(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { feedbackId } = req.params;
      await this.feedbackService.deleteFeedback(feedbackId);

      res.status(200).json({
        status: 'success',
        message: 'Feedback deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async getFeedbackStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { appointment_id } = req.query;
      const stats = await this.feedbackService.getFeedbackStats(
        appointment_id ? appointment_id.toString() : undefined
      );

      res.status(200).json({
        status: 'success',
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
}
