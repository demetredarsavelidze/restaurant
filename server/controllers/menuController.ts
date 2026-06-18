import type { Request, Response } from "express";
import { menuItemSchema } from "../utils/validation.js";
import { HttpError } from "../utils/httpError.js";
import { prisma } from "../utils/prisma.js";

const menuSelect = {
  id: true,
  name: true,
  description: true,
  price: true,
  category: true,
  imageUrl: true,
  createdAt: true,
  updatedAt: true,
};

export const getMenuItems = async (req: Request, res: Response) => {
  const { search, category, sort } = req.query;

  const items = await prisma.menuItem.findMany({
    where: {
      ...(search
        ? {
            OR: [
              { name: { contains: String(search), mode: "insensitive" } },
              { description: { contains: String(search), mode: "insensitive" } },
            ],
          }
        : {}),
      ...(category && category !== "All" ? { category: String(category) } : {}),
    },
    orderBy:
      sort === "price-desc"
        ? { price: "desc" }
        : sort === "price-asc"
          ? { price: "asc" }
          : { category: "asc" },
    select: menuSelect,
  });

  res.json(items);
};

export const getMenuItem = async (req: Request, res: Response) => {
  const item = await prisma.menuItem.findUnique({
    where: { id: Number(req.params.id) },
    select: menuSelect,
  });

  if (!item) {
    throw new HttpError(404, "Menu item was not found.");
  }

  res.json(item);
};

export const createMenuItem = async (req: Request, res: Response) => {
  const data = menuItemSchema.parse(req.body);
  const item = await prisma.menuItem.create({ data, select: menuSelect });

  res.status(201).json(item);
};

export const updateMenuItem = async (req: Request, res: Response) => {
  const data = menuItemSchema.parse(req.body);
  const item = await prisma.menuItem.update({
    where: { id: Number(req.params.id) },
    data,
    select: menuSelect,
  });

  res.json(item);
};

export const deleteMenuItem = async (req: Request, res: Response) => {
  await prisma.menuItem.delete({ where: { id: Number(req.params.id) } });
  res.status(204).send();
};
