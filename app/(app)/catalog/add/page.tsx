"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MOCK_CATEGORIES } from "@/lib/mock-data";
import { AcquisitionType, ItemStatus } from "@/types";
import { ArrowLeft, Upload, Plus, Check } from "lucide-react";

export default function AddItemPage() {
  const router = useRouter();

  const [name, setName] = React.useState("");
  const [brand, setBrand] = React.useState("");
  const [categoryId, setCategoryId] = React.useState(MOCK_CATEGORIES[0].id);
  const [description, setDescription] = React.useState("");
  const [acquisitionType, setAcquisitionType] = React.useState<AcquisitionType>("bought");
  const [acquiredPrice, setAcquiredPrice] = React.useState("");
  const [giftedBy, setGiftedBy] = React.useState("");
  const [storeName, setStoreName] = React.useState("");
  const [purchaseUrl, setPurchaseUrl] = React.useState("");
  const [kaffaAgeMonths, setKaffaAgeMonths] = React.useState("6");
  const [status, setStatus] = React.useState<ItemStatus>("active");
  const [tags, setTags] = React.useState("favorite, edukatif");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Barang berhasil ditambahkan ke katalog dummy!");
    router.push("/catalog");
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
            Tambah Barang Kaffa
          </h1>
          <p className="text-xs text-foreground-muted">
            Catat detail barang, pakaian, atau mainan Kaffa
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-3xl p-6 space-y-5 text-sm">
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
              placeholder="e.g. Stroller Cabin Size"
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
              {MOCK_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
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
              <option value="active">Sedang Dipakai</option>
              <option value="outgrown">Kekecilan / Lulus</option>
              <option value="donated">Didonasikan</option>
              <option value="lost">Hilang / Rusak</option>
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
              { type: "hand_me_down", label: "Warisan / Thrifting" },
            ].map((opt) => (
              <button
                key={opt.type}
                type="button"
                onClick={() => setAcquisitionType(opt.type as AcquisitionType)}
                className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
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

        {/* Price & Gifted By depending on acquisition */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {acquisitionType === "bought" ? (
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Harga Beli (Rp)
              </label>
              <input
                type="number"
                value={acquiredPrice}
                onChange={(e) => setAcquiredPrice(e.target.value)}
                placeholder="e.g. 350000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Nama Pemberi (Hadiah/Warisan)
              </label>
              <input
                type="text"
                value={giftedBy}
                onChange={(e) => setGiftedBy(e.target.value)}
                placeholder="e.g. Tante Rina"
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Usia Kaffa Saat Didapat (Bulan)
            </label>
            <input
              type="number"
              value={kaffaAgeMonths}
              onChange={(e) => setKaffaAgeMonths(e.target.value)}
              placeholder="e.g. 6"
              className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Store & URL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Nama Toko / Marketplace
            </label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="e.g. Tokopedia / Official Store"
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
            Deskripsi Barang
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Jelaskan spesifikasi, fungsi, atau kenangan barang ini..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
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
            placeholder="e.g. favorite, teething, newborn"
            className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring font-mono"
          />
        </div>

        {/* Photo Upload Placeholder */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">
            Foto Barang (Supabase Storage Ready)
          </label>
          <div className="border-2 border-dashed border-border rounded-2xl p-6 text-center bg-background hover:bg-surface-raised transition-colors cursor-pointer space-y-2">
            <Upload className="w-8 h-8 mx-auto text-foreground-subtle" />
            <p className="text-xs text-foreground-muted font-medium">
              Upload foto dari galeri HP atau tarik file ke sini
            </p>
            <p className="text-[10px] text-foreground-subtle">
              (Format JPG, PNG, WEBP — Maksimal 5MB per foto)
            </p>
          </div>
        </div>

        {/* Submit */}
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
            className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover text-xs font-semibold shadow-xs"
          >
            Simpan Barang
          </button>
        </div>
      </form>
    </div>
  );
}
