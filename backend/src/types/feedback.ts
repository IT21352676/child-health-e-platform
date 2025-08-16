export interface Feedback {
  feedback_id: string;
  appointment_id: string;
  user_id: string;
  rating: number;
  comment: string;
  submitted_at?: Date;
}
