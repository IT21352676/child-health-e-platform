import { Status } from "./status";

export interface Appointment {
  appointment_id: number;
  user_id: number;
  service_id: number;
  confirmed_by_official_id: string;
  appointment_datetime: string;
  qr_code_data: string | null;
  status: Status;
}
