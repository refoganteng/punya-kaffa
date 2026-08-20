"use client";

import { Review } from "@/types";
import { Star, Check, X, Clock, ThumbsUp, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const isKaffa = review.reviewer_role === "kaffa";
  const isAyah = review.reviewer_role === "ayah";

  const roleStyles = {
    ayah: "bg-secondary-subtle text-secondary border-secondary/30",
    ibu: "bg-primary-subtle text-primary border-primary/30",
    kaffa: "bg-warning-subtle text-amber-700 dark:text-amber-300 border-warning/30 font-bold",
  };

  const roleLabels = {
    ayah: "Ayah",
    ibu: "Ibu",
    kaffa: "Kaffa ⭐",
  };

  return (
    <div className="rounded-2xl bg-surface border border-border p-5 space-y-3 relative overflow-hidden transition-all hover:border-border-strong">
      {/* Reviewer Header & Rating */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-surface-raised border border-border flex items-center justify-center font-bold text-sm text-foreground">
            {review.reviewer_name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-foreground">
                {review.reviewer_name}
              </span>
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] uppercase font-mono border",
                  roleStyles[review.reviewer_role]
                )}
              >
                {roleLabels[review.reviewer_role]}
              </span>
            </div>
            {review.usage_duration && (
              <span className="text-[11px] text-foreground-muted flex items-center gap-1 font-mono mt-0.5">
                <Clock className="w-3 h-3" /> Pemakaian: {review.usage_duration}
              </span>
            )}
          </div>
        </div>

        {/* Rating Score Badge */}
        <div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-xl font-mono font-bold text-sm border border-amber-500/20">
          <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
          <span>{review.rating}/10</span>
        </div>
      </div>

      {/* Review Content */}
      {review.title && (
        <h4 className="font-display font-bold text-base text-foreground">
          {review.title}
        </h4>
      )}

      <p className="text-sm text-foreground-muted leading-relaxed whitespace-pre-line">
        {review.body}
      </p>

      {/* Pros & Cons */}
      {(review.pros || review.cons) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs">
          {review.pros && (
            <div className="p-2.5 rounded-xl bg-success-subtle/40 border border-success/20 text-foreground">
              <span className="font-bold text-success flex items-center gap-1 mb-1">
                <Check className="w-3.5 h-3.5" /> Kelebihan:
              </span>
              <p className="text-foreground-muted leading-snug">{review.pros}</p>
            </div>
          )}

          {review.cons && (
            <div className="p-2.5 rounded-xl bg-danger-subtle/40 border border-danger/20 text-foreground">
              <span className="font-bold text-danger flex items-center gap-1 mb-1">
                <X className="w-3.5 h-3.5" /> Kekurangan:
              </span>
              <p className="text-foreground-muted leading-snug">{review.cons}</p>
            </div>
          )}
        </div>
      )}

      {/* Would buy again badge */}
      <div className="pt-2 flex items-center justify-between text-xs text-foreground-subtle">
        <div className="flex items-center gap-1.5 font-medium">
          {review.would_buy_again ? (
            <span className="text-success font-semibold flex items-center gap-1 bg-success-subtle px-2.5 py-1 rounded-lg border border-success/30">
              <ThumbsUp className="w-3.5 h-3.5" /> Direkomendasikan Beli Lagi
            </span>
          ) : (
            <span className="text-foreground-subtle flex items-center gap-1 bg-surface-raised px-2.5 py-1 rounded-lg">
              Kurang Direkomendasikan
            </span>
          )}
        </div>

        <span className="text-[11px] font-mono text-foreground-subtle">
          {new Date(review.reviewed_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>
    </div>
  );
}
