import { Suspense } from "react";
import { getItems } from "@/lib/actions/items";
import { getCategoriesWithCount } from "@/lib/actions/categories";
import { CatalogClient } from "@/components/items/CatalogClient";
import { Skeleton } from "@/components/ui/Skeleton";

export const dynamic = "force-dynamic";

async function CatalogDataStream() {
  const [items, categories] = await Promise.all([
    getItems(),
    getCategoriesWithCount(),
  ]);

  return <CatalogClient initialItems={items} categories={categories} />;
}

function CatalogSkeleton() {
  return (
    <div className="space-y-6">
      <div className="bg-surface border border-border rounded-2xl p-4 space-y-4">
        <Skeleton className="h-10 w-full rounded-xl" />
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-8 w-28 rounded-full shrink-0" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="rounded-2xl bg-surface border border-border p-3.5 space-y-3">
            <Skeleton className="w-full aspect-[4/3] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <CatalogDataStream />
    </Suspense>
  );
}
