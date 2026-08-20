"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Item, Review } from "@/types";
import { formatRupiah, formatKaffaAge } from "@/lib/utils";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { ReviewFormModal } from "@/components/reviews/ReviewFormModal";
import { useAuth } from "@/components/providers/AuthProvider";
import { createReview } from "@/lib/actions/reviews";
import { deleteItem } from "@/lib/actions/items";
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  Edit,
  Trash2,
  PlusCircle,
  Sparkles,
  ShoppingBag,
  Tag,
  Clock,
  UserCheck,
  CheckCircle2,
} from "lucide-react";

interface ItemDetailClientProps {
  item: Item;
  initialReviews: Review[];
}

export function ItemDetailClient({
  item,
  initialReviews,
}: ItemDetailClientProps) {
  const router = useRouter();
  const { isParent } = useAuth();
  const [reviews, setReviews] = React.useState<Review[]>(initialReviews);
  const [activePhotoIdx, setActivePhotoIdx] = React.useState(0);
  const [isReviewModalOpen, setIsReviewModalOpen] = React.useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = React.useState(false);

  const handleAddReview = async (newReviewData: any) => {
    setIsSubmittingReview(true);
    try {
      const res = await createReview({
        item_id: item.id,
        reviewer_role: newReviewData.reviewer_role,
        rating: newReviewData.rating,
        title: newReviewData.title,
        body: newReviewData.body,
        pros: newReviewData.pros,
        cons: newReviewData.cons,
        would_buy_again: newReviewData.would_buy_again,
        usage_duration: newReviewData.usage_duration,
      });

      if (res.success && res.review) {
        const created: Review = {
          id: res.review.id,
          item_id: item.id,
          reviewer_id: res.review.reviewerId,
          reviewer_name:
            newReviewData.reviewer_role === "ayah"
              ? "Ayah (Refo)"
              : newReviewData.reviewer_role === "ibu"
              ? "Ibu Kaffa"
              : "Kaffa",
          ...newReviewData,
          reviewed_at: res.review.createdAt.toISOString(),
        };
        setReviews((prev) => [created, ...prev]);
        router.refresh();
      } else {
        alert("Gagal menambahkan review: " + (res.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleDelete = async () => {
    if (confirm(`Yakin ingin menghapus ${item.name} dari katalog?`)) {
      const res = await deleteItem(item.id);
      if (res.success) {
        router.push("/catalog");
      } else {
        alert("Gagal menghapus barang: " + (res.error || "Error"));
      }
    }
  };

  const statusColors: Record<Item["status"], string> = {
    active: "bg-success-subtle text-success border-success/30",
    outgrown: "bg-warning-subtle text-warning border-warning/30",
    donated: "bg-surface-raised text-foreground-muted border-border",
    lost: "bg-danger-subtle text-danger border-danger/30",
  };

  return (
    <div className="space-y-6">
      {/* Navigation & Action Bar */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-xs font-semibold text-foreground-muted hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog</span>
        </button>

        {/* Admin only Actions */}
        {isParent && (
          <div className="flex items-center gap-2">
            <Link
              href={`/catalog/${item.id}/edit`}
              className="p-2 rounded-xl bg-surface hover:bg-surface-raised border border-border text-foreground-muted hover:text-foreground transition-all text-xs font-semibold flex items-center gap-1.5"
            >
              <Edit className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Edit Barang</span>
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              className="p-2 rounded-xl bg-danger-subtle hover:bg-danger/20 text-danger text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Hapus</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Photo Gallery Column */}
        <div className="lg:col-span-5 space-y-3">
          <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-surface-raised border border-border shadow-xs">
            {item.photos && item.photos.length > 0 ? (
              // eslint-disable-next-next/no-img-element
              <img
                src={item.photos[activePhotoIdx]}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-foreground-subtle">
                Foto Barang
              </div>
            )}

            {item.kaffa_approved && (
              <div className="absolute top-4 right-4 bg-success-subtle/95 text-success border border-success/30 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 backdrop-blur-md shadow-xs">
                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span>Kaffa Approved ⭐</span>
              </div>
            )}
          </div>

          {/* Thumbnail Selectors */}
          {item.photos && item.photos.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {item.photos.map((photoUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActivePhotoIdx(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activePhotoIdx === idx
                      ? "border-primary scale-105"
                      : "border-border opacity-70 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-next/no-img-element */}
                  <img src={photoUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Item Metadata & Description */}
        <div className="lg:col-span-7 space-y-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider">
                {item.brand}
              </span>
              <span className="text-xs text-foreground-muted bg-surface-raised px-2.5 py-0.5 rounded-lg border border-border">
                {item.category_name}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  statusColors[item.status]
                }`}
              >
                {item.status.toUpperCase()}
              </span>
            </div>

            <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-3">
              {item.name}
            </h1>

            <p className="text-sm text-foreground-muted leading-relaxed whitespace-pre-line">
              {item.description}
            </p>
          </div>

          {/* Affiliate Recommendation Callout Box */}
          {item.purchase_url && (
            <div className="p-4 sm:p-5 rounded-2xl bg-secondary-subtle/50 border border-secondary/30 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-secondary" />
                  <span className="text-xs font-bold text-foreground">
                    Rekomendasi Beli Produk Ini
                  </span>
                </div>
                {item.store_name && (
                  <span className="text-[11px] font-medium text-foreground-muted bg-surface px-2 py-0.5 rounded-md border border-border">
                    {item.store_name}
                  </span>
                )}
              </div>

              <p className="text-xs text-foreground-muted">
                Tertarik barang yang sama untuk si kecil? Beli langsung melalui tautan toko resmi / marketplace terverifikasi berikut:
              </p>

              <a
                href={item.purchase_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary-hover font-bold text-xs sm:text-sm transition-all shadow-xs active:scale-[0.99]"
              >
                <span>Beli Produk di {item.store_name || "Toko Online"}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}

          {/* Metadata Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-surface border border-border text-xs shadow-xs">
            <div>
              <span className="text-foreground-muted block mb-0.5">Didapat Saat:</span>
              <span className="font-semibold text-foreground font-mono flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-primary" /> Usia {formatKaffaAge(item.kaffa_age_months)}
              </span>
            </div>

            <div>
              <span className="text-foreground-muted block mb-0.5">Tanggal Beli/Dapat:</span>
              <span className="font-semibold text-foreground font-mono flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-primary" /> {item.acquired_at}
              </span>
            </div>

            <div>
              <span className="text-foreground-muted block mb-0.5">Harga Didapat:</span>
              <span className="font-semibold text-foreground font-mono text-sm">
                {item.acquired_price ? formatRupiah(item.acquired_price) : "Hadiah / Warisan"}
              </span>
            </div>

            {item.gifted_by && (
              <div>
                <span className="text-foreground-muted block mb-0.5">Pemberi Hadiah:</span>
                <span className="font-semibold text-foreground flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-primary" /> {item.gifted_by}
                </span>
              </div>
            )}
          </div>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-2">
              <span className="text-xs text-foreground-subtle font-mono">Tags:</span>
              {item.tags.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-lg bg-primary-subtle text-primary text-xs font-mono font-medium flex items-center gap-1"
                >
                  <Tag className="w-3 h-3" />#{t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="pt-8 border-t border-border space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-bold text-xl text-foreground flex items-center gap-2">
              <span>Ulasan Jujur Keluarga</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono font-bold">
                ⭐ {item.average_rating ? item.average_rating.toFixed(1) : "0"}/10
              </span>
            </h2>
            <p className="text-xs text-foreground-muted mt-0.5">
              Review jujur dari Ayah, Ibu, dan Kaffa sendiri
            </p>
          </div>

          {/* Admin only: add review button */}
          {isParent && (
            <button
              type="button"
              onClick={() => setIsReviewModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Tulis Ulasan Baru</span>
            </button>
          )}
        </div>

        {/* Reviews Grid */}
        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <ReviewCard key={rev.id} review={rev} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-surface border border-border rounded-2xl text-xs text-foreground-muted">
            Belum ada ulasan untuk barang ini.
          </div>
        )}
      </div>

      {/* Review Modal */}
      {isParent && (
        <ReviewFormModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          itemName={item.name}
          onSubmit={handleAddReview}
        />
      )}
    </div>
  );
}
