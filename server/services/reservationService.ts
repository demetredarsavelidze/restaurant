import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma.js";
import { HttpError } from "../utils/httpError.js";
import { toDateOnly } from "../utils/date.js";

type ReservationInput = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  reservationDate: string;
  reservationTime: string;
  guests: number;
  notes?: string;
  tableId: number;
};

const reservationInclude = {
  table: true,
} satisfies Prisma.ReservationInclude;

export const listReservations = async (query: {
  search?: string;
  date?: string;
  tableId?: string;
}) => {
  const where: Prisma.ReservationWhereInput = {};

  if (query.search) {
    where.OR = [
      { customerName: { contains: query.search, mode: "insensitive" } },
      { customerEmail: { contains: query.search, mode: "insensitive" } },
      { customerPhone: { contains: query.search, mode: "insensitive" } },
    ];
  }

  if (query.date) {
    const date = toDateOnly(query.date);
    if (date) where.reservationDate = date;
  }

  if (query.tableId) {
    where.tableId = Number(query.tableId);
  }

  return prisma.reservation.findMany({
    where,
    include: reservationInclude,
    orderBy: [{ reservationDate: "asc" }, { reservationTime: "asc" }],
  });
};

export const getReservation = async (id: number) => {
  const reservation = await prisma.reservation.findUnique({
    where: { id },
    include: reservationInclude,
  });

  if (!reservation) {
    throw new HttpError(404, "Reservation was not found.");
  }

  return reservation;
};

const assertTableCanHost = async (tableId: number, guests: number) => {
  const table = await prisma.restaurantTable.findUnique({ where: { id: tableId } });

  if (!table) {
    throw new HttpError(404, "Selected table was not found.");
  }

  if (guests > table.capacity) {
    throw new HttpError(400, `Table ${table.tableNumber} seats up to ${table.capacity} guests.`);
  }

  return table;
};

const assertSlotAvailable = async (
  tableId: number,
  reservationDate: Date,
  reservationTime: string,
  reservationId?: number,
) => {
  const existing = await prisma.reservation.findFirst({
    where: {
      tableId,
      reservationDate,
      reservationTime,
      ...(reservationId ? { NOT: { id: reservationId } } : {}),
    },
  });

  if (existing) {
    throw new HttpError(409, "That table is already booked at the selected time.");
  }
};

export const createReservation = async (input: ReservationInput) => {
  const reservationDate = toDateOnly(input.reservationDate);

  if (!reservationDate) {
    throw new HttpError(400, "Please choose a valid reservation date.");
  }

  await assertTableCanHost(input.tableId, input.guests);
  await assertSlotAvailable(input.tableId, reservationDate, input.reservationTime);

  return prisma.$transaction(async (tx) => {
    const reservation = await tx.reservation.create({
      data: {
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        reservationDate,
        reservationTime: input.reservationTime,
        guests: input.guests,
        notes: input.notes,
        tableId: input.tableId,
      },
      include: reservationInclude,
    });

    await tx.restaurantTable.update({
      where: { id: input.tableId },
      data: { status: "RESERVED" },
    });

    return reservation;
  });
};

export const updateReservation = async (id: number, input: Partial<ReservationInput>) => {
  const existing = await getReservation(id);
  const nextTableId = input.tableId ?? existing.tableId;
  const nextGuests = input.guests ?? existing.guests;
  const nextDate = input.reservationDate ? toDateOnly(input.reservationDate) : existing.reservationDate;
  const nextTime = input.reservationTime ?? existing.reservationTime;

  if (!nextDate) {
    throw new HttpError(400, "Please choose a valid reservation date.");
  }

  await assertTableCanHost(nextTableId, nextGuests);
  await assertSlotAvailable(nextTableId, nextDate, nextTime, id);

  return prisma.reservation.update({
    where: { id },
    data: {
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone,
      reservationDate: nextDate,
      reservationTime: input.reservationTime,
      guests: input.guests,
      notes: input.notes,
      tableId: input.tableId,
    },
    include: reservationInclude,
  });
};

export const deleteReservation = async (id: number) => {
  const reservation = await getReservation(id);

  await prisma.$transaction(async (tx) => {
    await tx.reservation.delete({ where: { id } });

    const remaining = await tx.reservation.count({
      where: { tableId: reservation.tableId },
    });

    if (remaining === 0) {
      await tx.restaurantTable.update({
        where: { id: reservation.tableId },
        data: { status: "AVAILABLE" },
      });
    }
  });
};
