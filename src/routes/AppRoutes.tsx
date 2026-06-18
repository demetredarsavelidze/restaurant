import { Navigate, Route, Routes } from "react-router-dom";
import { AdminLayout } from "../layouts/AdminLayout";
import { MainLayout } from "../layouts/MainLayout";
import { AboutPage } from "../pages/AboutPage";
import { AdminDashboardPage } from "../pages/AdminDashboardPage";
import { AdminLoginPage } from "../pages/AdminLoginPage";
import { ContactPage } from "../pages/ContactPage";
import { HomePage } from "../pages/HomePage";
import { MenuPage } from "../pages/MenuPage";
import { QRCodesPage } from "../pages/QRCodesPage";
import { QRMenuPage } from "../pages/QRMenuPage";
import { ReservationPage } from "../pages/ReservationPage";
import { ProtectedRoute } from "./ProtectedRoute";

export const AppRoutes = () => (
  <Routes>
    <Route element={<MainLayout />}>
      <Route index element={<HomePage />} />
      <Route path="menu" element={<MenuPage />} />
      <Route path="reservation" element={<ReservationPage />} />
      <Route path="about" element={<AboutPage />} />
      <Route path="contact" element={<ContactPage />} />
      <Route path="qr-menu" element={<QRMenuPage />} />
      <Route path="qr-codes" element={<QRCodesPage />} />
    </Route>

    <Route path="/admin/login" element={<AdminLoginPage />} />
    <Route element={<ProtectedRoute />}>
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
      </Route>
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);
