"use client";

import { Category, AcquisitionType, ItemStatus } from "@/types";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { Search, Filter, Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ItemFiltersProps {
  categories?: Category[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (catId: string) => void;
  selectedStatus: string;
  onStatusChange: (st: string) => void;
  selectedAcquisition: string;
  onAcquisitionChange: (ac: string) => void;
}

export function ItemFilters({
  categories = [],
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  selectedAcquisition,
  onAcquisitionChange,
}: ItemFiltersProps) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-4 space-y-4 mb-6 shadow-xs">
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-subtle" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari barang berdasarkan nama, merek, deskripsi, atau tag..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-ring text-sm text-foreground placeholder:text-foreground-subtle transition-all"
        />
      </div>

      {/* Category Pills (Wrap) */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onCategoryChange("all")}
          className={cn(
            "px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 border cursor-pointer",
            selectedCategory === "all"
              ? "bg-primary text-primary-foreground border-primary font-semibold shadow-xs"
              : "bg-background text-foreground-muted hover:text-foreground border-border hover:bg-surface-raised"
          )}
        >
          <span>Semua Kategori</span>
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onCategoryChange(cat.id)}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 border cursor-pointer",
              selectedCategory === cat.id
                ? "bg-primary text-primary-foreground border-primary font-semibold shadow-xs"
                : "bg-background text-foreground-muted hover:text-foreground border-border hover:bg-surface-raised"
            )}
          >
            <CategoryIcon slug={cat.slug} name={cat.name} className="w-3.5 h-3.5" />
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Secondary Filter Dropdowns */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-foreground-muted font-medium">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="bg-background border border-border text-foreground rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="all">Semua Status</option>
              <option value="active">Sedang Dipakai</option>
              <option value="outgrown">Kekecilan / Lulus</option>
              <option value="donated">Didonasikan</option>
              <option value="lost">Hilang / Rusak</option>
            </select>
          </div>

          {/* Acquisition Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-foreground-muted font-medium">Asal Barang:</span>
            <select
              value={selectedAcquisition}
              onChange={(e) => onAcquisitionChange(e.target.value)}
              className="bg-background border border-border text-foreground rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="all">Semua</option>
              <option value="bought">Dibeli Sendiri</option>
              <option value="gift">Hadiah / Kado</option>
              <option value="hand_me_down">Warisan / Preloved</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
