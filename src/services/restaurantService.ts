import { api } from "../api/client";
import type {
  DashboardStats,
  LoginResponse,
  MenuItem,
  Reservation,
  RestaurantTable,
  Testimonial,
} from "../types";

export type MenuPayload = Omit<MenuItem, "id" | "createdAt" | "updatedAt">;

export type ReservationPayload = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  reservationDate: string;
  reservationTime: string;
  guests: number;
  notes?: string;
  tableId: number;
};

export const authService = {
  login: async (email: string, password: string) => {
    const { data } = await api.post<LoginResponse>("/auth/login", { email, password });
    return data;
  },
};

export const menuService = {
  list: async (params?: { search?: string; category?: string; sort?: string }) => {
    const { data } = await api.get<MenuItem[]>("/menu", { params });
    return data;
  },
  create: async (payload: MenuPayload) => {
    const { data } = await api.post<MenuItem>("/menu", payload);
    return data;
  },
  update: async (id: number, payload: MenuPayload) => {
    const { data } = await api.put<MenuItem>(`/menu/${id}`, payload);
    return data;
  },
  remove: async (id: number) => {
    await api.delete(`/menu/${id}`);
  },
};

export const tableService = {
  list: async () => {
    const { data } = await api.get<RestaurantTable[]>("/tables");
    return data;
  },
  update: async (id: number, payload: Partial<Pick<RestaurantTable, "capacity" | "status">>) => {
    const { data } = await api.put<RestaurantTable>(`/tables/${id}`, payload);
    return data;
  },
};

export const reservationService = {
  list: async (params?: { search?: string; date?: string; tableId?: string }) => {
    const { data } = await api.get<Reservation[]>("/reservations", { params });
    return data;
  },
  create: async (payload: ReservationPayload) => {
    const { data } = await api.post<Reservation>("/reservations", payload);
    return data;
  },
  update: async (id: number, payload: Partial<ReservationPayload>) => {
    const { data } = await api.put<Reservation>(`/reservations/${id}`, payload);
    return data;
  },
  remove: async (id: number) => {
    await api.delete(`/reservations/${id}`);
  },
  stats: async () => {
    const { data } = await api.get<DashboardStats>("/reservations/stats/dashboard");
    return data;
  },
};

export const testimonialService = {
  list: async () => {
    const { data } = await api.get<Testimonial[]>("/testimonials");
    return data;
  },
};
