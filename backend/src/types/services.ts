import { User } from "./user";

export enum ServiceTypes {
  VACCINE = "vaccine",
  CILINIC = "cilinc",
  CHANNEL = "channel",
}

export interface Service {
  serviceId: string;
  serviceType: ServiceTypes;
  serviceDate: string;
  patientId: string;
  providerId: string;
}

export interface ServiceWithUsers extends Service {
  patientUser?: User;
  providerUser?: User;
}
