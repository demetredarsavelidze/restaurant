import type { Request, Response } from "express";
import {
  createReservation,
  deleteReservation,
  getReservation,
  listReservations,
  updateReservation,
} from "../services/reservationService.js";
import { getPool, sql } from "../utils/sqlServer.js";
import { reservationSchema, reservationUpdateSchema } from "../utils/validation.js";

export const getReservations = async (req: Request, res: Response) => {
  const reservations = await listReservations({
    search: req.query.search ? String(req.query.search) : undefined,
    date: req.query.date ? String(req.query.date) : undefined,
    tableId: req.query.tableId ? String(req.query.tableId) : undefined,
  });

  res.json(reservations);
};

export const getReservationById = async (req: Request, res: Response) => {
  const reservation = await getReservation(Number(req.params.id));
  res.json(reservation);
};

export const postReservation = async (req: Request, res: Response) => {
  const payload = reservationSchema.parse(req.body);
  const reservation = await createReservation(payload);

  res.status(201).json(reservation);
};

export const putReservation = async (req: Request, res: Response) => {
  const payload = reservationUpdateSchema.parse(req.body);
  const reservation = await updateReservation(Number(req.params.id), payload);

  res.json(reservation);
};

export const removeReservation = async (req: Request, res: Response) => {
  await deleteReservation(Number(req.params.id));
  res.status(204).send();
};

export const getDashboardStats = async (_req: Request, res: Response) => {
  const today = new Date();
  const todayUtc = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const pool = await getPool();

  const [
    totalReservations,
    todaysReservations,
    occupiedTables,
    availableTables,
    totalMenuItems,
  ] = await Promise.all([
    pool.request().query<{ total: number }>("SELECT COUNT(*) AS [total] FROM [Reservation];"),
    pool
      .request()
      .input("today", sql.DateTime2, todayUtc)
      .query<{ total: number }>("SELECT COUNT(*) AS [total] FROM [Reservation] WHERE [reservationDate] = @today;"),
    pool
      .request()
      .query<{ total: number }>("SELECT COUNT(*) AS [total] FROM [RestaurantTable] WHERE [status] = N'OCCUPIED';"),
    pool
      .request()
      .query<{ total: number }>("SELECT COUNT(*) AS [total] FROM [RestaurantTable] WHERE [status] = N'AVAILABLE';"),
    pool.request().query<{ total: number }>("SELECT COUNT(*) AS [total] FROM [MenuItem];"),
  ]);

  res.json({
    totalReservations: totalReservations.recordset[0].total,
    todaysReservations: todaysReservations.recordset[0].total,
    occupiedTables: occupiedTables.recordset[0].total,
    availableTables: availableTables.recordset[0].total,
    totalMenuItems: totalMenuItems.recordset[0].total,
  });
};
