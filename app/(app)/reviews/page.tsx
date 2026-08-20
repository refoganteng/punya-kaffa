import { Suspense } from "react";
import { getReviews } from "@/lib/actions/reviews";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { Skeleton } from "@/components/ui/Skeleton";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function ReviewsStream() {
  const reviews = await getReviews();

  if (reviews.length === 0) {
    return (
      <div className="py-16 text-center bg-surface rounded-3xl border border-border p-8 text-xs text-foreground-muted">
        Belum ada ulasan yang tersimpan. Kunjungi halaman detail barang di katalog untuk menulis ulasan pertama!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {reviews.map((rev) => (
        <div key={rev.id} className="space-y-2">
          {rev.item_name && (
            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-foreground-muted">
                Ulasan untuk:{" "}
                <Link
                  href={`/catalog/${rev.item_id}`}
                  className="font-semibold text-primary hover:underline"
                >
                  {rev.item_name}
                </Link>
              </span>
              {rev.item_brand && (
                <span className="font-mono text-foreground-subtle text-[11px]">
                  {rev.item_brand}
                </span>
              )}
            </div>
          )}
          <ReviewCard review={rev} />
        </div>
      ))}
    </div>
  );
}

function ReviewsSkeleton() {
  return (
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
  );
}

export default function ReviewsFeedPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="border-b border-border pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">
            Feed Ulasan Keluarga
          </h1>
          <p className="text-xs md:text-sm text-foreground-muted mt-1">
            Catatan pengalaman jujur pemakaian barang Kaffa dari Ayah, Ibu, dan Kaffa
          </p>
        </div>

        <Link
          href="/catalog"
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover text-xs font-semibold shadow-xs"
        >
          Tulis Ulasan di Katalog
        </Link>
      </div>

      <Suspense fallback={<ReviewsSkeleton />}>
        <ReviewsStream />
      </Suspense>
    </div>
  );
}
