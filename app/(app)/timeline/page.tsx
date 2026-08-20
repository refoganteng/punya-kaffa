"use client";

import * as React from "react";
import { MOCK_ITEMS } from "@/lib/mock-data";
import { ItemCard } from "@/components/items/ItemCard";
import { formatKaffaAge } from "@/lib/utils";
import { Clock, Calendar, Sparkles, SlidersHorizontal } from "lucide-react";

export default function TimelinePage() {
  const [selectedAgeMonth, setSelectedAgeMonth] = React.useState<number>(12); // default max 12 months

  const filteredItems = MOCK_ITEMS.filter(
    (item) => item.kaffa_age_months <= selectedAgeMonth
  ).sort((a, b) => a.kaffa_age_months - b.kaffa_age_months);

  const presets = [
    { label: "Newborn (0-3 Bln)", months: 3 },
    { label: "MPASI (6 Bln)", months: 6 },
    { label: "1 Tahun", months: 12 },
    { label: "2 Tahun ke atas", months: 24 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground flex items-center gap-2">
          <Clock className="w-7 h-7 text-primary" />
          <span>Timeline Usia Kaffa</span>
        </h1>
        <p className="text-xs md:text-sm text-foreground-muted mt-1">
          Nostalgia perkembangan barang Kaffa berdasarkan usia tumbuh kembang (bulan ke bulan)
        </p>
      </div>

      {/* Age Range Slider Box */}
      <div className="p-6 rounded-3xl bg-surface border border-border space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">
              Filter Barang Hingga Usia:
            </span>
          </div>

          <div className="px-4 py-1.5 rounded-full bg-primary-subtle text-primary font-mono font-bold text-sm border border-primary/20">
            {formatKaffaAge(selectedAgeMonth)}
          </div>
        </div>

        {/* Age Range Input */}
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="24"
            step="1"
            value={selectedAgeMonth}
            onChange={(e) => setSelectedAgeMonth(Number(e.target.value))}
            className="w-full accent-primary h-2 rounded-lg bg-surface-raised cursor-pointer"
          />
          <div className="flex justify-between text-[11px] font-mono text-foreground-subtle">
            <span>0 Bulan (Lahir)</span>
            <span>6 Bulan</span>
            <span>12 Bulan (1 Thn)</span>
            <span>18 Bulan</span>
            <span>24+ Bulan</span>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
          <span className="text-xs text-foreground-muted font-medium">Quick Preset:</span>
          {presets.map((p) => (
            <button
              key={p.months}
              type="button"
              onClick={() => setSelectedAgeMonth(p.months)}
              className={`px-3 py-1 rounded-xl text-xs font-medium border transition-all ${
                selectedAgeMonth === p.months
                  ? "bg-primary text-primary-foreground border-primary font-semibold"
                  : "bg-background text-foreground-muted border-border hover:bg-surface-raised"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-foreground-muted">
        <span>
          Menampilkan <strong>{filteredItems.length}</strong> barang dari usia 0 s.d{" "}
          {formatKaffaAge(selectedAgeMonth)}
        </span>
      </div>

      {/* Timeline Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map((item, idx) => (
            <ItemCard key={item.id} item={item} index={idx} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center bg-surface rounded-3xl border border-border p-6 text-foreground-muted text-xs">
          Belum ada barang tercatat di bawah usia {formatKaffaAge(selectedAgeMonth)}.
        </div>
      )}
    </div>
  );
}
