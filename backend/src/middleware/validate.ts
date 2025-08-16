import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError, ZodIssue } from "zod";

export const validateBody = (schema: AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      const zodErr = err as ZodError;
      return res.status(400).json({
        message: "Validation failed",
        errors: zodErr.errors.map((e: ZodIssue) => ({ path: e.path.join("."), message: e.message })),
      });
    }
  };
};

export const validateParams = (schema: AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.params = schema.parse(req.params);
      next();
    } catch (err) {
      const zodErr = err as ZodError;
      return res.status(400).json({
        message: "Validation failed",
        errors: zodErr.errors.map((e: ZodIssue) => ({ path: e.path.join("."), message: e.message })),
      });
    }
  };
};
