"use client";

import * as React from "react";
import { MOCK_ITEMS } from "@/lib/mock-data";
import { ItemCard } from "@/components/items/ItemCard";
import { ItemFilters } from "@/components/items/ItemFilters";
import { Package, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function CatalogPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [selectedStatus, setSelectedStatus] = React.useState("all");
  const [selectedAcquisition, setSelectedAcquisition] = React.useState("all");

  const filteredItems = MOCK_ITEMS.filter((item) => {
    // Search query matching
    const matchesSearch =
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    // Category matching
    const matchesCategory =
      selectedCategory === "all" || item.category_id === selectedCategory;

    // Status matching
    const matchesStatus =
      selectedStatus === "all" || item.status === selectedStatus;

    // Acquisition matching
    const matchesAcquisition =
      selectedAcquisition === "all" || item.acquisition_type === selectedAcquisition;

    return (
      matchesSearch && matchesCategory && matchesStatus && matchesAcquisition
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">
            Katalog Barang Kaffa
          </h1>
          <p className="text-xs md:text-sm text-foreground-muted mt-1">
            Arsip lengkap seluruh barang, mainan, pakaian, dan perlengkapan Kaffa
          </p>
        </div>

        <Link
          href="/catalog/add"
          className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover font-semibold text-xs md:text-sm transition-all shadow-xs flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tambah Barang Baru</span>
        </Link>
      </div>

      {/* Filter Component */}
      <ItemFilters
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
        <div className="py-16 text-center bg-surface rounded-3xl border border-border p-8 space-y-3">
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
