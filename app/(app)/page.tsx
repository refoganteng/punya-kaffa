import Link from "next/link";
import { getItems } from "@/lib/actions/items";
import { getWishlistItems } from "@/lib/actions/wishlist";
import { getCategoriesWithCount } from "@/lib/actions/categories";
import { ItemCard } from "@/components/items/ItemCard";
import { formatRupiah } from "@/lib/utils";
import {
  Package,
  Sparkles,
  Heart,
  TrendingUp,
  ArrowRight,
  PlusCircle,
  Star,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [items, wishlist, categories] = await Promise.all([
    getItems(),
    getWishlistItems(),
    getCategoriesWithCount(),
  ]);

  const totalItems = items.length;
  const approvedItems = items.filter((i) => i.kaffa_approved).length;
  const totalSpent = items.reduce(
    (acc, curr) => acc + (curr.acquired_price || 0),
    0
  );
  const activeWishlist = wishlist.length;

  const recentItems = items.slice(0, 4);
  const approvedList = items.filter((i) => i.kaffa_approved);

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative rounded-3xl bg-surface border border-border p-6 md:p-10 overflow-hidden shadow-xs">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-subtle text-primary border border-primary/20 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Memory Catalog & Journal Keluarga</span>
          </div>

          <h1 className="font-display font-bold text-3xl sm:text-4xl text-foreground leading-tight">
            Setiap barang punya cerita. <br className="hidden sm:inline" />
            <span className="text-primary">Kaffa punya semuanya.</span>
          </h1>

          <p className="text-sm md:text-base text-foreground-muted leading-relaxed">
            Arsip kenangan digital barang Kaffa — dari baju pertama, mainan edukatif favorit, hingga ulasan jujur dari Ayah & Ibu.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/catalog"
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover font-semibold text-sm transition-all shadow-xs flex items-center gap-2"
            >
              <span>Jelajahi Katalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/catalog/add"
              className="px-5 py-2.5 rounded-xl bg-surface hover:bg-surface-raised border border-border font-semibold text-sm text-foreground transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-primary" />
              <span>Tambah Barang</span>
            </Link>
          </div>
        </div>

        {/* Decorative Watermark */}
        <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none text-8xl md:text-9xl font-display font-bold text-primary select-none">
          KAFFA
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-surface border border-border flex items-center gap-3.5 shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-primary-subtle text-primary flex items-center justify-center shrink-0">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-foreground-muted">Total Barang</p>
            <p className="text-xl sm:text-2xl font-bold font-mono text-foreground">{totalItems}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border flex items-center gap-3.5 shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-success-subtle text-success flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
          </div>
          <div>
            <p className="text-xs text-foreground-muted">Kaffa Approved</p>
            <p className="text-xl sm:text-2xl font-bold font-mono text-foreground">{approvedItems}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border flex items-center gap-3.5 shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-primary-subtle text-primary flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-foreground-muted">Total Beli</p>
            <p className="text-base sm:text-lg font-bold font-mono text-foreground truncate">
              {formatRupiah(totalSpent)}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border flex items-center gap-3.5 shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-secondary-subtle text-secondary flex items-center justify-center shrink-0">
            <Heart className="w-5 h-5 fill-secondary/20" />
          </div>
          <div>
            <p className="text-xs text-foreground-muted">Wishlist Belanja</p>
            <p className="text-xl sm:text-2xl font-bold font-mono text-foreground">{activeWishlist}</p>
          </div>
        </div>
      </div>

      {/* Barang Terbaru Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-xl text-foreground">
              Barang Terbaru
            </h2>
            <p className="text-xs text-foreground-muted">
              Barang yang baru saja ditambahkan ke database Supabase Kaffa
            </p>
          </div>

          <Link
            href="/catalog"
            className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-1"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentItems.map((item, idx) => (
              <ItemCard key={item.id} item={item} index={idx} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-surface border border-border rounded-2xl text-xs text-foreground-muted">
            Belum ada barang di katalog. Mulai dengan{" "}
            <Link href="/catalog/add" className="text-primary font-bold hover:underline">
              tambah barang baru
            </Link>
            .
          </div>
        )}
      </div>

      {/* Kaffa Approved Section */}
      {approvedList.length > 0 && (
        <div className="p-6 rounded-3xl bg-surface border border-border space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Star className="w-4 h-4 fill-amber-400" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg text-foreground">
                  Kaffa Approved ⭐
                </h2>
                <p className="text-xs text-foreground-muted">
                  Barang favorit Kaffa yang mendapat rating tinggi dari Kaffa sendiri
                </p>
              </div>
            </div>

            <Link
              href="/catalog"
              className="text-xs font-semibold text-primary hover:underline"
            >
              Lihat di Katalog
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {approvedList.slice(0, 3).map((item, idx) => (
              <ItemCard key={item.id} item={item} index={idx} />
            ))}
          </div>
        </div>
      )}

      {/* Categories & Wishlist Quick Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Categories Browse Card */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-surface border border-border space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="font-display font-bold text-base text-foreground">
              Kategori Barang
            </h3>
            <Link
              href="/categories"
              className="text-xs font-semibold text-primary hover:underline"
            >
              Semua Kategori ({categories.length})
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {categories.slice(0, 6).map((cat) => (
              <Link
                key={cat.id}
                href={`/catalog?category=${cat.id}`}
                className="p-3 rounded-xl bg-background border border-border hover:border-primary/40 transition-colors flex items-center gap-3 group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">
                  {cat.icon}
                </span>
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-foreground group-hover:text-primary truncate">
                    {cat.name}
                  </h4>
                  <span className="text-[10px] text-foreground-muted font-mono">
                    {cat.itemCount} items
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Wishlist Preview */}
        <div className="p-6 rounded-3xl bg-surface border border-border space-y-4 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
              <h3 className="font-display font-bold text-base text-foreground flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-secondary fill-secondary/20" />
                <span>Wishlist Kaffa</span>
              </h3>
              <Link
                href="/wishlist"
                className="text-xs font-semibold text-primary hover:underline"
              >
                Buka Semua
              </Link>
            </div>

            <div className="space-y-2.5">
              {wishlist.slice(0, 3).map((w) => (
                <div
                  key={w.id}
                  className="p-3 rounded-xl bg-background border border-border text-xs flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <h5 className="font-semibold text-foreground truncate">{w.name}</h5>
                    <span className="text-[10px] text-foreground-muted font-mono">
                      {w.estimated_price ? formatRupiah(w.estimated_price) : "-"}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-mono font-bold bg-primary-subtle text-primary shrink-0">
                    {w.priority}
                  </span>
                </div>
              ))}

              {wishlist.length === 0 && (
                <p className="text-xs text-foreground-muted text-center py-4">
                  Belum ada wishlist aktif.
                </p>
              )}
            </div>
          </div>

          <Link
            href="/wishlist"
            className="w-full py-2.5 rounded-xl bg-surface-raised hover:bg-border text-center text-xs font-semibold text-foreground transition-colors"
          >
            + Tambah Wishlist
          </Link>
        </div>
      </div>
    </div>
  );
}
