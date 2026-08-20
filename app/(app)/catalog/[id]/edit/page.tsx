"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { MOCK_ITEMS, MOCK_CATEGORIES } from "@/lib/mock-data";
import { ArrowLeft, Save } from "lucide-react";

export default function EditItemPage() {
  const params = useParams();
  const router = useRouter();
  const itemId = params.id as string;
  const item = MOCK_ITEMS.find((i) => i.id === itemId) || MOCK_ITEMS[0];

  const [name, setName] = React.useState(item.name);
  const [brand, setBrand] = React.useState(item.brand);
  const [description, setDescription] = React.useState(item.description);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Perubahan barang berhasil disimpan!");
    router.push(`/catalog/${item.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-2 rounded-xl bg-surface-raised text-foreground-muted hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground">
            Edit Barang: {item.name}
          </h1>
          <p className="text-xs text-foreground-muted">
            Perbarui metadata atau deskripsi barang
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-3xl p-6 space-y-5 text-sm">
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Nama Barang
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Merek / Brand
          </label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Deskripsi
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2.5 rounded-xl bg-surface-raised text-foreground-muted hover:text-foreground text-xs font-semibold"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover text-xs font-semibold shadow-xs flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </form>
    </div>
  );
}
