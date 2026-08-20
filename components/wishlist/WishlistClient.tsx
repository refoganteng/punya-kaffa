"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { WishlistItem, Category, WishlistPriority } from "@/types";
import { formatRupiah } from "@/lib/utils";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  createWishlistItem,
  updateWishlistStatus,
  deleteWishlistItem,
} from "@/lib/actions/wishlist";
import {
  Heart,
  Plus,
  CheckCircle,
  Circle,
  Trash2,
  ExternalLink,
  ShoppingBag,
  X,
  Sparkles,
} from "lucide-react";

interface WishlistClientProps {
  initialWishlist: WishlistItem[];
  categories: Category[];
}

export function WishlistClient({
  initialWishlist,
  categories,
}: WishlistClientProps) {
  const router = useRouter();
  const { isParent } = useAuth();
  const [wishlist, setWishlist] = React.useState<WishlistItem[]>(initialWishlist);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Form states
  const [name, setName] = React.useState("");
  const [brand, setBrand] = React.useState("");
  const [categoryId, setCategoryId] = React.useState(categories[0]?.id || "");
  const [notes, setNotes] = React.useState("");
  const [estimatedPrice, setEstimatedPrice] = React.useState("");
  const [purchaseUrl, setPurchaseUrl] = React.useState("");
  const [priority, setPriority] = React.useState<WishlistPriority>("medium");

  const handleToggleStatus = async (item: WishlistItem) => {
    if (!isParent) return;
    const nextStatus = item.status === "wanted" ? "bought" : "wanted";
    setWishlist((prev) =>
      prev.map((w) => (w.id === item.id ? { ...w, status: nextStatus } : w))
    );

    const res = await updateWishlistStatus(item.id, nextStatus);
    if (!res.success) {
      alert("Gagal update status wishlist");
      router.refresh();
    }
  };

  const handleDelete = async (id: string) => {
    if (!isParent) return;
    if (confirm("Hapus barang ini dari wishlist?")) {
      setWishlist((prev) => prev.filter((w) => w.id !== id));
      const res = await deleteWishlistItem(id);
      if (!res.success) {
        alert("Gagal menghapus wishlist");
        router.refresh();
      }
    }
  };

  const handleAddWishlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await createWishlistItem({
        name,
        brand: brand || undefined,
        category_id: categoryId || undefined,
        notes: notes || undefined,
        purchase_url: purchaseUrl || undefined,
        estimated_price: estimatedPrice ? Number(estimatedPrice) : undefined,
        priority,
      });

      if (res.success && res.item) {
        const cat = categories.find((c) => c.id === res.item.categoryId);
        const newItem: WishlistItem = {
          id: res.item.id,
          name: res.item.name,
          brand: res.item.brand || undefined,
          category_id: res.item.categoryId,
          category_name: cat?.name || "Kategori",
          notes: res.item.notes || undefined,
          purchase_url: res.item.purchaseUrl || undefined,
          estimated_price: res.item.estimatedPrice ? Number(res.item.estimatedPrice) : undefined,
          priority: res.item.priority.toLowerCase() as WishlistPriority,
          status: "wanted",
          added_by: res.item.addedBy,
          created_at: res.item.createdAt.toISOString(),
        };
        setWishlist((prev) => [newItem, ...prev]);
        setIsModalOpen(false);
        setName("");
        setBrand("");
        setNotes("");
        setEstimatedPrice("");
        setPurchaseUrl("");
      } else {
        alert("Gagal menambah wishlist: " + (res.error || "Error"));
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const priorityColors: Record<WishlistPriority, string> = {
    high: "bg-danger-subtle text-danger border-danger/30",
    medium: "bg-warning-subtle text-warning border-warning/30",
    low: "bg-surface-raised text-foreground-muted border-border",
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground flex items-center gap-2">
            <span>Wishlist Belanja Kaffa</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary-subtle text-secondary font-mono font-bold">
              {wishlist.filter((w) => w.status === "wanted").length} Item Dicari
            </span>
          </h1>
          <p className="text-xs md:text-sm text-foreground-muted mt-1">
            Daftar barang impian & rencana pembelian untuk Kaffa ke depan
          </p>
        </div>

        {isParent && (
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary-hover font-semibold text-xs md:text-sm transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Wishlist</span>
          </button>
        )}
      </div>

      {/* Wishlist Items List */}
      <div className="space-y-3">
        {wishlist.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-2xl bg-surface border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs ${
              item.status === "bought"
                ? "opacity-60 border-border bg-surface-raised/40"
                : "border-border hover:border-primary/40"
            }`}
          >
            <div className="flex items-start gap-3.5">
              {isParent ? (
                <button
                  type="button"
                  onClick={() => handleToggleStatus(item)}
                  className="mt-0.5 text-primary hover:text-primary-hover cursor-pointer"
                  title={item.status === "bought" ? "Tandai Belum Dibeli" : "Tandai Sudah Dibeli"}
                >
                  {item.status === "bought" ? (
                    <CheckCircle className="w-5 h-5 text-success fill-success/20" />
                  ) : (
                    <Circle className="w-5 h-5 text-foreground-muted hover:text-primary" />
                  )}
                </button>
              ) : (
                <div className="mt-0.5">
                  {item.status === "bought" ? (
                    <CheckCircle className="w-5 h-5 text-success fill-success/20" />
                  ) : (
                    <Heart className="w-5 h-5 text-secondary fill-secondary/20" />
                  )}
                </div>
              )}

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3
                    className={`font-semibold text-sm text-foreground ${
                      item.status === "bought" ? "line-through text-foreground-muted" : ""
                    }`}
                  >
                    {item.name}
                  </h3>
                  {item.brand && (
                    <span className="text-[11px] font-mono text-foreground-muted">
                      ({item.brand})
                    </span>
                  )}
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-mono font-bold border ${
                      priorityColors[item.priority]
                    }`}
                  >
                    {item.priority}
                  </span>
                </div>

                {item.notes && (
                  <p className="text-xs text-foreground-muted">{item.notes}</p>
                )}

                <div className="flex items-center gap-3 text-xs">
                  {item.estimated_price && (
                    <span className="font-mono font-semibold text-primary">
                      {formatRupiah(item.estimated_price)}
                    </span>
                  )}
                  <span className="text-[11px] text-foreground-subtle bg-surface-raised px-2 py-0.5 rounded-md border border-border">
                    {item.category_name}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              {item.purchase_url && (
                <a
                  href={item.purchase_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary-hover font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-all"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Beli Produk</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}

              {isParent && (
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-xl bg-danger-subtle hover:bg-danger/20 text-danger cursor-pointer transition-colors"
                  title="Hapus"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}

        {wishlist.length === 0 && (
          <div className="py-12 text-center bg-surface rounded-3xl border border-border p-8 text-xs text-foreground-muted">
            Belum ada barang di wishlist.
          </div>
        )}
      </div>

      {/* Add Modal for Admin */}
      {isParent && isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-overlay backdrop-blur-xs"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-surface border border-border rounded-3xl p-6 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-display font-bold text-lg text-foreground">
                Tambah Wishlist Kaffa
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl bg-surface-raised text-foreground-muted hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddWishlist} className="space-y-3.5 text-sm">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Nama Barang <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Balance Bike Kayu"
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Brand (Opsional)
                  </label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Kinderfeets"
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Prioritas
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as WishlistPriority)}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="high">Tinggi (High)</option>
                    <option value="medium">Sedang (Medium)</option>
                    <option value="low">Rendah (Low)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Kategori
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Estimasi Harga (Rp)
                  </label>
                  <input
                    type="number"
                    value={estimatedPrice}
                    onChange={(e) => setEstimatedPrice(e.target.value)}
                    placeholder="e.g. 1200000"
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Catatan / Rencana
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Untuk kado ulang tahun ke-1"
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Link Toko Online (Affiliate)
                </label>
                <input
                  type="url"
                  value={purchaseUrl}
                  onChange={(e) => setPurchaseUrl(e.target.value)}
                  placeholder="https://tokopedia.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-surface-raised text-foreground-muted hover:text-foreground text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary-hover text-xs font-semibold shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Wishlist"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
