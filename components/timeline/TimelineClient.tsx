"use client";

import * as React from "react";
import { Item } from "@/types";
import { ItemCard } from "@/components/items/ItemCard";
import { formatKaffaAge } from "@/lib/utils";
import { Clock, Sparkles } from "lucide-react";

interface TimelineClientProps {
  items: Item[];
}

export function TimelineClient({ items }: TimelineClientProps) {
  const [selectedAge, setSelectedAge] = React.useState<number>(24);

  // Group items by age in months
  const filteredItems = items.filter(
    (item) => item.kaffa_age_months <= selectedAge
  );

  const ageGroups: { [age: number]: Item[] } = {};
  filteredItems.forEach((item) => {
    const age = item.kaffa_age_months;
    if (!ageGroups[age]) ageGroups[age] = [];
    ageGroups[age].push(item);
  });

  const sortedAges = Object.keys(ageGroups)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-border pb-4">
        <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">
          Timeline Kenangan & Pertumbuhan
        </h1>
        <p className="text-xs md:text-sm text-foreground-muted mt-1">
          Kilas balik barang-barang Kaffa sesuai tahap usia (0 - 24+ bulan)
        </p>
      </div>

      {/* Age Range Slider Control */}
      <div className="p-6 rounded-3xl bg-surface border border-border space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <span className="font-semibold text-sm text-foreground">
              Filter Usia Kaffa:
            </span>
          </div>
          <span className="px-3 py-1 rounded-xl bg-primary-subtle text-primary font-mono font-bold text-sm">
            Hingga {formatKaffaAge(selectedAge)}
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="24"
          step="1"
          value={selectedAge}
          onChange={(e) => setSelectedAge(Number(e.target.value))}
          className="w-full accent-primary cursor-pointer"
        />

        <div className="flex justify-between text-[11px] font-mono text-foreground-muted">
          <span>0 Bulan (Lahir)</span>
          <span>6 Bulan</span>
          <span>12 Bulan (1 Thn)</span>
          <span>18 Bulan</span>
          <span>24+ Bulan (2 Thn)</span>
        </div>
      </div>

      {/* Timeline Stream */}
      {sortedAges.length > 0 ? (
        <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 md:before:left-1/2 before:w-0.5 before:bg-border before:-z-0">
          {sortedAges.map((age) => (
            <div key={age} className="relative z-10 space-y-4">
              {/* Age Milestone Badge */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-mono font-bold text-xs flex items-center justify-center shadow-xs">
                  {age}m
                </div>
                <div className="bg-surface px-3.5 py-1 rounded-xl border border-border text-xs font-semibold text-foreground flex items-center gap-1.5 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span>Usia {formatKaffaAge(age)}</span>
                  <span className="text-foreground-muted font-mono">
                    ({ageGroups[age].length} barang)
                  </span>
                </div>
              </div>

              {/* Items in this age group */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pl-6 md:pl-0">
                {ageGroups[age].map((item, idx) => (
                  <ItemCard key={item.id} item={item} index={idx} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-surface rounded-3xl border border-border text-xs text-foreground-muted">
          Tidak ada barang pada rentang usia ini. Geser slider ke kanan untuk melihat lebih banyak.
        </div>
      )}
    </div>
  );
}
