import { Router } from "express";
import {
  createMenuItem,
  deleteMenuItem,
  getMenuItem,
  getMenuItems,
  updateMenuItem,
} from "../controllers/menuController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAdmin } from "../middleware/auth.js";

export const menuRoutes = Router();

menuRoutes.get("/", asyncHandler(getMenuItems));
menuRoutes.get("/:id", asyncHandler(getMenuItem));
menuRoutes.post("/", requireAdmin, asyncHandler(createMenuItem));
menuRoutes.put("/:id", requireAdmin, asyncHandler(updateMenuItem));
menuRoutes.delete("/:id", requireAdmin, asyncHandler(deleteMenuItem));
