import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiArrowRight, FiClock, FiMapPin, FiPhone, FiStar } from "react-icons/fi";
import { Link } from "react-router-dom";
import { MenuCard } from "../components/MenuCard";
import { SectionHeading } from "../components/SectionHeading";
import {
  fallbackFeaturedDishes,
  galleryImages,
  restaurantName,
  whyChooseUs,
} from "../data/constants";
import { getApiError } from "../api/client";
import { menuService, testimonialService } from "../services/restaurantService";
import type { MenuItem, Testimonial } from "../types";

export const HomePage = () => {
  const [featured, setFeatured] = useState<MenuItem[]>(fallbackFeaturedDishes);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [menu, reviews] = await Promise.all([
          menuService.list(),
          testimonialService.list(),
        ]);
        setFeatured(menu.slice(0, 3));
        setTestimonials(reviews);
      } catch (error) {
        console.info(getApiError(error));
      }
    };

    void load();
  }, []);

  return (
    <>
      <section className="relative overflow-hidden border-b border-neutral-200 bg-neutral-50">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-24">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
              Modern seasonal restaurant
            </p>
            <h1 className="mt-5 font-serif text-5xl tracking-tight text-neutral-950 sm:text-6xl lg:text-7xl">
              {restaurantName}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-neutral-600">
              Refined comfort, seasonal cooking, and a calm room designed for memorable dinners.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/reservation" className="btn-primary px-6 py-3 text-center">
                Reserve Table
              </Link>
              <Link to="/menu" className="btn-secondary px-6 py-3 text-center">
                View Menu
              </Link>
            </div>
          </motion.div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1400&q=85"
              alt="Elegant restaurant interior"
              className="h-[420px] w-full rounded-[2rem] object-cover shadow-2xl shadow-neutral-900/10 lg:h-[560px]"
            />
            <div className="absolute bottom-5 left-5 rounded-3xl bg-white/95 p-5 shadow-xl backdrop-blur">
              <p className="text-sm font-semibold text-neutral-950">Dinner service</p>
              <p className="mt-1 text-sm text-neutral-500">Tue-Sun - 5:00 PM - 10:00 PM</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Featured dishes"
            title="A focused menu with quiet confidence"
            description="Seasonal plates, polished classics, and a few signatures from the kitchen."
          />
          <Link to="/menu" className="group flex items-center gap-2 text-sm font-semibold text-neutral-950">
            Explore full menu <FiArrowRight className="transition group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {featured.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      <section className="bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Why choose us"
            title="Hospitality with attention to detail"
            description="Every part of the experience is built to feel easy, deliberate, and personal."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseUs.map((item) => (
              <div key={item.title} className="card p-6">
                <item.icon size={28} className="text-neutral-950" />
                <h3 className="mt-5 text-lg font-semibold text-neutral-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-neutral-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading align="center" eyebrow="Guest notes" title="Trusted for special evenings" />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {(testimonials.length ? testimonials : [
            { id: 1, customerName: "Elena Morris", comment: "Elegant room, thoughtful service, and excellent food.", rating: 5 },
            { id: 2, customerName: "Marcus Lee", comment: "The reservation flow was simple and the dinner was memorable.", rating: 5 },
            { id: 3, customerName: "Priya Shah", comment: "Professional, warm, and polished from start to finish.", rating: 5 },
          ]).map((review) => (
            <article key={review.id} className="card p-6">
              <div className="flex gap-1 text-amber-500">
                {Array.from({ length: review.rating }).map((_, index) => (
                  <FiStar key={index} fill="currentColor" />
                ))}
              </div>
              <p className="mt-5 leading-7 text-neutral-700">"{review.comment}"</p>
              <p className="mt-5 font-semibold text-neutral-950">{review.customerName}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-neutral-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
              Opening hours
            </p>
            <h2 className="mt-3 font-serif text-4xl">Join us for dinner</h2>
            <div className="mt-8 grid gap-4 text-neutral-300">
              {["Tuesday - Thursday: 5:00 PM - 9:30 PM", "Friday - Saturday: 5:00 PM - 10:30 PM", "Sunday: 5:00 PM - 9:00 PM", "Monday: Closed"].map((line) => (
                <p key={line} className="flex items-center gap-3"><FiClock /> {line}</p>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
            <p className="flex items-center gap-3 text-neutral-300"><FiMapPin /> 88 Madison Avenue, New York</p>
            <p className="mt-4 flex items-center gap-3 text-neutral-300"><FiPhone /> (212) 555-0198</p>
            <Link to="/reservation" className="btn-primary mt-8 inline-block bg-white px-6 py-3 text-neutral-950 hover:bg-neutral-200">
              Make a reservation
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading align="center" eyebrow="Gallery" title="A dining room with calm energy" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {galleryImages.map((image) => (
            <img key={image} src={image} alt="Restaurant gallery" className="h-64 w-full rounded-3xl object-cover" loading="lazy" />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-neutral-100 p-8 text-center sm:p-12">
          <h2 className="font-serif text-4xl text-neutral-950">Ready for your table?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-neutral-600">
            Reserve online, browse the QR menu, or contact the host team for private dining.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/reservation" className="btn-primary px-6 py-3">Reserve now</Link>
            <Link to="/contact" className="btn-secondary px-6 py-3">Contact us</Link>
          </div>
        </div>
      </section>
    </>
  );
};
