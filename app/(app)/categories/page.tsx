import { getCategoriesWithCount } from "@/lib/actions/categories";
import Link from "next/link";
import { ArrowRight, FolderTree } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await getCategoriesWithCount();

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">
          Kategori Barang
        </h1>
        <p className="text-xs md:text-sm text-foreground-muted mt-1">
          Jelajahi arsip barang Kaffa berdasarkan kategori dan jenis kebutuhan
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/catalog?category=${cat.id}`}
            className="p-5 rounded-3xl bg-surface border border-border hover:border-primary/50 transition-all duration-200 flex items-center justify-between group shadow-xs hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-surface-raised border border-border flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-foreground group-hover:text-primary transition-colors">
                  {cat.name}
                </h3>
                <span className="text-xs text-foreground-muted font-mono">
                  {cat.itemCount} barang terarsip
                </span>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-surface-raised group-hover:bg-primary group-hover:text-primary-foreground text-foreground-muted flex items-center justify-center transition-colors">
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
