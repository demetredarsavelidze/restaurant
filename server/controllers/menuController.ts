import type { Request, Response } from "express";
import { menuItemSchema } from "../utils/validation.js";
import { HttpError } from "../utils/httpError.js";
import { getPool, sql } from "../utils/sqlServer.js";
import type { DbMenuItem } from "../types/db.js";

export const getMenuItems = async (req: Request, res: Response) => {
  const { search, category, sort } = req.query;
  const pool = await getPool();
  const request = pool.request();
  const where: string[] = [];

  if (search) {
    request.input("search", sql.NVarChar(255), `%${String(search).toLowerCase()}%`);
    where.push("(LOWER([name]) LIKE @search OR LOWER([description]) LIKE @search)");
  }

  if (category && category !== "All") {
    request.input("category", sql.NVarChar(120), String(category));
    where.push("[category] = @category");
  }

  const orderBy =
    sort === "price-desc"
      ? "[price] DESC"
      : sort === "price-asc"
        ? "[price] ASC"
        : "[category] ASC";

  const result = await request.query<DbMenuItem>(`
    SELECT [id], [name], [description], [price], [category], [imageUrl], [createdAt], [updatedAt]
    FROM [MenuItem]
    ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
    ORDER BY ${orderBy};
  `);

  res.json(result.recordset);
};

export const getMenuItem = async (req: Request, res: Response) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("id", sql.Int, Number(req.params.id))
    .query<DbMenuItem>(`
      SELECT [id], [name], [description], [price], [category], [imageUrl], [createdAt], [updatedAt]
      FROM [MenuItem]
      WHERE [id] = @id;
    `);
  const item = result.recordset[0];

  if (!item) {
    throw new HttpError(404, "Menu item was not found.");
  }

  res.json(item);
};

export const createMenuItem = async (req: Request, res: Response) => {
  const data = menuItemSchema.parse(req.body);
  const pool = await getPool();
  const result = await pool
    .request()
    .input("name", sql.NVarChar(255), data.name)
    .input("description", sql.NVarChar(sql.MAX), data.description)
    .input("price", sql.Decimal(10, 2), data.price)
    .input("category", sql.NVarChar(120), data.category)
    .input("imageUrl", sql.NVarChar(2048), data.imageUrl)
    .query<DbMenuItem>(`
      INSERT INTO [MenuItem] ([name], [description], [price], [category], [imageUrl])
      OUTPUT INSERTED.[id], INSERTED.[name], INSERTED.[description], INSERTED.[price],
             INSERTED.[category], INSERTED.[imageUrl], INSERTED.[createdAt], INSERTED.[updatedAt]
      VALUES (@name, @description, @price, @category, @imageUrl);
    `);
  const item = result.recordset[0];

  res.status(201).json(item);
};

export const updateMenuItem = async (req: Request, res: Response) => {
  const data = menuItemSchema.parse(req.body);
  const pool = await getPool();
  const result = await pool
    .request()
    .input("id", sql.Int, Number(req.params.id))
    .input("name", sql.NVarChar(255), data.name)
    .input("description", sql.NVarChar(sql.MAX), data.description)
    .input("price", sql.Decimal(10, 2), data.price)
    .input("category", sql.NVarChar(120), data.category)
    .input("imageUrl", sql.NVarChar(2048), data.imageUrl)
    .query<DbMenuItem>(`
      UPDATE [MenuItem]
      SET [name] = @name,
          [description] = @description,
          [price] = @price,
          [category] = @category,
          [imageUrl] = @imageUrl,
          [updatedAt] = SYSUTCDATETIME()
      OUTPUT INSERTED.[id], INSERTED.[name], INSERTED.[description], INSERTED.[price],
             INSERTED.[category], INSERTED.[imageUrl], INSERTED.[createdAt], INSERTED.[updatedAt]
      WHERE [id] = @id;
    `);
  const item = result.recordset[0];

  if (!item) {
    throw new HttpError(404, "Menu item was not found.");
  }

  res.json(item);
};

export const deleteMenuItem = async (req: Request, res: Response) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("id", sql.Int, Number(req.params.id))
    .query("DELETE FROM [MenuItem] WHERE [id] = @id;");

  if (!result.rowsAffected[0]) {
    throw new HttpError(404, "Menu item was not found.");
  }

  res.status(204).send();
};
