"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Item, ItemStatus } from "@/types";
import { updateItem } from "@/lib/actions/items";
import { ArrowLeft, Save } from "lucide-react";

interface EditItemClientProps {
  item: Item;
}

export function EditItemClient({ item }: EditItemClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [name, setName] = React.useState(item.name);
  const [brand, setBrand] = React.useState(item.brand);
  const [description, setDescription] = React.useState(item.description);
  const [status, setStatus] = React.useState<ItemStatus>(item.status);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await updateItem(item.id, {
        name,
        brand,
        description,
        status,
      });

      if (res.success) {
        router.push(`/catalog/${item.id}`);
      } else {
        alert("Gagal mengupdate barang: " + (res.error || "Error"));
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-2 rounded-xl bg-surface-raised text-foreground-muted hover:text-foreground cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground">
            Edit Barang: {item.name}
          </h1>
          <p className="text-xs text-foreground-muted">
            Perbarui metadata atau deskripsi barang di database
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-surface border border-border rounded-3xl p-6 space-y-5 text-sm shadow-xs"
      >
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Nama Barang
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Merek / Brand
            </label>
            <input
              type="text"
              required
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Status Barang
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ItemStatus)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="active">Sedang Dipakai (Active)</option>
              <option value="outgrown">Kekecilan / Lulus (Outgrown)</option>
              <option value="donated">Didonasikan (Donated)</option>
              <option value="lost">Hilang / Rusak (Lost)</option>
            </select>
          </div>
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
            className="px-5 py-2.5 rounded-xl bg-surface-raised text-foreground-muted hover:text-foreground text-xs font-semibold cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
