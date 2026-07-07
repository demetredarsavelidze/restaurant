import type { Request, Response } from "express";
import { tableUpdateSchema } from "../utils/validation.js";
import { HttpError } from "../utils/httpError.js";
import { getPool, sql } from "../utils/sqlServer.js";
import type { DbRestaurantTable } from "../types/db.js";

export const getTables = async (_req: Request, res: Response) => {
  const pool = await getPool();
  const result = await pool.request().query<DbRestaurantTable>(`
    SELECT [id], [tableNumber], [capacity], [status], [createdAt], [updatedAt]
    FROM [RestaurantTable]
    ORDER BY [tableNumber] ASC;
  `);

  res.json(result.recordset);
};

export const updateTable = async (req: Request, res: Response) => {
  const data = tableUpdateSchema.parse(req.body);
  const pool = await getPool();
  const request = pool.request().input("id", sql.Int, Number(req.params.id));
  const updates: string[] = [];

  if (data.capacity !== undefined) {
    request.input("capacity", sql.Int, data.capacity);
    updates.push("[capacity] = @capacity");
  }

  if (data.status !== undefined) {
    request.input("status", sql.NVarChar(32), data.status);
    updates.push("[status] = @status");
  }

  if (!updates.length) {
    const existing = await request.query<DbRestaurantTable>(`
      SELECT [id], [tableNumber], [capacity], [status], [createdAt], [updatedAt]
      FROM [RestaurantTable]
      WHERE [id] = @id;
    `);

    const table = existing.recordset[0];
    if (!table) throw new HttpError(404, "Table was not found.");
    return res.json(table);
  }

  const result = await request.query<DbRestaurantTable>(`
    UPDATE [RestaurantTable]
    SET ${updates.join(", ")}, [updatedAt] = SYSUTCDATETIME()
    OUTPUT INSERTED.[id], INSERTED.[tableNumber], INSERTED.[capacity], INSERTED.[status],
           INSERTED.[createdAt], INSERTED.[updatedAt]
    WHERE [id] = @id;
  `);
  const table = result.recordset[0];

  if (!table) {
    throw new HttpError(404, "Table was not found.");
  }

  res.json(table);
};
