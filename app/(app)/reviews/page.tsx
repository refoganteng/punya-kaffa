"use client";

import * as React from "react";
import { MOCK_REVIEWS, MOCK_ITEMS } from "@/lib/mock-data";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { MessageSquare, Star } from "lucide-react";
import Link from "next/link";

export default function ReviewsFeedPage() {
  const [selectedRole, setSelectedRole] = React.useState<string>("all");

  const filteredReviews = MOCK_REVIEWS.filter(
    (r) => selectedRole === "all" || r.reviewer_role === selectedRole
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-border pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground flex items-center gap-2">
            <MessageSquare className="w-7 h-7 text-primary" />
            <span>Feed Ulasan Keluarga</span>
          </h1>
          <p className="text-xs md:text-sm text-foreground-muted mt-1">
            Semua catatan ulasan jujur dari Ayah, Ibu, dan Kaffa
          </p>
        </div>

        {/* Role Filter Pills */}
        <div className="flex items-center gap-1.5 bg-surface border border-border p-1 rounded-2xl text-xs">
          {[
            { id: "all", label: "Semua" },
            { id: "ayah", label: "Ayah" },
            { id: "ibu", label: "Ibu" },
            { id: "kaffa", label: "Kaffa ⭐" },
          ].map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setSelectedRole(r.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                selectedRole === r.id
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-foreground-muted hover:text-foreground"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((rev) => {
          const targetItem = MOCK_ITEMS.find((i) => i.id === rev.item_id);
          return (
            <div key={rev.id} className="space-y-2">
              {targetItem && (
                <div className="flex items-center justify-between text-xs px-2">
                  <span className="text-foreground-muted">
                    Ulasan untuk barang:{" "}
                    <Link
                      href={`/catalog/${targetItem.id}`}
                      className="font-bold text-primary hover:underline"
                    >
                      {targetItem.name} ({targetItem.brand})
                    </Link>
                  </span>
                </div>
              )}
              <ReviewCard review={rev} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
