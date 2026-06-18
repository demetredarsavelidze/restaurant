import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { HttpError } from "../utils/httpError.js";

type JwtPayload = {
  id: number;
  email: string;
  role: "ADMIN";
};

const getSecret = () => process.env.JWT_SECRET ?? "development-secret-change-me";

export const requireAdmin = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return next(new HttpError(401, "Admin authentication is required."));
  }

  try {
    const token = header.replace("Bearer ", "");
    const decoded = jwt.verify(token, getSecret()) as JwtPayload;

    if (decoded.role !== "ADMIN") {
      return next(new HttpError(403, "You do not have permission to access this resource."));
    }

    req.user = decoded;
    return next();
  } catch {
    return next(new HttpError(401, "Your session has expired. Please log in again."));
  }
};
