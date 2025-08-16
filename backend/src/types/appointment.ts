import { Status } from "./status";

export interface Appointment {
  appointment_id: string;
  user_id: string;
  service_id: string;
  confirmed_by_official_id: string;
  appointment_datetime: string;
  qr_code_data: string;
  status: Status;
}
