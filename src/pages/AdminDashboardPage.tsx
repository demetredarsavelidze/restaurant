import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiCalendar, FiCheckCircle, FiCoffee, FiEdit2, FiPlus, FiTrash2, FiUsers } from "react-icons/fi";
import { getApiError } from "../api/client";
import { EmptyState } from "../components/EmptyState";
import { FloorLayout } from "../components/FloorLayout";
import { menuCategories } from "../data/constants";
import {
  menuService,
  reservationService,
  tableService,
  type MenuPayload,
} from "../services/restaurantService";
import type { DashboardStats, MenuItem, Reservation, RestaurantTable, TableStatus } from "../types";
import { formatCurrency, formatReservationDate, statusLabel } from "../utils/format";
import { menuFormSchema, type MenuFormValues } from "../utils/schemas";

type Tab = "reservations" | "tables" | "menu";

const statMeta = [
  ["Total Reservations", "totalReservations", FiCalendar],
  ["Today's Reservations", "todaysReservations", FiUsers],
  ["Occupied Tables", "occupiedTables", FiCheckCircle],
  ["Available Tables", "availableTables", FiCheckCircle],
  ["Total Menu Items", "totalMenuItems", FiCoffee],
] as const;

export const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("reservations");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [reservationSearch, setReservationSearch] = useState("");
  const [reservationDate, setReservationDate] = useState("");
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MenuFormValues>({
    resolver: zodResolver(menuFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "Starters",
      imageUrl: "",
    },
  });

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [statsData, reservationsData, tablesData, menuData] = await Promise.all([
        reservationService.stats(),
        reservationService.list(),
        tableService.list(),
        menuService.list(),
      ]);

      setStats(statsData);
      setReservations(reservationsData);
      setTables(tablesData);
      setMenuItems(menuData);
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
  }, []);

  const filteredReservations = useMemo(() => {
    const search = reservationSearch.toLowerCase().trim();
    return reservations.filter((reservation) => {
      const matchesSearch =
        !search ||
        reservation.customerName.toLowerCase().includes(search) ||
        reservation.customerEmail.toLowerCase().includes(search) ||
        reservation.customerPhone.toLowerCase().includes(search);
      const matchesDate =
        !reservationDate || reservation.reservationDate.slice(0, 10) === reservationDate;
      return matchesSearch && matchesDate;
    });
  }, [reservationDate, reservationSearch, reservations]);

  const submitMenu = async (values: MenuFormValues) => {
    const payload: MenuPayload = {
      ...values,
      price: Number(values.price),
    };

    try {
      if (editingMenuItem) {
        const updated = await menuService.update(editingMenuItem.id, payload);
        setMenuItems((current) => current.map((item) => (item.id === updated.id ? updated : item)));
        toast.success("Menu item updated.");
      } else {
        const created = await menuService.create(payload);
        setMenuItems((current) => [created, ...current]);
        toast.success("Menu item created.");
      }

      setEditingMenuItem(null);
      reset({ name: "", description: "", price: 0, category: "Starters", imageUrl: "" });
      setStats(await reservationService.stats());
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  const editMenu = (item: MenuItem) => {
    setEditingMenuItem(item);
    reset({
      name: item.name,
      description: item.description,
      price: Number(item.price),
      category: item.category,
      imageUrl: item.imageUrl,
    });
  };

  const deleteMenu = async (id: number) => {
    if (!window.confirm("Delete this menu item?")) return;

    try {
      await menuService.remove(id);
      setMenuItems((current) => current.filter((item) => item.id !== id));
      toast.success("Menu item deleted.");
      setStats(await reservationService.stats());
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  const cancelReservation = async (id: number) => {
    if (!window.confirm("Cancel this reservation?")) return;

    try {
      await reservationService.remove(id);
      setReservations((current) => current.filter((reservation) => reservation.id !== id));
      const [nextStats, nextTables] = await Promise.all([
        reservationService.stats(),
        tableService.list(),
      ]);
      setStats(nextStats);
      setTables(nextTables);
      toast.success("Reservation cancelled.");
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  const saveReservation = async () => {
    if (!editingReservation) return;

    try {
      const updated = await reservationService.update(editingReservation.id, {
        customerName: editingReservation.customerName,
        customerEmail: editingReservation.customerEmail,
        customerPhone: editingReservation.customerPhone,
        reservationDate: editingReservation.reservationDate.slice(0, 10),
        reservationTime: editingReservation.reservationTime,
        guests: editingReservation.guests,
        notes: editingReservation.notes ?? "",
        tableId: editingReservation.tableId,
      });
      setReservations((current) =>
        current.map((reservation) => (reservation.id === updated.id ? updated : reservation)),
      );
      setEditingReservation(null);
      toast.success("Reservation updated.");
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  const updateTableStatus = async (table: RestaurantTable, status: TableStatus) => {
    try {
      const updated = await tableService.update(table.id, { status });
      setTables((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      setStats(await reservationService.stats());
      toast.success(`Table ${table.tableNumber} marked ${statusLabel(status)}.`);
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
            Admin
          </p>
          <h1 className="mt-2 font-serif text-4xl text-neutral-950">Restaurant Dashboard</h1>
        </div>
        <button onClick={() => void loadDashboard()} className="btn-secondary px-5 py-3 text-sm">
          Refresh data
        </button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statMeta.map(([label, key, Icon]) => (
          <article key={key} className="card p-5">
            <Icon className="text-neutral-500" size={22} />
            <p className="mt-4 text-3xl font-semibold text-neutral-950">
              {loading ? "-" : stats?.[key] ?? 0}
            </p>
            <p className="mt-1 text-sm text-neutral-500">{label}</p>
          </article>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {[
          ["reservations", "Reservations"],
          ["tables", "Tables"],
          ["menu", "Menu"],
        ].map(([tab, label]) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as Tab)}
            className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
              activeTab === tab
                ? "bg-neutral-950 text-white"
                : "border border-neutral-300 bg-white text-neutral-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === "reservations" ? (
        <section className="mt-6 card p-5 sm:p-6">
          <div className="grid gap-4 md:grid-cols-[1fr_220px]">
            <input
              className="field"
              placeholder="Search reservations"
              value={reservationSearch}
              onChange={(event) => setReservationSearch(event.target.value)}
            />
            <input
              className="field"
              type="date"
              value={reservationDate}
              onChange={(event) => setReservationDate(event.target.value)}
            />
          </div>

          {filteredReservations.length ? (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="text-xs uppercase tracking-[0.16em] text-neutral-500">
                  <tr>
                    <th className="border-b border-neutral-200 py-3">Guest</th>
                    <th className="border-b border-neutral-200 py-3">Date</th>
                    <th className="border-b border-neutral-200 py-3">Time</th>
                    <th className="border-b border-neutral-200 py-3">Guests</th>
                    <th className="border-b border-neutral-200 py-3">Table</th>
                    <th className="border-b border-neutral-200 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReservations.map((reservation) => (
                    <tr key={reservation.id} className="border-b border-neutral-100">
                      <td className="py-4">
                        <p className="font-semibold text-neutral-950">{reservation.customerName}</p>
                        <p className="text-neutral-500">{reservation.customerEmail}</p>
                        <p className="text-neutral-500">{reservation.customerPhone}</p>
                      </td>
                      <td className="py-4">{formatReservationDate(reservation.reservationDate)}</td>
                      <td className="py-4">{reservation.reservationTime}</td>
                      <td className="py-4">{reservation.guests}</td>
                      <td className="py-4">Table {reservation.table?.tableNumber ?? reservation.tableId}</td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <button onClick={() => setEditingReservation(reservation)} className="btn-secondary px-3 py-2">
                            <FiEdit2 />
                          </button>
                          <button onClick={() => void cancelReservation(reservation.id)} className="rounded-full border border-red-200 px-3 py-2 text-red-700 hover:bg-red-50">
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-6">
              <EmptyState title="No reservations found" description="Adjust the search or date filter." />
            </div>
          )}
        </section>
      ) : null}

      {editingReservation ? (
        <section className="mt-6 card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-neutral-950">Edit reservation</h2>
            <button onClick={() => setEditingReservation(null)} className="text-sm font-semibold text-neutral-500">
              Cancel
            </button>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-4">
            <input className="field" value={editingReservation.customerName} onChange={(event) => setEditingReservation({ ...editingReservation, customerName: event.target.value })} />
            <input className="field" value={editingReservation.customerEmail} onChange={(event) => setEditingReservation({ ...editingReservation, customerEmail: event.target.value })} />
            <input className="field" value={editingReservation.customerPhone} onChange={(event) => setEditingReservation({ ...editingReservation, customerPhone: event.target.value })} />
            <input className="field" type="number" min={1} value={editingReservation.guests} onChange={(event) => setEditingReservation({ ...editingReservation, guests: Number(event.target.value) })} />
            <input className="field" type="date" value={editingReservation.reservationDate.slice(0, 10)} onChange={(event) => setEditingReservation({ ...editingReservation, reservationDate: event.target.value })} />
            <input className="field" value={editingReservation.reservationTime} onChange={(event) => setEditingReservation({ ...editingReservation, reservationTime: event.target.value })} />
            <select className="field" value={editingReservation.tableId} onChange={(event) => setEditingReservation({ ...editingReservation, tableId: Number(event.target.value) })}>
              {tables.map((table) => (
                <option key={table.id} value={table.id}>Table {table.tableNumber} ({table.capacity})</option>
              ))}
            </select>
            <button onClick={() => void saveReservation()} className="btn-primary py-3">
              Save reservation
            </button>
          </div>
        </section>
      ) : null}

      {activeTab === "tables" ? (
        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <FloorLayout tables={tables} readonly />
          <div className="card p-5 sm:p-6">
            <h2 className="text-xl font-semibold text-neutral-950">Table management</h2>
            <div className="mt-5 max-h-[640px] space-y-3 overflow-auto pr-1">
              {tables.map((table) => (
                <div key={table.id} className="rounded-2xl border border-neutral-200 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-neutral-950">Table {table.tableNumber}</p>
                      <p className="text-sm text-neutral-500">Seats {table.capacity} - {statusLabel(table.status)}</p>
                    </div>
                    <select
                      className="field max-w-40"
                      value={table.status}
                      onChange={(event) => void updateTableStatus(table, event.target.value as TableStatus)}
                    >
                      <option value="AVAILABLE">Available</option>
                      <option value="RESERVED">Reserved</option>
                      <option value="OCCUPIED">Occupied</option>
                    </select>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => void updateTableStatus(table, "OCCUPIED")} className="btn-secondary px-3 py-2 text-xs">
                      Mark occupied
                    </button>
                    <button onClick={() => void updateTableStatus(table, "AVAILABLE")} className="btn-secondary px-3 py-2 text-xs">
                      Mark available
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === "menu" ? (
        <section className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <form onSubmit={handleSubmit(submitMenu)} className="card p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <FiPlus />
              <h2 className="text-xl font-semibold text-neutral-950">
                {editingMenuItem ? "Edit menu item" : "Create menu item"}
              </h2>
            </div>
            <div className="mt-5 space-y-4">
              <div>
                <label className="label">Name</label>
                <input className="field" {...register("name")} />
                {errors.name ? <p className="error-text">{errors.name.message}</p> : null}
              </div>
              <div>
                <label className="label">Description</label>
                <textarea className="field min-h-28" {...register("description")} />
                {errors.description ? <p className="error-text">{errors.description.message}</p> : null}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Price</label>
                  <input className="field" type="number" step="0.01" {...register("price", { valueAsNumber: true })} />
                  {errors.price ? <p className="error-text">{errors.price.message}</p> : null}
                </div>
                <div>
                  <label className="label">Category</label>
                  <select className="field" {...register("category")}>
                    {menuCategories.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Image URL</label>
                <input className="field" {...register("imageUrl")} />
                {errors.imageUrl ? <p className="error-text">{errors.imageUrl.message}</p> : null}
              </div>
            </div>
            <button className="btn-primary mt-6 w-full py-3" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : editingMenuItem ? "Update menu item" : "Create menu item"}
            </button>
            {editingMenuItem ? (
              <button
                type="button"
                className="mt-3 w-full text-sm font-semibold text-neutral-500"
                onClick={() => {
                  setEditingMenuItem(null);
                  reset({ name: "", description: "", price: 0, category: "Starters", imageUrl: "" });
                }}
              >
                Cancel editing
              </button>
            ) : null}
          </form>

          <div className="card p-5 sm:p-6">
            <h2 className="text-xl font-semibold text-neutral-950">Menu items</h2>
            <div className="mt-5 max-h-[760px] space-y-3 overflow-auto pr-1">
              {menuItems.map((item) => (
                <article key={item.id} className="grid gap-4 rounded-2xl border border-neutral-200 p-4 sm:grid-cols-[96px_1fr_auto]">
                  <img src={item.imageUrl} alt={item.name} className="h-24 w-24 rounded-2xl object-cover" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">{item.category}</p>
                    <h3 className="mt-1 font-semibold text-neutral-950">{item.name}</h3>
                    <p className="mt-1 text-sm text-neutral-600">{item.description}</p>
                    <p className="mt-2 font-semibold text-neutral-950">{formatCurrency(item.price)}</p>
                  </div>
                  <div className="flex gap-2 sm:flex-col">
                    <button onClick={() => editMenu(item)} className="btn-secondary px-3 py-2">
                      <FiEdit2 />
                    </button>
                    <button onClick={() => void deleteMenu(item.id)} className="rounded-full border border-red-200 px-3 py-2 text-red-700 hover:bg-red-50">
                      <FiTrash2 />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
};
