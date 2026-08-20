import { getReviews } from "@/lib/actions/reviews";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { MessageSquare, Star, Sparkles } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ReviewsFeedPage() {
  const reviews = await getReviews();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-border pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground flex items-center gap-2">
            <span>Feed Ulasan Keluarga</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary-subtle text-primary font-mono font-bold">
              {reviews.length} Ulasan
            </span>
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

      {/* Reviews Stream */}
      {reviews.length > 0 ? (
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
      ) : (
        <div className="py-16 text-center bg-surface rounded-3xl border border-border p-8 text-xs text-foreground-muted">
          Belum ada ulasan yang tersimpan. Kunjungi halaman detail barang di katalog untuk menulis ulasan pertama!
        </div>
      )}
    </div>
  );
}
