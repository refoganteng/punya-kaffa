import Link from "next/link";
import { MOCK_CATEGORIES, MOCK_ITEMS } from "@/lib/mock-data";
import { FolderTree, ArrowRight, Package } from "lucide-react";

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground flex items-center gap-2">
          <FolderTree className="w-7 h-7 text-primary" />
          <span>Kategori Barang</span>
        </h1>
        <p className="text-xs md:text-sm text-foreground-muted mt-1">
          Kelompok kategori barang Kaffa untuk mempermudah pencarian arsip
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_CATEGORIES.map((cat) => {
          const catItemCount = MOCK_ITEMS.filter(
            (i) => i.category_id === cat.id
          ).length;

          return (
            <Link
              key={cat.id}
              href={`/catalog?category=${cat.id}`}
              className="p-5 rounded-3xl bg-surface border border-border hover:border-primary/40 transition-all scrapbook-card space-y-3 flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <span className="text-4xl group-hover:scale-110 transition-transform">
                  {cat.icon}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-primary-subtle text-primary font-mono font-bold text-xs">
                  {catItemCount} barang
                </span>
              </div>

              <div>
                <h3 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-foreground-muted font-mono mt-0.5">
                  /{cat.slug}
                </p>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-foreground-muted">
                <span>Browse Katalog</span>
                <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
