import { Skeleton } from "@/components/ui/Skeleton";

export default function ReviewsLoading() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="border-b border-border pb-4 space-y-2">
        <Skeleton className="h-8 w-56 rounded-xl" />
        <Skeleton className="h-4 w-72 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 rounded-2xl bg-surface border border-border space-y-3">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                <Skeleton className="w-9 h-9 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-7 w-16 rounded-xl" />
            </div>
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-16 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
