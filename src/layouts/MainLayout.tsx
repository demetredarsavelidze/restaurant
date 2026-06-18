import { Outlet } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { ScrollToTop } from "../components/ScrollToTop";

export const MainLayout = () => (
  <div className="min-h-screen bg-white text-neutral-900">
    <Navbar />
    <main>
      <Outlet />
    </main>
    <Footer />
    <ScrollToTop />
  </div>
);
