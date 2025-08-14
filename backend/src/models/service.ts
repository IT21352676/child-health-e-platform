import { Service, ServiceTypes } from "../types/services";
import { User } from "../types/user";
import { supabase } from "../utils/db";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

export const getAllServiceTypes = () => {
  const services = Object.entries(ServiceTypes).map((e) => ({
    type: e[0],
    value: e[1],
  }));

  return services;
};

export const createService = async ({
  serviceType,
  serviceDate,
  patientId,
  providerId,
  status,
}: Service): Promise<PostgrestSingleResponse<any> | null> => {
  const response = await supabase
    .from("services")
    .insert([
      {
        service_type: serviceType,
        service_date: serviceDate,
        patient_id: patientId,
        provider_id: providerId,
        status: status,
      },
    ])
    .select();

  if (response.error) {
    console.error("Error creating service:", response.error);
  }
  return response;
};

export const getServicesByPatient = async (patientId: User["id"]) => {
  //console.log(patientId);
  const { data, error } = await supabase
    .from("services")
    .select(
      `
      service_id,
      service_type,
      service_date,
      status,
      patient:users!patient_id(id, username, role),
      provider:users!provider_id(id, username, role)
    `
    )
    .eq("patient_id", patientId);

  if (error) throw error;
  return data;
};

export const getServicesWithUsers = async () => {
  const { data, error } = await supabase.from("services").select(`
      service_id,
      service_type,
      service_date,
      status,
      patient_id,
      provider_id,
      patient_user:users!patient_id(id, name, email),
      provider_user:users!provider_id(id, name, email)
    `);

  if (error) {
    console.error("Error fetching services with users:", error);
    return [];
  }

  return data.map((service) => ({
    ...service,
    patientUser: service.patient_user,
    providerUser: service.provider_user,
  }));
};
