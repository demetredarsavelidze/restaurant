import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { EmptyState } from "../components/EmptyState";
import { MenuCard } from "../components/MenuCard";
import { SectionHeading } from "../components/SectionHeading";
import { SkeletonCard } from "../components/SkeletonCard";
import { getApiError } from "../api/client";
import { menuCategories } from "../data/constants";
import { menuService } from "../services/restaurantService";
import type { MenuItem } from "../types";

export const MenuPage = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await menuService.list();
        setItems(data);
      } catch (error) {
        toast.error(getApiError(error));
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const result = items.filter((item) => {
      const matchesSearch =
        !normalizedSearch ||
        item.name.toLowerCase().includes(normalizedSearch) ||
        item.description.toLowerCase().includes(normalizedSearch);
      const matchesCategory = category === "All" || item.category === category;
      return matchesSearch && matchesCategory;
    });

    if (sort === "price-asc") {
      return [...result].sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (sort === "price-desc") {
      return [...result].sort((a, b) => Number(b.price) - Number(a.price));
    }

    return result;
  }, [category, items, search, sort]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Menu"
        title="Seasonal dishes across classic categories"
        description="Browse signatures and dining room staples. Use filters to find the right plate."
      />

      <div className="mt-8 grid gap-4 rounded-[2rem] border border-neutral-200 bg-neutral-50 p-4 md:grid-cols-[1fr_220px_220px]">
        <input
          className="field"
          placeholder="Search dishes"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select className="field" value={category} onChange={(event) => setCategory(event.target.value)}>
          <option>All</option>
          {menuCategories.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select className="field" value={sort} onChange={(event) => setSort(event.target.value)}>
          <option value="featured">Featured order</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {["All", ...menuCategories].map((item) => (
          <button
            key={item}
            onClick={() => setCategory(item)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              category === item
                ? "border-neutral-950 bg-neutral-950 text-white"
                : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-950"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : filteredItems.length ? (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="mt-10">
          <EmptyState
            title="No menu items found"
            description="Try adjusting your search or category filter."
          />
        </div>
      )}
    </section>
  );
};
