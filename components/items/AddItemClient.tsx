"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Category, AcquisitionType, ItemStatus } from "@/types";
import { createItem } from "@/lib/actions/items";
import { ArrowLeft, Upload, Plus, Sparkles } from "lucide-react";

interface AddItemClientProps {
  categories: Category[];
}

export function AddItemClient({ categories }: AddItemClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [name, setName] = React.useState("");
  const [brand, setBrand] = React.useState("");
  const [categoryId, setCategoryId] = React.useState(categories[0]?.id || "");
  const [subcategory, setSubcategory] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [acquisitionType, setAcquisitionType] = React.useState<AcquisitionType>("bought");
  const [acquiredAt, setAcquiredAt] = React.useState(
    new Date().toISOString().split("T")[0]
  );
  const [acquiredPrice, setAcquiredPrice] = React.useState("");
  const [giftedBy, setGiftedBy] = React.useState("");
  const [storeName, setStoreName] = React.useState("");
  const [purchaseUrl, setPurchaseUrl] = React.useState("");
  const [kaffaAgeMonths, setKaffaAgeMonths] = React.useState("6");
  const [status, setStatus] = React.useState<ItemStatus>("active");
  const [tags, setTags] = React.useState("favorite, edukatif");
  const [photoUrl, setPhotoUrl] = React.useState(
    "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !brand.trim() || !categoryId) {
      alert("Mohon lengkapi nama barang, brand, dan kategori.");
      return;
    }

    setIsSubmitting(true);
    try {
      const tagList = tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      const res = await createItem({
        name,
        brand,
        category_id: categoryId,
        subcategory: subcategory || undefined,
        description,
        photos: [photoUrl],
        acquisition_type: acquisitionType,
        acquired_at: acquiredAt,
        acquired_price: acquiredPrice ? Number(acquiredPrice) : undefined,
        gifted_by: giftedBy || undefined,
        store_name: storeName || undefined,
        purchase_url: purchaseUrl || undefined,
        kaffa_age_months: Number(kaffaAgeMonths) || 0,
        status: status,
        is_recommended: true,
        tags: tagList,
      });

      if (res.success && res.item) {
        router.push(`/catalog/${res.item.id}`);
      } else {
        alert("Gagal menambahkan barang: " + (res.error || "Unknown error"));
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
            Tambah Barang Kaffa
          </h1>
          <p className="text-xs text-foreground-muted">
            Catat detail barang baru ke dalam katalog arsip Kaffa
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-3xl p-6 space-y-5 text-sm shadow-xs">
        {/* Name & Brand */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Nama Barang <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Stroller Cabin Size Coya"
              className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Merek / Brand <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              required
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g. Cybex / Hape Toys"
              className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Category & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Kategori <span className="text-danger">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
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

        {/* Acquisition Type */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">
            Asal Barang
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { type: "bought", label: "Dibeli Sendiri" },
              { type: "gift", label: "Hadiah / Kado" },
              { type: "hand_me_down", label: "Warisan / Preloved" },
            ].map((opt) => (
              <button
                key={opt.type}
                type="button"
                onClick={() => setAcquisitionType(opt.type as AcquisitionType)}
                className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                  acquisitionType === opt.type
                    ? "bg-primary text-primary-foreground border-primary font-semibold"
                    : "bg-background text-foreground-muted border-border hover:bg-surface-raised"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              {acquisitionType === "bought" ? "Harga Beli (Rp)" : "Estimasi Nilai (Rp)"}
            </label>
            <input
              type="number"
              value={acquiredPrice}
              onChange={(e) => setAcquiredPrice(e.target.value)}
              placeholder="e.g. 350000"
              className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Tanggal Diterima
            </label>
            <input
              type="date"
              value={acquiredAt}
              onChange={(e) => setAcquiredAt(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Usia Kaffa Saat Ini (Bulan)
            </label>
            <input
              type="number"
              value={kaffaAgeMonths}
              onChange={(e) => setKaffaAgeMonths(e.target.value)}
              placeholder="e.g. 6"
              className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring font-mono"
            />
          </div>
        </div>

        {/* Gifted By or Store */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {acquisitionType !== "bought" && (
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Pemberi Hadiah / Kado
              </label>
              <input
                type="text"
                value={giftedBy}
                onChange={(e) => setGiftedBy(e.target.value)}
                placeholder="e.g. Tante Rina / Om Budi"
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Nama Toko / Marketplace
            </label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="e.g. Tokopedia / Mothercare"
              className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Link Toko Online (Opsional)
            </label>
            <input
              type="url"
              value={purchaseUrl}
              onChange={(e) => setPurchaseUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Deskripsi & Catatan
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Jelaskan spesifikasi, fungsi, atau cerita kenangan barang ini..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Photo URL */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            URL Foto Barang
          </label>
          <input
            type="url"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-ring font-mono"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Tags (Pisahkan dengan koma)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g. favorite, edukatif, travel"
            className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring font-mono"
          />
        </div>

        {/* Submit Buttons */}
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
            className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover text-xs font-semibold shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Barang ke Database"}
          </button>
        </div>
      </form>
    </div>
  );
}
