"use client";

import * as React from "react";
import { MOCK_ITEMS, MOCK_CATEGORIES, MOCK_USERS, MOCK_REVIEWS } from "@/lib/mock-data";
import { formatRupiah } from "@/lib/utils";
import {
  ShieldCheck,
  Package,
  Users,
  FolderTree,
  Download,
  Database,
  FileSpreadsheet,
  Settings,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = React.useState<"overview" | "users" | "export">("overview");

  const totalSpent = MOCK_ITEMS.reduce((acc, curr) => acc + (curr.acquired_price || 0), 0);

  const handleExportJSON = () => {
    const data = JSON.stringify({ items: MOCK_ITEMS, categories: MOCK_CATEGORIES, reviews: MOCK_REVIEWS }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `punya-kaffa-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-primary" />
            <span>Panel Admin (Ayah Refo)</span>
          </h1>
          <p className="text-xs md:text-sm text-foreground-muted mt-1">
            Konfigurasi sistem, statistik total, manajemen user, dan ekspor data
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportJSON}
          className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover font-semibold text-xs flex items-center gap-2 shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>Export Backup JSON</span>
        </button>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-border text-xs font-semibold">
        {[
          { id: "overview", label: "Statistik System", icon: Package },
          { id: "users", label: "Manajemen User & Role", icon: Users },
          { id: "export", label: "Backup & Export Data", icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-3 flex items-center gap-2 border-b-2 transition-all ${
                activeTab === tab.id
                  ? "border-primary text-primary font-bold"
                  : "border-transparent text-foreground-muted hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-surface border border-border">
              <p className="text-xs text-foreground-muted">Total Barang Terarsip</p>
              <p className="text-3xl font-bold font-mono text-foreground mt-1">
                {MOCK_ITEMS.length}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-border">
              <p className="text-xs text-foreground-muted">Total Review Terkumpul</p>
              <p className="text-3xl font-bold font-mono text-foreground mt-1">
                {MOCK_REVIEWS.length}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-border">
              <p className="text-xs text-foreground-muted">Total Estimasi Nilai Beli</p>
              <p className="text-xl font-bold font-mono text-primary mt-1">
                {formatRupiah(totalSpent)}
              </p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-surface border border-border space-y-4">
            <h3 className="font-display font-bold text-base text-foreground">
              Barang Per Kategori
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {MOCK_CATEGORIES.map((cat) => {
                const count = MOCK_ITEMS.filter((i) => i.category_id === cat.id).length;
                return (
                  <div
                    key={cat.id}
                    className="p-3 rounded-xl bg-background border border-border flex items-center justify-between"
                  >
                    <span className="font-semibold text-foreground">
                      {cat.icon} {cat.name}
                    </span>
                    <span className="font-mono font-bold text-primary bg-primary-subtle px-2 py-0.5 rounded-md">
                      {count} items
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Users */}
      {activeTab === "users" && (
        <div className="p-6 rounded-3xl bg-surface border border-border space-y-4">
          <h3 className="font-display font-bold text-base text-foreground">
            Daftar User & Akses Role
          </h3>
          <div className="space-y-2 text-xs">
            {MOCK_USERS.map((user) => (
              <div
                key={user.id}
                className="p-4 rounded-xl bg-background border border-border flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-surface-raised border border-border flex items-center justify-center font-bold">
                    {user.full_name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-semibold text-foreground">{user.full_name}</h5>
                    <p className="text-foreground-muted font-mono">{user.email}</p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase bg-primary-subtle text-primary border border-primary/20">
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Backup & Export */}
      {activeTab === "export" && (
        <div className="p-6 rounded-3xl bg-surface border border-border space-y-4">
          <h3 className="font-display font-bold text-base text-foreground">
            Export & Backup Data
          </h3>
          <p className="text-xs text-foreground-muted">
            Unduh seluruh arsip data Punya Kaffa dalam format JSON untuk cadangan offline.
          </p>
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={handleExportJSON}
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary-hover transition-colors shadow-xs flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Download JSON Backup</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
