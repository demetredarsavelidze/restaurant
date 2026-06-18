import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { EmptyState } from "../components/EmptyState";
import { menuCategories, restaurantName } from "../data/constants";
import { getApiError } from "../api/client";
import { menuService } from "../services/restaurantService";
import type { MenuItem } from "../types";
import { formatCurrency } from "../utils/format";

export const QRMenuPage = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        setItems(await menuService.list());
      } catch (error) {
        toast.error(getApiError(error));
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const filteredItems = useMemo(() => {
    const normalized = search.toLowerCase().trim();
    return items.filter((item) => {
      const matchesSearch =
        !normalized ||
        item.name.toLowerCase().includes(normalized) ||
        item.description.toLowerCase().includes(normalized);
      const matchesCategory = category === "All" || item.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [category, items, search]);

  return (
    <section className="mx-auto max-w-3xl px-4 py-8">
      <div className="rounded-[2rem] bg-neutral-950 p-6 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
          QR menu
        </p>
        <h1 className="mt-3 font-serif text-4xl">{restaurantName}</h1>
        <p className="mt-3 text-sm leading-6 text-neutral-300">
          Browse the dining room menu from your table. Ask your server about allergens and daily
          specials.
        </p>
      </div>

      <div className="sticky top-[73px] z-20 -mx-4 mt-6 border-y border-neutral-200 bg-white px-4 py-4">
        <input
          className="field"
          placeholder="Search menu"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {["All", ...menuCategories].map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium ${
                category === item
                  ? "border-neutral-950 bg-neutral-950 text-white"
                  : "border-neutral-300 bg-white text-neutral-700"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-24 animate-pulse rounded-3xl bg-neutral-100" />
          ))}
        </div>
      ) : filteredItems.length ? (
        <div className="mt-6 space-y-3">
          {filteredItems.map((item) => (
            <article key={item.id} className="rounded-3xl border border-neutral-200 bg-white p-4">
              <div className="flex gap-4">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-24 w-24 shrink-0 rounded-2xl object-cover"
                  loading="lazy"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                        {item.category}
                      </p>
                      <h2 className="mt-1 font-semibold text-neutral-950">{item.name}</h2>
                    </div>
                    <p className="font-semibold text-neutral-950">{formatCurrency(item.price)}</p>
                  </div>
                  <p className="mt-2 text-sm leading-5 text-neutral-600">{item.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-6">
          <EmptyState title="No dishes found" description="Try another search or category." />
        </div>
      )}
    </section>
  );
};
