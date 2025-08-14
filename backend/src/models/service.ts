import { ServiceTypes } from "../types/services";
import { supabase } from "../utils/db";

const createService = async ({
  serviceType,
  serviceDate,
  patientId,
  providerId,
}: {
  serviceType: ServiceTypes;
  serviceDate: string;
  patientId: string;
  providerId: string;
}) => {
  const { data, error } = await supabase
    .from("services")
    .insert([
      {
        service_type: serviceType,
        service_date: serviceDate,
        patient_id: patientId,
        provider_id: providerId,
      },
    ])
    .select();

  if (error) throw error;
  return data;
};

const getServices = async () => {
  const { data, error } = await supabase.from("services").select(`
      service_id,
      service_type,
      service_date,
      patient:users!patient_id(id, name, email),
      provider:users!provider_id(id, name, email)
    `);

  if (error) throw error;
  return data;
};

const getServicesWithUsers = async () => {
  const { data, error } = await supabase.from("services").select(`
      service_id,
      service_type,
      service_date,
      patient_id,
      provider_id,
      patient_user:users!patient_id(id, name, email),
      provider_user:users!provider_id(id, name, email)
    `);

  if (error) {
    console.error("Error fetching services with users:", error);
    return [];
  }

  // Transform the data into ServiceWithUsers format
  return data.map((service) => ({
    ...service,
    patientUser: service.patient_user, // Include full user details for patient
    providerUser: service.provider_user, // Include full user details for provider
  }));
};
