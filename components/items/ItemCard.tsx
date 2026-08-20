"use client";

import Link from "next/link";
import { Item } from "@/types";
import { formatRupiah, formatKaffaAge } from "@/lib/utils";
import { Star, ShieldCheck, Sparkles, Tag } from "lucide-react";

interface ItemCardProps {
  item: Item;
  index?: number;
}

export function ItemCard({ item, index = 0 }: ItemCardProps) {
  // Alternate photo tilt for scrapbook polaroid effect
  const tiltClass =
    index % 2 === 0 ? "scrapbook-photo-tilt-1" : "scrapbook-photo-tilt-2";

  const statusColors: Record<Item["status"], string> = {
    active: "bg-success-subtle text-success border-success/30",
    outgrown: "bg-warning-subtle text-warning border-warning/30",
    donated: "bg-surface-raised text-foreground-muted border-border",
    lost: "bg-danger-subtle text-danger border-danger/30",
  };

  const statusLabels: Record<Item["status"], string> = {
    active: "Sedang Dipakai",
    outgrown: "Kekecilan / Lulus",
    donated: "Didonasikan",
    lost: "Hilang / Rusak",
  };

  return (
    <Link
      href={`/catalog/${item.id}`}
      className="group block rounded-2xl bg-surface border border-border p-4 scrapbook-card transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
    >
      <div>
        {/* Photo Container styled like a Scrapbook Polaroid */}
        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-surface-raised mb-4 border border-border">
          {item.photos && item.photos.length > 0 ? (
            // eslint-disable-next-next/no-img-element
            <img
              src={item.photos[0]}
              alt={item.name}
              className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${tiltClass}`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-foreground-subtle">
              Foto Barang
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-2.5 left-2.5">
            <span
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium border shadow-xs backdrop-blur-md ${
                statusColors[item.status]
              }`}
            >
              {statusLabels[item.status]}
            </span>
          </div>

          {/* Kaffa Approved Badge */}
          {item.kaffa_approved && (
            <div className="absolute top-2.5 right-2.5 bg-success-subtle/90 text-success border border-success/30 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 backdrop-blur-md shadow-xs">
              <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400" />
              <span>Kaffa Approved</span>
            </div>
          )}
        </div>

        {/* Brand & Category */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-xs font-mono font-medium text-primary uppercase tracking-wider">
            {item.brand}
          </span>
          <span className="text-[11px] text-foreground-muted bg-surface-raised px-2 py-0.5 rounded-md border border-border">
            {item.category_name}
          </span>
        </div>

        {/* Item Title */}
        <h3 className="font-display font-bold text-base text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-1 mb-2">
          {item.name}
        </h3>

        {/* Description snippet */}
        <p className="text-xs text-foreground-muted line-clamp-2 leading-relaxed mb-3">
          {item.description}
        </p>
      </div>

      <div>
        {/* Age & Tags */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3 text-[11px] text-foreground-subtle font-mono">
          <span className="bg-primary-subtle text-primary px-2 py-0.5 rounded-md font-semibold">
            Usia {formatKaffaAge(item.kaffa_age_months)}
          </span>
          {item.tags.slice(0, 2).map((t) => (
            <span key={t} className="flex items-center gap-0.5 text-foreground-muted">
              <Tag className="w-3 h-3" />#{t}
            </span>
          ))}
        </div>

        {/* Footer info: Rating & Price */}
        <div className="pt-3 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-lg text-xs font-bold font-mono">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>{item.average_rating ? item.average_rating.toFixed(1) : "N/A"}</span>
            </div>
            <span className="text-[11px] text-foreground-muted">
              ({item.total_reviews || 0} review)
            </span>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold font-mono text-foreground">
              {item.acquired_price ? formatRupiah(item.acquired_price) : "Hadiah/Warisan"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
