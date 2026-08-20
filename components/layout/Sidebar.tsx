"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Package,
  FolderTree,
  Clock,
  Heart,
  MessageSquare,
  ShieldCheck,
  PlusCircle,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Beranda", href: "/", icon: Home },
  { label: "Katalog Barang", href: "/catalog", icon: Package },
  { label: "Kategori", href: "/categories", icon: FolderTree },
  { label: "Timeline Usia", href: "/timeline", icon: Clock },
  { label: "Wishlist Belanja", href: "/wishlist", icon: Heart },
  { label: "Feed Ulasan", href: "/reviews", icon: MessageSquare },
];

const ADMIN_ITEM = { label: "Panel Admin", href: "/admin", icon: ShieldCheck };

interface SidebarProps {
  onCloseMobile?: () => void;
}

export function Sidebar({ onCloseMobile }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-surface border-r border-border h-full flex flex-col justify-between p-4 selection:bg-primary-subtle overflow-y-auto">
      <div>
        {/* Logo & Brand Header */}
        <div className="flex items-center justify-between pb-6 mb-4 border-b border-border">
          <Link
            href="/"
            onClick={onCloseMobile}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
              K
            </div>
            <div>
              <h1 className="font-display font-bold text-lg leading-none text-foreground tracking-tight">
                Punya Kaffa
              </h1>
              <p className="text-[11px] text-foreground-muted font-mono mt-1">
                Memory & Review Journal
              </p>
            </div>
          </Link>
        </div>

        {/* Quick Add Button */}
        <div className="mb-6">
          <Link
            href="/catalog/add"
            onClick={onCloseMobile}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary-hover font-semibold text-sm transition-all shadow-xs active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Barang</span>
          </Link>
        </div>

        {/* Primary Navigation */}
        <nav className="space-y-1">
          <p className="px-3 text-[11px] font-mono font-semibold uppercase tracking-wider text-foreground-subtle mb-2">
            Navigasi Utama
          </p>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-colors",
                  isActive
                    ? "bg-primary-subtle text-primary font-semibold"
                    : "text-foreground-muted hover:text-foreground hover:bg-surface-raised"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-foreground-muted")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Admin Navigation */}
        <div className="mt-8 pt-4 border-t border-border">
          <p className="px-3 text-[11px] font-mono font-semibold uppercase tracking-wider text-foreground-subtle mb-2">
            Manajemen
          </p>
          {(() => {
            const Icon = ADMIN_ITEM.icon;
            const isActive = pathname.startsWith(ADMIN_ITEM.href);
            return (
              <Link
                href={ADMIN_ITEM.href}
                onClick={onCloseMobile}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-colors",
                  isActive
                    ? "bg-primary-subtle text-primary font-semibold"
                    : "text-foreground-muted hover:text-foreground hover:bg-surface-raised"
                )}
              >
                <Icon className="w-4 h-4 text-foreground-muted" />
                <span>{ADMIN_ITEM.label}</span>
              </Link>
            );
          })()}
        </div>
      </div>

      {/* Footer Scrapbook Note */}
      <div className="pt-4 mt-6 border-t border-border">
        <div className="p-3 rounded-xl bg-primary-subtle/50 border border-primary-subtle text-xs text-foreground-muted">
          <div className="flex items-center gap-1.5 font-semibold text-primary mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Setiap barang punya cerita.</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Kaffa punya semuanya, dari masa bayi hingga dewasa.
          </p>
        </div>
      </div>
    </aside>
  );
}
