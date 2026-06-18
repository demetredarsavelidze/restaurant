import { z } from "zod";

const requiredString = (field: string) =>
  z.string().trim().min(1, `${field} is required.`);

export const loginSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: requiredString("Password"),
});

export const menuItemSchema = z.object({
  name: requiredString("Name"),
  description: requiredString("Description"),
  price: z.coerce.number().positive("Price must be greater than zero."),
  category: requiredString("Category"),
  imageUrl: z.url("Please provide a valid image URL."),
});

export const tableUpdateSchema = z.object({
  capacity: z.coerce.number().int().min(1, "Capacity must be at least 1.").optional(),
  status: z.enum(["AVAILABLE", "RESERVED", "OCCUPIED"]).optional(),
});

export const reservationSchema = z.object({
  customerName: requiredString("Name"),
  customerEmail: z.email("Please enter a valid email address."),
  customerPhone: requiredString("Phone"),
  reservationDate: requiredString("Date"),
  reservationTime: requiredString("Time"),
  guests: z.coerce.number().int().min(1, "Guests must be at least 1."),
  notes: z.string().trim().optional().default(""),
  tableId: z.coerce.number().int().positive("Please select a table."),
});

export const reservationUpdateSchema = reservationSchema.partial().extend({
  tableId: z.coerce.number().int().positive("Please select a table.").optional(),
});
