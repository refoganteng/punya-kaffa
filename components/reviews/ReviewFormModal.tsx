"use client";

import * as React from "react";
import { ReviewerRole } from "@/types";
import { X, Star, ThumbsUp } from "lucide-react";

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  onSubmit: (newReview: {
    reviewer_role: ReviewerRole;
    rating: number;
    title: string;
    body: string;
    pros: string;
    cons: string;
    would_buy_again: boolean;
    usage_duration: string;
  }) => void;
}

export function ReviewFormModal({
  isOpen,
  onClose,
  itemName,
  onSubmit,
}: ReviewFormModalProps) {
  const [role, setRole] = React.useState<ReviewerRole>("ayah");
  const [rating, setRating] = React.useState<number>(9);
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [pros, setPros] = React.useState("");
  const [cons, setCons] = React.useState("");
  const [wouldBuyAgain, setWouldBuyAgain] = React.useState(true);
  const [usageDuration, setUsageDuration] = React.useState("6 bulan");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    onSubmit({
      reviewer_role: role,
      rating,
      title,
      body,
      pros,
      cons,
      would_buy_again: wouldBuyAgain,
      usage_duration: usageDuration,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-overlay backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-surface border border-border rounded-2xl p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h3 className="font-display font-bold text-lg text-foreground">
              Tulis Ulasan Keluarga
            </h3>
            <p className="text-xs text-foreground-muted">
              Untuk: <span className="font-semibold text-primary">{itemName}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-surface-raised text-foreground-muted hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {/* Reviewer Role Selection */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Reviewer (Role)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["ayah", "ibu", "kaffa"] as ReviewerRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold capitalize transition-all ${
                    role === r
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground-muted border-border hover:bg-surface-raised"
                  }`}
                >
                  {r === "kaffa" ? "Kaffa ⭐" : r}
                </button>
              ))}
            </div>
          </div>

          {/* Rating Slider / Picker (1 to 10) */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-foreground">
                Rating Skala (1-10)
              </label>
              <span className="font-mono font-bold text-base text-amber-500 flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400" /> {rating}/10
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Judul Singkat Review
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sangat kokoh dan edukatif!"
              className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Usage Duration */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Sudah Dipakai Berapa Lama?
            </label>
            <input
              type="text"
              value={usageDuration}
              onChange={(e) => setUsageDuration(e.target.value)}
              placeholder="e.g. 6 bulan / 1 tahun"
              className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Ulasan Lengkap <span className="text-danger">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Ceritakan pengalaman pemakaian barang ini oleh Kaffa atau keluarga..."
              className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Pros & Cons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-success mb-1">
                Kelebihan (Pros)
              </label>
              <input
                type="text"
                value={pros}
                onChange={(e) => setPros(e.target.value)}
                placeholder="e.g. Tahan banting, aman"
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-danger mb-1">
                Kekurangan (Cons)
              </label>
              <input
                type="text"
                value={cons}
                onChange={(e) => setCons(e.target.value)}
                placeholder="e.g. Agak berat"
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Would buy again checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="buyAgain"
              checked={wouldBuyAgain}
              onChange={(e) => setWouldBuyAgain(e.target.checked)}
              className="rounded accent-primary w-4 h-4"
            />
            <label htmlFor="buyAgain" className="text-xs text-foreground cursor-pointer select-none">
              Rekomendasikan untuk dibeli lagi (Worth it!)
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-surface-raised text-foreground-muted hover:text-foreground text-xs font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover text-xs font-semibold shadow-xs"
            >
              Simpan Ulasan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
