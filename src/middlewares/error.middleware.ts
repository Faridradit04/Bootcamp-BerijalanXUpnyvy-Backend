import { NextFunction, Request, Response } from "express";
import { IGlobalResponse } from "../interfaces/global.interface.ts";
import Joi from "joi";


export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("Error:", err);

  const isDevelopment = process.env.NODE_ENV === "development";
  const errorObj: { message: string; field?: string; detail?: string } = {
    message: err.message,
  };

  if (err instanceof Error) {
    const response: IGlobalResponse = {
      status: false,
      message: err.message, 
      error: errorObj,
    };

    if (err.name) {
      errorObj.field = err.name;
    }

    if (isDevelopment && err.stack) {
      errorObj.detail = err.stack;
    }

    res.status(400).json(response);
  } else {
    const response: IGlobalResponse = {
      status: false,
      message: "An unexpected error occurred",
      error: {
        message: "Internal server error",
        ...(isDevelopment && { detail: String(err) }), 
      },
    };

    res.status(500).json(response);
  }
};

export const MValidate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const validationErrors = error.details.map((detail) => {
        return detail.message;
      });
      const err = new Error('Validation failed');
      (err as any).errors = validationErrors; 
      return next(err);
    }
    
    next();
  };
};
