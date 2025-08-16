import { supabase } from '../config/supabase';
import { Feedback } from '../types/feedback';
import { CreateFeedbackRequest, UpdateFeedbackRequest, GetFeedbackQuery } from '../schemas/feedbackSchemas';

export class FeedbackService {

  async createFeedback(feedbackData: CreateFeedbackRequest): Promise<Feedback> {
    try {
      // Check if feedback already exists for this appointment and user
      const { data: existingFeedback } = await supabase
        .from('feedback')
        .select('feedback_id')
        .eq('appointment_id', parseInt(feedbackData.appointment_id))
        .eq('user_id', parseInt(feedbackData.user_id))
        .single();

      if (existingFeedback) {
        throw new Error('Feedback already exists for this appointment');
      }

      const { data, error } = await supabase
        .from('feedback')
        .insert({
          appointment_id: parseInt(feedbackData.appointment_id),
          user_id: parseInt(feedbackData.user_id),
          rating: feedbackData.rating,
          comment: feedbackData.comment || null
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create feedback: ${error.message}`);
      }

      return this.mapDatabaseToFeedback(data);
    } catch (error) {
      throw error;
    }
  }

  async getFeedbackByQuery(query: GetFeedbackQuery): Promise<Feedback[]> {
    try {
      let supabaseQuery = supabase
        .from('feedback')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (query.appointment_id) {
        supabaseQuery = supabaseQuery.eq('appointment_id', parseInt(query.appointment_id));
      }

      if (query.user_id) {
        supabaseQuery = supabaseQuery.eq('user_id', parseInt(query.user_id));
      }

      if (query.rating) {
        supabaseQuery = supabaseQuery.eq('rating', query.rating);
      }

      if (query.limit) {
        supabaseQuery = supabaseQuery.limit(query.limit);
      }

      if (query.offset) {
        supabaseQuery = supabaseQuery.range(query.offset, query.offset + (query.limit || 10) - 1);
      }

      const { data, error } = await supabaseQuery;

      if (error) {
        throw new Error(`Failed to fetch feedback: ${error.message}`);
      }

      return data.map(this.mapDatabaseToFeedback);
    } catch (error) {
      throw error;
    }
  }

  async getFeedbackById(feedbackId: string): Promise<Feedback | null> {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .eq('feedback_id', parseInt(feedbackId))
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Feedback not found
        }
        throw new Error(`Failed to fetch feedback: ${error.message}`);
      }

      return this.mapDatabaseToFeedback(data);
    } catch (error) {
      throw error;
    }
  }

  async updateFeedback(feedbackId: string, updateData: UpdateFeedbackRequest): Promise<Feedback> {
    try {
      const updateObject: any = {};

      if (updateData.rating !== undefined) {
        updateObject.rating = updateData.rating;
      }

      if (updateData.comment !== undefined) {
        updateObject.comment = updateData.comment;
      }

      if (Object.keys(updateObject).length === 0) {
        throw new Error('No valid fields to update');
      }

      const { data, error } = await supabase
        .from('feedback')
        .update(updateObject)
        .eq('feedback_id', parseInt(feedbackId))
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update feedback: ${error.message}`);
      }

      return this.mapDatabaseToFeedback(data);
    } catch (error) {
      throw error;
    }
  }

  async deleteFeedback(feedbackId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('feedback')
        .delete()
        .eq('feedback_id', parseInt(feedbackId));

      if (error) {
        throw new Error(`Failed to delete feedback: ${error.message}`);
      }
    } catch (error) {
      throw error;
    }
  }

  async getFeedbackStats(appointmentId?: string): Promise<{
    totalFeedback: number;
    averageRating: number;
    ratingDistribution: { [key: number]: number };
  }> {
    try {
      let query = supabase.from('feedback').select('rating');

      if (appointmentId) {
        query = query.eq('appointment_id', parseInt(appointmentId));
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to fetch feedback stats: ${error.message}`);
      }

      const totalFeedback = data.length;
      const ratings = data.map(f => f.rating).filter(r => r !== null);

      const averageRating = ratings.length > 0
        ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
        : 0;

      const ratingDistribution: { [key: number]: number } = {
        1: 0, 2: 0, 3: 0, 4: 0, 5: 0
      };

      ratings.forEach(rating => {
        if (rating >= 1 && rating <= 5) {
          ratingDistribution[rating]++;
        }
      });

      return {
        totalFeedback,
        averageRating: Math.round(averageRating * 100) / 100,
        ratingDistribution
      };
    } catch (error) {
      throw error;
    }
  }

  private mapDatabaseToFeedback(dbRecord: any): Feedback {
    return {
      feedback_id: dbRecord.feedback_id.toString(),
      appointment_id: dbRecord.appointment_id.toString(),
      user_id: dbRecord.user_id.toString(),
      rating: dbRecord.rating,
      comment: dbRecord.comment || '',
      submitted_at: dbRecord.submitted_at ? new Date(dbRecord.submitted_at) : undefined
    };
  }
}
