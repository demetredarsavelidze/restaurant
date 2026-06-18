import type { Request, Response } from "express";
import { prisma } from "../utils/prisma.js";

export const getTestimonials = async (_req: Request, res: Response) => {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  res.json(testimonials);
};
