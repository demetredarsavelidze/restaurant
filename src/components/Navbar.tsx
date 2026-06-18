import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Link, NavLink } from "react-router-dom";
import { restaurantName } from "../data/constants";

const links = [
  { label: "Home", to: "/" },
  { label: "Menu", to: "/menu" },
  { label: "Reserve", to: "/reservation" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "QR Menu", to: "/qr-menu" },
];

const navClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition hover:text-neutral-950 ${
    isActive ? "text-neutral-950" : "text-neutral-500"
  }`;

export const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="font-serif text-2xl tracking-tight text-neutral-950">
          {restaurantName}
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={navClass}>
              {link.label}
            </NavLink>
          ))}
          <Link to="/admin/login" className="btn-secondary px-4 py-2 text-sm">
            Admin
          </Link>
        </div>

        <button
          className="rounded-full border border-neutral-200 p-2 md:hidden"
          aria-label="Open navigation"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-neutral-200 bg-white md:hidden"
          >
            <div className="mx-auto grid max-w-7xl gap-1 px-4 py-4">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className="rounded-xl px-3 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
              <Link
                to="/admin/login"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-xl bg-neutral-950 px-3 py-3 text-sm font-medium text-white"
              >
                Admin Login
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
};
