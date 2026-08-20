import { Suspense } from "react";
import { getWishlistItems } from "@/lib/actions/wishlist";
import { getCategoriesWithCount } from "@/lib/actions/categories";
import { WishlistClient } from "@/components/wishlist/WishlistClient";
import { Skeleton } from "@/components/ui/Skeleton";

export const dynamic = "force-dynamic";

async function WishlistDataStream() {
  const [wishlist, categories] = await Promise.all([
    getWishlistItems(),
    getCategoriesWithCount(),
  ]);

  return <WishlistClient initialWishlist={wishlist} categories={categories} />;
}

function WishlistSkeleton() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-60 rounded-xl" />
          <Skeleton className="h-4 w-48 rounded-lg" />
        </div>
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>

      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 rounded-2xl bg-surface border border-border flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <Skeleton className="w-5 h-5 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-28" />
              </div>
            </div>
            <Skeleton className="h-8 w-24 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WishlistPage() {
  return (
    <Suspense fallback={<WishlistSkeleton />}>
      <WishlistDataStream />
    </Suspense>
  );
}
