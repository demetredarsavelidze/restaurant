import { FiLogOut } from "react-icons/fi";
import { Link, Outlet, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { restaurantName } from "../data/constants";
import { useAuth } from "../hooks/useAuth";

export const AdminLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out.");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="font-serif text-2xl text-neutral-950">
            {restaurantName}
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-neutral-500 sm:inline">{user?.email}</span>
            <button onClick={handleLogout} className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm">
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </header>
      <Outlet />
    </div>
  );
};
