import { HttpError } from "../utils/httpError.js";
import { toDateOnly } from "../utils/date.js";
import { getPool, sql } from "../utils/sqlServer.js";
import type { DbRestaurantTable, ReservationWithTable } from "../types/db.js";

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

type ReservationRow = Omit<ReservationWithTable, "table"> & {
  table_id: number;
  table_tableNumber: number;
  table_capacity: number;
  table_status: DbRestaurantTable["status"];
  table_createdAt: Date;
  table_updatedAt: Date;
};

const reservationSelect = `
  SELECT
    r.[id], r.[customerName], r.[customerEmail], r.[customerPhone],
    r.[reservationDate], r.[reservationTime], r.[guests], r.[notes],
    r.[tableId], r.[createdAt], r.[updatedAt],
    t.[id] AS [table_id],
    t.[tableNumber] AS [table_tableNumber],
    t.[capacity] AS [table_capacity],
    t.[status] AS [table_status],
    t.[createdAt] AS [table_createdAt],
    t.[updatedAt] AS [table_updatedAt]
  FROM [Reservation] r
  INNER JOIN [RestaurantTable] t ON t.[id] = r.[tableId]
`;

const mapReservation = (row: ReservationRow): ReservationWithTable => ({
  id: row.id,
  customerName: row.customerName,
  customerEmail: row.customerEmail,
  customerPhone: row.customerPhone,
  reservationDate: row.reservationDate,
  reservationTime: row.reservationTime,
  guests: row.guests,
  notes: row.notes,
  tableId: row.tableId,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
  table: {
    id: row.table_id,
    tableNumber: row.table_tableNumber,
    capacity: row.table_capacity,
    status: row.table_status,
    createdAt: row.table_createdAt,
    updatedAt: row.table_updatedAt,
  },
});

export const listReservations = async (query: {
  search?: string;
  date?: string;
  tableId?: string;
}) => {
  const pool = await getPool();
  const request = pool.request();
  const where: string[] = [];

  if (query.search) {
    request.input("search", sql.NVarChar(255), `%${query.search.toLowerCase()}%`);
    where.push(`(
      LOWER(r.[customerName]) LIKE @search OR
      LOWER(r.[customerEmail]) LIKE @search OR
      LOWER(r.[customerPhone]) LIKE @search
    )`);
  }

  if (query.date) {
    const date = toDateOnly(query.date);
    if (date) {
      request.input("reservationDate", sql.DateTime2, date);
      where.push("r.[reservationDate] = @reservationDate");
    }
  }

  if (query.tableId) {
    request.input("tableId", sql.Int, Number(query.tableId));
    where.push("r.[tableId] = @tableId");
  }

  const result = await request.query<ReservationRow>(`
    ${reservationSelect}
    ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
    ORDER BY r.[reservationDate] ASC, r.[reservationTime] ASC;
  `);

  return result.recordset.map(mapReservation);
};

export const getReservation = async (id: number) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query<ReservationRow>(`
      ${reservationSelect}
      WHERE r.[id] = @id;
    `);
  const reservation = result.recordset[0] ? mapReservation(result.recordset[0]) : undefined;

  if (!reservation) {
    throw new HttpError(404, "Reservation was not found.");
  }

  return reservation;
};

