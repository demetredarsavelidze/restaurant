import { Router } from "express";
import { getTables, updateTable } from "../controllers/tableController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAdmin } from "../middleware/auth.js";

export const tableRoutes = Router();

tableRoutes.get("/", asyncHandler(getTables));
tableRoutes.put("/:id", requireAdmin, asyncHandler(updateTable));
