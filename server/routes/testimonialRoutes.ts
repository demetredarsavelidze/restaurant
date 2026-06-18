import { Router } from "express";
import { getTestimonials } from "../controllers/testimonialController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const testimonialRoutes = Router();

testimonialRoutes.get("/", asyncHandler(getTestimonials));