const assertTableCanHost = async (tableId: number, guests: number) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("tableId", sql.Int, tableId)
    .query<DbRestaurantTable>(`
      SELECT [id], [tableNumber], [capacity], [status], [createdAt], [updatedAt]
      FROM [RestaurantTable]
      WHERE [id] = @tableId;
    `);
  const table = result.recordset[0];

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
  const pool = await getPool();
  const request = pool
    .request()
    .input("tableId", sql.Int, tableId)
    .input("reservationDate", sql.DateTime2, reservationDate)
    .input("reservationTime", sql.NVarChar(20), reservationTime);

  if (reservationId) {
    request.input("reservationId", sql.Int, reservationId);
  }

  const result = await request.query<{ id: number }>(`
    SELECT TOP (1) [id]
    FROM [Reservation]
    WHERE [tableId] = @tableId
      AND [reservationDate] = @reservationDate
      AND [reservationTime] = @reservationTime
      ${reservationId ? "AND [id] <> @reservationId" : ""}
  `);
  const existing = result.recordset[0];

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

  const pool = await getPool();
  const transaction = new sql.Transaction(pool);
  let reservationId: number;

  try {
    await transaction.begin();
    const insert = await new sql.Request(transaction)
      .input("customerName", sql.NVarChar(255), input.customerName)
      .input("customerEmail", sql.NVarChar(320), input.customerEmail)
      .input("customerPhone", sql.NVarChar(80), input.customerPhone)
      .input("reservationDate", sql.DateTime2, reservationDate)
      .input("reservationTime", sql.NVarChar(20), input.reservationTime)
      .input("guests", sql.Int, input.guests)
      .input("notes", sql.NVarChar(sql.MAX), input.notes ?? null)
      .input("tableId", sql.Int, input.tableId)
      .query<{ id: number }>(`
        INSERT INTO [Reservation] (
          [customerName], [customerEmail], [customerPhone], [reservationDate],
          [reservationTime], [guests], [notes], [tableId]
        )
        OUTPUT INSERTED.[id]
        VALUES (
          @customerName, @customerEmail, @customerPhone, @reservationDate,
          @reservationTime, @guests, @notes, @tableId
        );
      `);

    await new sql.Request(transaction)
      .input("tableId", sql.Int, input.tableId)
      .query(`
        UPDATE [RestaurantTable]
        SET [status] = N'RESERVED', [updatedAt] = SYSUTCDATETIME()
        WHERE [id] = @tableId;
      `);

    await transaction.commit();
    reservationId = insert.recordset[0].id;
  } catch (error) {
    await transaction.rollback().catch(() => undefined);
    const sqlError = error as { number?: number };
    if (sqlError.number === 2601 || sqlError.number === 2627) {
      throw new HttpError(409, "That table is already booked at the selected time.");
    }
    throw error;
  }

  return getReservation(reservationId);
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

  const pool = await getPool();

  try {
    await pool
      .request()
      .input("id", sql.Int, id)
      .input("customerName", sql.NVarChar(255), input.customerName ?? existing.customerName)
      .input("customerEmail", sql.NVarChar(320), input.customerEmail ?? existing.customerEmail)
      .input("customerPhone", sql.NVarChar(80), input.customerPhone ?? existing.customerPhone)
      .input("reservationDate", sql.DateTime2, nextDate)
      .input("reservationTime", sql.NVarChar(20), nextTime)
      .input("guests", sql.Int, nextGuests)
      .input("notes", sql.NVarChar(sql.MAX), input.notes ?? existing.notes)
      .input("tableId", sql.Int, nextTableId)
      .query(`
        UPDATE [Reservation]
        SET [customerName] = @customerName,
            [customerEmail] = @customerEmail,
            [customerPhone] = @customerPhone,
            [reservationDate] = @reservationDate,
            [reservationTime] = @reservationTime,
            [guests] = @guests,
            [notes] = @notes,
            [tableId] = @tableId,
            [updatedAt] = SYSUTCDATETIME()
        WHERE [id] = @id;
      `);
  } catch (error) {
    const sqlError = error as { number?: number };
    if (sqlError.number === 2601 || sqlError.number === 2627) {
      throw new HttpError(409, "That table is already booked at the selected time.");
    }
    throw error;
  }

  return getReservation(id);
};

export const deleteReservation = async (id: number) => {
  const reservation = await getReservation(id);
  const pool = await getPool();
  const transaction = new sql.Transaction(pool);

  await transaction.begin();

  try {
    await new sql.Request(transaction)
      .input("id", sql.Int, id)
      .query("DELETE FROM [Reservation] WHERE [id] = @id;");

    const remaining = await new sql.Request(transaction)
      .input("tableId", sql.Int, reservation.tableId)
      .query<{ total: number }>("SELECT COUNT(*) AS [total] FROM [Reservation] WHERE [tableId] = @tableId;");

    if (remaining.recordset[0].total === 0) {
      await new sql.Request(transaction)
        .input("tableId", sql.Int, reservation.tableId)
        .query(`
          UPDATE [RestaurantTable]
          SET [status] = N'AVAILABLE', [updatedAt] = SYSUTCDATETIME()
          WHERE [id] = @tableId;
        `);
    }

    await transaction.commit();
  } catch (error) {
    await transaction.rollback().catch(() => undefined);
    throw error;
  }
};
