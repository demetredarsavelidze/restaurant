import { z } from "zod";

const required = (field: string) => z.string().trim().min(1, `${field} is required.`);

export const loginFormSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: required("Password"),
});

export const reservationFormSchema = z.object({
  customerName: required("Name"),
  customerEmail: z.email("Enter a valid email address."),
  customerPhone: required("Phone"),
  reservationDate: required("Date"),
  reservationTime: required("Time"),
  guests: z.number().min(1, "Guests must be at least 1."),
  notes: z.string().optional(),
  tableId: z.number().min(1, "Please select a table."),
});

export const menuFormSchema = z.object({
  name: required("Name"),
  description: required("Description"),
  price: z.number().positive("Price must be greater than zero."),
  category: required("Category"),
  imageUrl: z.url("Enter a valid image URL."),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
export type ReservationFormValues = z.infer<typeof reservationFormSchema>;
export type MenuFormValues = z.infer<typeof menuFormSchema>;
