import type { Request, Response } from "express";
import { tableUpdateSchema } from "../utils/validation.js";
import { prisma } from "../utils/prisma.js";

export const getTables = async (_req: Request, res: Response) => {
  const tables = await prisma.restaurantTable.findMany({
    orderBy: { tableNumber: "asc" },
  });

  res.json(tables);
};

export const updateTable = async (req: Request, res: Response) => {
  const data = tableUpdateSchema.parse(req.body);

  const table = await prisma.restaurantTable.update({
    where: { id: Number(req.params.id) },
    data,
  });

  res.json(table);
};
