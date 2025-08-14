import { Request, Response } from "express";
import { Service, ServiceTypes } from "../types/services";

export const getAllServices = (req: Request, res: Response) => {
  const services = Object.entries(ServiceTypes).map((e) => ({
    type: e[0],
    value: e[1],
  }));

  res.status(200).json(services);
};
