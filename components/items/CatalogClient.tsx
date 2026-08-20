"use client";

import * as React from "react";
import { Item, Category } from "@/types";
import { ItemCard } from "@/components/items/ItemCard";
import { ItemFilters } from "@/components/items/ItemFilters";
import { useAuth } from "@/components/providers/AuthProvider";
import { Package, PlusCircle, Sparkles, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface CatalogClientProps {
  initialItems: Item[];
  categories: Category[];
}

export function CatalogClient({ initialItems, categories }: CatalogClientProps) {
  const { isParent } = useAuth();
  const searchParams = useSearchParams();
  const defaultCat = searchParams.get("category") || "all";

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState(defaultCat);
  const [selectedStatus, setSelectedStatus] = React.useState("all");
  const [selectedAcquisition, setSelectedAcquisition] = React.useState("all");

  React.useEffect(() => {
    if (searchParams.get("category")) {
      setSelectedCategory(searchParams.get("category")!);
    }
  }, [searchParams]);

  const filteredItems = initialItems.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "all" || item.category_id === selectedCategory;

    const matchesStatus =
      selectedStatus === "all" || item.status === selectedStatus;

    const matchesAcquisition =
      selectedAcquisition === "all" || item.acquisition_type === selectedAcquisition;

    return matchesSearch && matchesCategory && matchesStatus && matchesAcquisition;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">
              Katalog Barang Kaffa
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-subtle text-primary text-[11px] font-semibold border border-primary/20">
              <ShoppingBag className="w-3 h-3" />
              <span>Rekomendasi & Review</span>
            </span>
          </div>
          <p className="text-xs md:text-sm text-foreground-muted mt-1">
            Menampilkan {filteredItems.length} dari {initialItems.length} barang pilihan & rekomendasi keluarga
          </p>
        </div>

        {/* Admin only action */}
        {isParent && (
          <Link
            href="/catalog/add"
            className="px-4 py-2.5 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary-hover font-semibold text-xs md:text-sm transition-all shadow-xs flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Barang Baru</span>
          </Link>
        )}
      </div>

      {/* Filter Component */}
      <ItemFilters
        categories={categories}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedAcquisition={selectedAcquisition}
        onAcquisitionChange={setSelectedAcquisition}
      />

      {/* Items Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map((item, idx) => (
            <ItemCard key={item.id} item={item} index={idx} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 text-center bg-surface rounded-3xl border border-border p-8 space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-surface-raised mx-auto flex items-center justify-center text-foreground-muted">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-lg text-foreground">
            Tidak ada barang ditemukan
          </h3>
          <p className="text-xs text-foreground-muted max-w-sm mx-auto">
            Coba ubah kata kunci pencarian atau reset filter kategori untuk menemukan barang yang dicari.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setSelectedStatus("all");
              setSelectedAcquisition("all");
            }}
            className="px-4 py-2 rounded-xl bg-primary-subtle text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
          >
            Reset Semua Filter
          </button>
        </div>
      )}
    </div>
  );
}
