import { Request, Response, NextFunction } from "express";
import { UVerifyToken } from "../utils/jwt.util";

export const MAuthValidate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
      throw new Error("Unauthorized");
    }

    const token = auth.split(" ")[1];
    if (!token) {
      throw new Error("Unauthorized");
    }

    const payload = await UVerifyToken(token);
    (req as any).user = payload; 
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized", error: (error as Error).message });
  }
};
