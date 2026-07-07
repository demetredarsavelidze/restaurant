export type Role = "ADMIN";

export type TableStatus = "AVAILABLE" | "RESERVED" | "OCCUPIED";

export type DbUser = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
};

export type DbMenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
};

export type DbRestaurantTable = {
  id: number;
  tableNumber: number;
  capacity: number;
  status: TableStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type DbReservation = {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  reservationDate: Date;
  reservationTime: string;
  guests: number;
  notes: string | null;
  tableId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type ReservationWithTable = DbReservation & {
  table: DbRestaurantTable;
};

export type DbTestimonial = {
  id: number;
  customerName: string;
  comment: string;
  rating: number;
  createdAt: Date;
};
