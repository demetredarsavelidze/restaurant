import type { RestaurantTable, TableStatus } from "../types";
import { statusLabel } from "../utils/format";

type FloorLayoutProps = {
  tables: RestaurantTable[];
  selectedTableId?: number;
  onSelect?: (table: RestaurantTable) => void;
  readonly?: boolean;
};

const statusClasses: Record<TableStatus, string> = {
  AVAILABLE: "border-emerald-300 bg-emerald-50 text-emerald-900",
  RESERVED: "border-amber-300 bg-amber-50 text-amber-900",
  OCCUPIED: "border-neutral-400 bg-neutral-200 text-neutral-700",
};

export const FloorLayout = ({
  tables,
  selectedTableId,
  onSelect,
  readonly = false,
}: FloorLayoutProps) => (
  <div className="rounded-[2rem] border border-neutral-200 bg-neutral-50 p-4 sm:p-6">
    <div className="mb-5 flex items-center justify-between rounded-2xl border border-neutral-200 bg-white px-4 py-3">
      <span className="text-sm font-semibold text-neutral-700">Dining Room</span>
      <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-500">
        Entrance
      </span>
    </div>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
      {tables.map((table) => {
        const disabled = !readonly && table.status !== "AVAILABLE";
        const selected = selectedTableId === table.id;

        return (
          <button
            key={table.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect?.(table)}
            className={`min-h-28 rounded-3xl border p-3 text-left transition ${
              statusClasses[table.status]
            } ${selected ? "ring-2 ring-neutral-950 ring-offset-2" : ""} ${
              disabled ? "cursor-not-allowed opacity-70" : "hover:-translate-y-0.5 hover:shadow-sm"
            }`}
          >
            <span className="text-xs font-medium uppercase tracking-[0.16em]">
              {statusLabel(table.status)}
            </span>
            <span className="mt-5 block text-2xl font-semibold">Table {table.tableNumber}</span>
            <span className="mt-2 block text-sm">Seats {table.capacity}</span>
          </button>
        );
      })}
    </div>
    <div className="mt-5 flex flex-wrap gap-3 text-xs text-neutral-600">
      {Object.entries(statusClasses).map(([status, classes]) => (
        <span key={status} className="flex items-center gap-2">
          <span className={`h-3 w-3 rounded-full border ${classes}`} />
          {statusLabel(status)}
        </span>
      ))}
    </div>
  </div>
);
