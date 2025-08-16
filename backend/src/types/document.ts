import { Status } from "./status";

export interface Document {
  document_id: string;
  appointment_id: string;
  file_name: string;
  file_path: string;
  document_type: string;
  status: Status;
  upload_timestamp?: Date;
}
