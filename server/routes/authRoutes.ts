import { Router } from "express";
import { login } from "../controllers/authController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const authRoutes = Router();

authRoutes.post("/login", asyncHandler(login));
