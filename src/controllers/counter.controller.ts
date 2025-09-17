import { Request, Response, NextFunction } from "express";
import {
  CDeleteCounter,
  CGetCounter,
  CUpdateCounter,
  SCreateCounter,
} from "../services/counter.service";

export const CDelete = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.body;
    const result = await CDeleteCounter(parseInt(id));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const CGet = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.body;
    const result = await CGetCounter(parseInt(id));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const CCreate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id, name, currentQueue, maxQueue, isActive = true } = req.body;
    const result = await SCreateCounter(
      parseInt(id),
      name,
      parseInt(currentQueue),
      parseInt(maxQueue),
      isActive
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const CUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id, name, currentQueue, maxQueue, isActive = true } = req.body;
    const result = await CUpdateCounter(
      parseInt(id),
      name,
      parseInt(currentQueue),
      parseInt(maxQueue),
      isActive
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
