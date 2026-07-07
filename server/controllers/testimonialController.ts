import type { Request, Response } from "express";
import { getPool } from "../utils/sqlServer.js";
import type { DbTestimonial } from "../types/db.js";

export const getTestimonials = async (_req: Request, res: Response) => {
  const pool = await getPool();
  const result = await pool.request().query<DbTestimonial>(`
    SELECT TOP (6) [id], [customerName], [comment], [rating], [createdAt]
    FROM [Testimonial]
    ORDER BY [createdAt] DESC;
  `);

  res.json(result.recordset);
};
