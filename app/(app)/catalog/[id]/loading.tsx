import { Skeleton } from "@/components/ui/Skeleton";

export default function ItemDetailLoading() {
  return (
    <div className="space-y-6">
      {/* Top Bar Skeleton */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <Skeleton className="h-6 w-36 rounded-lg" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>

      {/* Main Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Gallery */}
        <div className="lg:col-span-5 space-y-3">
          <Skeleton className="w-full aspect-[4/3] rounded-3xl" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="w-16 h-16 rounded-xl shrink-0" />
            ))}
          </div>
        </div>

        {/* Metadata */}
        <div className="lg:col-span-7 space-y-5">
          <div className="space-y-3">
            <div className="flex gap-2">
              <Skeleton className="h-5 w-20 rounded-md" />
              <Skeleton className="h-5 w-28 rounded-md" />
            </div>
            <Skeleton className="h-9 w-3/4 rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>

          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-12 w-48 rounded-xl" />
        </div>
      </div>

      {/* Reviews Section Skeleton */}
      <div className="pt-8 border-t border-border space-y-6">
        <div className="flex justify-between">
          <Skeleton className="h-7 w-40 rounded-xl" />
          <Skeleton className="h-9 w-32 rounded-xl" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-44 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
