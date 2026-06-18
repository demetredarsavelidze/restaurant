import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiCheckCircle } from "react-icons/fi";
import { getApiError } from "../api/client";
import { EmptyState } from "../components/EmptyState";
import { FloorLayout } from "../components/FloorLayout";
import { SectionHeading } from "../components/SectionHeading";
import { timeSlots } from "../data/constants";
import { reservationService, tableService } from "../services/restaurantService";
import type { Reservation, RestaurantTable } from "../types";
import { formatReservationDate } from "../utils/format";
import { reservationFormSchema, type ReservationFormValues } from "../utils/schemas";

export const ReservationPage = () => {
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [loadingTables, setLoadingTables] = useState(true);
  const [confirmation, setConfirmation] = useState<Reservation | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: {
      guests: 2,
      tableId: 0,
      reservationTime: "19:00",
      notes: "",
    },
  });

  const selectedTableId = watch("tableId");
  const selectedTable = useMemo(
    () => tables.find((table) => table.id === Number(selectedTableId)),
    [selectedTableId, tables],
  );

  useEffect(() => {
    const loadTables = async () => {
      setLoadingTables(true);
      try {
        setTables(await tableService.list());
      } catch (error) {
        toast.error(getApiError(error));
      } finally {
        setLoadingTables(false);
      }
    };

    void loadTables();
  }, []);

  const submit = async (values: ReservationFormValues) => {
    try {
      const reservation = await reservationService.create({
        ...values,
        tableId: Number(values.tableId),
        guests: Number(values.guests),
      });
      setConfirmation(reservation);
      toast.success("Reservation confirmed.");
      reset({ guests: 2, tableId: 0, reservationTime: "19:00", notes: "" });
      setTables((current) =>
        current.map((table) =>
          table.id === reservation.tableId ? { ...table, status: "RESERVED" } : table,
        ),
      );
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Reservations"
        title="Choose your table and book instantly"
        description="Select a date, time, party size, and available table. Duplicate bookings are blocked by the system."
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <form onSubmit={handleSubmit(submit)} className="card p-6 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="label">Name</label>
              <input className="field" placeholder="Your name" {...register("customerName")} />
              {errors.customerName ? <p className="error-text">{errors.customerName.message}</p> : null}
            </div>
            <div>
              <label className="label">Email</label>
              <input className="field" placeholder="you@example.com" {...register("customerEmail")} />
              {errors.customerEmail ? <p className="error-text">{errors.customerEmail.message}</p> : null}
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="field" placeholder="(555) 123-4567" {...register("customerPhone")} />
              {errors.customerPhone ? <p className="error-text">{errors.customerPhone.message}</p> : null}
            </div>
            <div>
              <label className="label">Guests</label>
              <input className="field" type="number" min={1} {...register("guests", { valueAsNumber: true })} />
              {errors.guests ? <p className="error-text">{errors.guests.message}</p> : null}
            </div>
            <div>
              <label className="label">Date</label>
              <input className="field" type="date" min={today} {...register("reservationDate")} />
              {errors.reservationDate ? <p className="error-text">{errors.reservationDate.message}</p> : null}
            </div>
            <div>
              <label className="label">Time</label>
              <select className="field" {...register("reservationTime")}>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
              {errors.reservationTime ? <p className="error-text">{errors.reservationTime.message}</p> : null}
            </div>
            <div className="sm:col-span-2">
              <label className="label">Special requests</label>
              <textarea className="field min-h-28" placeholder="Allergies, occasion, seating notes" {...register("notes")} />
            </div>
          </div>

          <input type="hidden" {...register("tableId", { valueAsNumber: true })} />
          {errors.tableId ? <p className="error-text">{errors.tableId.message}</p> : null}

          <div className="mt-6 rounded-2xl bg-neutral-50 p-4 text-sm text-neutral-600">
            {selectedTable ? (
              <span>
                Selected: <strong className="text-neutral-950">Table {selectedTable.tableNumber}</strong> seats {selectedTable.capacity}.
              </span>
            ) : (
              "Select an available table from the floor layout."
            )}
          </div>

          <button className="btn-primary mt-6 w-full py-3" disabled={isSubmitting}>
            {isSubmitting ? "Confirming..." : "Confirm Reservation"}
          </button>
        </form>

        <div>
          {loadingTables ? (
            <div className="h-[520px] animate-pulse rounded-[2rem] bg-neutral-100" />
          ) : tables.length ? (
            <FloorLayout
              tables={tables}
              selectedTableId={Number(selectedTableId)}
              onSelect={(table) => setValue("tableId", table.id, { shouldValidate: true })}
            />
          ) : (
            <EmptyState title="No tables configured" description="Please ask an admin to seed or add restaurant tables." />
          )}
        </div>
      </div>

      {confirmation ? (
        <div className="mt-8 rounded-[2rem] border border-emerald-200 bg-emerald-50 p-6">
          <div className="flex items-start gap-4">
            <FiCheckCircle className="mt-1 text-emerald-700" size={28} />
            <div>
              <h3 className="text-xl font-semibold text-emerald-950">Reservation confirmed</h3>
              <p className="mt-2 text-emerald-900">
                {confirmation.customerName}, your table is booked for {formatReservationDate(confirmation.reservationDate)} at {confirmation.reservationTime}.
              </p>
              <p className="mt-1 text-sm text-emerald-800">
                Confirmation #{confirmation.id} - Table {confirmation.table?.tableNumber ?? confirmation.tableId} - {confirmation.guests} guests
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};
