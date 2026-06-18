import { Router } from "express";
import {
  getDashboardStats,
  getReservationById,
  getReservations,
  postReservation,
  putReservation,
  removeReservation,
} from "../controllers/reservationController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAdmin } from "../middleware/auth.js";

export const reservationRoutes = Router();

reservationRoutes.post("/", asyncHandler(postReservation));
reservationRoutes.get("/", requireAdmin, asyncHandler(getReservations));
reservationRoutes.get("/stats/dashboard", requireAdmin, asyncHandler(getDashboardStats));
reservationRoutes.get("/:id", requireAdmin, asyncHandler(getReservationById));
reservationRoutes.put("/:id", requireAdmin, asyncHandler(putReservation));
reservationRoutes.delete("/:id", requireAdmin, asyncHandler(removeReservation));
