"use client";

import * as React from "react";
import { MOCK_WISHLIST } from "@/lib/mock-data";
import { WishlistItem } from "@/types";
import { formatRupiah } from "@/lib/utils";
import { Heart, Plus, ExternalLink, CheckCircle, Trash2, ArrowRight } from "lucide-react";

export default function WishlistPage() {
  const [items, setItems] = React.useState<WishlistItem[]>(MOCK_WISHLIST);
  const [name, setName] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [priority, setPriority] = React.useState<"low" | "medium" | "high">("medium");

  const handleAddWishlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newItem: WishlistItem = {
      id: `wish-${Date.now()}`,
      name,
      estimated_price: price ? Number(price) : undefined,
      notes,
      priority,
      status: "wanted",
      category_id: "cat-mainan",
      added_by: "user-ayah",
      created_at: new Date().toISOString(),
    };

    setItems([newItem, ...items]);
    setName("");
    setPrice("");
    setNotes("");
  };

  const handleMarkBought = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "bought" as const } : item
      )
    );
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const priorityBadges = {
    high: "bg-danger-subtle text-danger border-danger/30 font-bold",
    medium: "bg-warning-subtle text-amber-700 dark:text-amber-400 border-warning/30",
    low: "bg-surface-raised text-foreground-muted border-border",
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground flex items-center gap-2">
          <Heart className="w-7 h-7 text-primary fill-primary/20" />
          <span>Wishlist & Shopping List Kaffa</span>
        </h1>
        <p className="text-xs md:text-sm text-foreground-muted mt-1">
          Daftar barang yang ingin dibeli untuk Kaffa (wanted → bought → katalog)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Add Wishlist */}
        <div className="lg:col-span-5 bg-surface border border-border rounded-3xl p-5 space-y-4 h-fit shadow-xs">
          <h3 className="font-display font-bold text-base text-foreground flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-primary" />
            <span>Tambah Wishlist Baru</span>
          </h3>

          <form onSubmit={handleAddWishlist} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-foreground mb-1">
                Nama Barang <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Balance Bike 12 Inch"
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">
                Estimasi Harga (Rp)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 1200000"
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">
                Prioritas
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(["low", "medium", "high"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-1.5 px-2 rounded-xl border text-[11px] font-semibold uppercase font-mono transition-all ${
                      priority === p
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-foreground-muted border-border hover:bg-surface-raised"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">
                Catatan / Alasan Dibeli
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Untuk persiapan melatih keseimbangan saat Kaffa 1.5 tahun"
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary-hover transition-colors shadow-xs"
            >
              + Simpan Ke Wishlist
            </button>
          </form>
        </div>

        {/* Wishlist List */}
        <div className="lg:col-span-7 space-y-3">
          <h3 className="font-display font-bold text-base text-foreground mb-2">
            Daftar Keinginan ({items.length})
          </h3>

          {items.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl bg-surface border border-border space-y-2 transition-all ${
                item.status === "bought" ? "opacity-60 bg-surface-raised" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4
                      className={`font-semibold text-sm text-foreground ${
                        item.status === "bought" ? "line-through text-foreground-muted" : ""
                      }`}
                    >
                      {item.name}
                    </h4>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-mono border ${
                        priorityBadges[item.priority]
                      }`}
                    >
                      {item.priority}
                    </span>
                  </div>

                  {item.notes && (
                    <p className="text-xs text-foreground-muted leading-relaxed">
                      {item.notes}
                    </p>
                  )}
                </div>

                <span className="font-bold font-mono text-sm text-primary whitespace-nowrap">
                  {item.estimated_price ? formatRupiah(item.estimated_price) : "-"}
                </span>
              </div>

              {/* Action Toolbar */}
              <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                {item.status === "wanted" ? (
                  <button
                    type="button"
                    onClick={() => handleMarkBought(item.id)}
                    className="text-success hover:underline font-semibold flex items-center gap-1"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Tandai Sudah Dibeli
                  </button>
                ) : (
                  <span className="text-success font-semibold text-[11px] flex items-center gap-1">
                    ✓ Sudah Dibeli (Siap Masuk Katalog)
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="text-danger hover:text-danger-subtle p-1 rounded-md"
                  title="Hapus"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
