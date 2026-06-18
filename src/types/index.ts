export type TableStatus = "AVAILABLE" | "RESERVED" | "OCCUPIED";

export type User = {
  id: number;
  name: string;
  email: string;
  role: "ADMIN";
};

export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number | string;
  category: string;
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
};

export type RestaurantTable = {
  id: number;
  tableNumber: number;
  capacity: number;
  status: TableStatus;
};

export type Reservation = {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  reservationDate: string;
  reservationTime: string;
  guests: number;
  notes?: string | null;
  tableId: number;
  table?: RestaurantTable;
  createdAt?: string;
};

export type Testimonial = {
  id: number;
  customerName: string;
  comment: string;
  rating: number;
};

export type DashboardStats = {
  totalReservations: number;
  todaysReservations: number;
  occupiedTables: number;
  availableTables: number;
  totalMenuItems: number;
};

export type LoginResponse = {
  token: string;
  user: User;
};
