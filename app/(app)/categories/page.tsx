import { Suspense } from "react";
import { getCategoriesWithCount } from "@/lib/actions/categories";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { Skeleton } from "@/components/ui/Skeleton";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

async function CategoriesGrid() {
  const categories = await getCategoriesWithCount();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/catalog?category=${cat.id}`}
          className="p-5 rounded-2xl bg-surface border border-border hover:border-primary/50 transition-all duration-200 flex items-center justify-between group shadow-xs hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-subtle text-primary border border-primary/20 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CategoryIcon slug={cat.slug} name={cat.name} className="w-6 h-6" />
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
  );
}

function CategoriesSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
        <div key={i} className="p-5 rounded-2xl bg-surface border border-border flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export default function CategoriesPage() {
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

      <Suspense fallback={<CategoriesSkeleton />}>
        <CategoriesGrid />
      </Suspense>
    </div>
  );
}
