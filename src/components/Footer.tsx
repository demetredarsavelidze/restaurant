import { FiInstagram, FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { Link } from "react-router-dom";
import { restaurantName } from "../data/constants";

export const Footer = () => (
  <footer className="border-t border-neutral-200 bg-neutral-950 text-white">
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
      <div>
        <p className="font-serif text-3xl">{restaurantName}</p>
        <p className="mt-4 max-w-md text-sm leading-6 text-neutral-300">
          Modern seasonal dining with precise reservations, a refined dining room, and a menu
          designed for memorable evenings.
        </p>
      </div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Visit</p>
        <div className="mt-4 space-y-3 text-sm text-neutral-300">
          <p className="flex gap-3"><FiMapPin className="mt-1" /> 88 Madison Avenue, New York</p>
          <p className="flex gap-3"><FiPhone className="mt-1" /> (212) 555-0198</p>
          <p className="flex gap-3"><FiMail className="mt-1" /> reservations@auroratable.com</p>
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Explore</p>
        <div className="mt-4 grid gap-3 text-sm text-neutral-300">
          <Link to="/menu">Menu</Link>
          <Link to="/reservation">Reservations</Link>
          <Link to="/qr-codes">QR Codes</Link>
          <span className="flex items-center gap-2"><FiInstagram /> @auroratable</span>
        </div>
      </div>
    </div>
    <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-neutral-500">
      Copyright {new Date().getFullYear()} {restaurantName}. All rights reserved.
    </div>
  </footer>
);
