import { Request, Response } from "express";

import {
  getAllServiceTypes,
  createService,
  getServicesByPatient,
} from "../models/service";

export const viewAllServiceTypes = (req: Request, res: Response) => {
  const services = getAllServiceTypes();
  res.status(200).json(services);
};

export const bookService = async (req: Request, res: Response) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "Request body is required" });
  }
  const { serviceType, serviceDate, patientId, providerId, status } = req.body;

  if (!serviceType || !serviceDate || !patientId || !providerId || !status) {
    return res.status(404).json({ message: "All fields required" });
  }
  const response = await createService({
    serviceType,
    serviceDate,
    patientId,
    providerId,
    status,
  });
  if (response?.error) {
    return res.status(400).json({ message: response?.error });
  }

  if (response?.status === 201) {
    return res.status(200).json({ message: "Service created successfully" });
  } else {
    console.error("Something went wrong");
    return res.status(400).json({ message: "Something went wrong" });
  }
};

export const viewService = async (req: Request, res: Response) => {
  const { patient_id } = req.params;

  const data = await getServicesByPatient(patient_id);
  console.log(data);
};
