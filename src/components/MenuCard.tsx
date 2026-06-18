import type { MenuItem } from "../types";
import { formatCurrency } from "../utils/format";

type MenuCardProps = {
  item: MenuItem;
  compact?: boolean;
};

export const MenuCard = ({ item, compact = false }: MenuCardProps) => (
  <article className="card overflow-hidden">
    <img
      src={item.imageUrl}
      alt={item.name}
      className={compact ? "h-36 w-full object-cover" : "h-52 w-full object-cover"}
      loading="lazy"
    />
    <div className={compact ? "p-4" : "p-5"}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
            {item.category}
          </p>
          <h3 className="mt-2 text-lg font-semibold text-neutral-950">{item.name}</h3>
        </div>
        <p className="font-semibold text-neutral-950">{formatCurrency(item.price)}</p>
      </div>
      <p className="mt-3 text-sm leading-6 text-neutral-600">{item.description}</p>
    </div>
  </article>
);
