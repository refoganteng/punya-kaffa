import { Suspense } from "react";
import { getItems } from "@/lib/actions/items";
import { TimelineClient } from "@/components/timeline/TimelineClient";
import { Skeleton } from "@/components/ui/Skeleton";

export const dynamic = "force-dynamic";

async function TimelineDataStream() {
  const items = await getItems();
  return <TimelineClient items={items} />;
}

function TimelineSkeleton() {
  return (
    <div className="space-y-8">
      <div className="border-b border-border pb-4 space-y-2">
        <Skeleton className="h-8 w-64 rounded-xl" />
        <Skeleton className="h-4 w-72 rounded-lg" />
      </div>

      <div className="p-6 rounded-3xl bg-surface border border-border space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-6 w-24 rounded-lg" />
        </div>
        <Skeleton className="h-3 w-full rounded-full" />
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="h-6 w-40 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
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
    </div>
  );
}

export default function TimelinePage() {
  return (
    <Suspense fallback={<TimelineSkeleton />}>
      <TimelineDataStream />
    </Suspense>
  );
}
