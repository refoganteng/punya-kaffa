"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  Package,
  FolderTree,
  Clock,
  Heart,
  MessageSquare,
  Plus,
  ShieldCheck,
  Menu,
  X,
  LogIn,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Katalog", href: "/catalog" },
  { label: "Kategori", href: "/categories" },
  { label: "Timeline", href: "/timeline" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Ulasan", href: "/reviews" },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, isParent, isAdmin, isGuest, logout } = useAuth();
  const [mobileDrawerOpen, setMobileDrawerOpen] = React.useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-surface/90 backdrop-blur-md border-b border-border transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                K
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-base md:text-lg text-foreground tracking-tight leading-none">
                  Punya Kaffa
                </span>
                <span className="text-[10px] text-foreground-muted font-mono mt-0.5 hidden sm:inline">
                  Memory Catalog & Review Journal
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-surface-raised/60 p-1 rounded-2xl border border-border">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200",
                    isActive
                      ? "bg-surface text-primary shadow-xs font-bold"
                      : "text-foreground-muted hover:text-foreground hover:bg-surface/50"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Items */}
          <div className="flex items-center gap-2">
            {/* Admin only: Quick Add Button */}
            {isParent && (
              <Link
                href="/catalog/add"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary-hover font-semibold text-xs transition-all shadow-xs active:scale-[0.98]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Barang</span>
              </Link>
            )}

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Admin / Login Actions */}
            {!isGuest ? (
              <div className="flex items-center gap-1.5">
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="p-2.5 rounded-xl bg-surface hover:bg-surface-raised border border-border text-primary hover:text-primary-hover transition-colors"
                    title="Panel Admin"
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => logout()}
                  className="p-2.5 rounded-xl bg-surface hover:bg-surface-raised border border-border text-foreground-muted hover:text-danger transition-colors cursor-pointer"
                  title={`Logout (${user?.full_name})`}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface hover:bg-surface-raised border border-border text-foreground-muted hover:text-foreground text-xs font-medium transition-colors"
                title="Masuk sebagai Admin"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin Login</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="md:hidden p-2 rounded-xl bg-surface hover:bg-surface-raised border border-border text-foreground-muted hover:text-foreground focus:outline-none cursor-pointer"
              aria-label="Buka Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-overlay backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative w-72 bg-surface h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200 p-5 justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <Link
                  href="/"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-2"
                >
                  <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm">
                    K
                  </div>
                  <span className="font-display font-bold text-base text-foreground">
                    Punya Kaffa
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 rounded-xl bg-surface-raised text-foreground-muted hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Admin Quick Add if logged in */}
              {isParent && (
                <Link
                  href="/catalog/add"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-secondary text-secondary-foreground font-semibold text-xs shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Tambah Barang Baru</span>
                </Link>
              )}

              {/* Mobile Links */}
              <nav className="space-y-1">
                {NAV_LINKS.map((link) => {
                  const isActive =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.href);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileDrawerOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-colors",
                        isActive
                          ? "bg-primary-subtle text-primary font-bold"
                          : "text-foreground-muted hover:text-foreground hover:bg-surface-raised"
                      )}
                    >
                      <span>{link.label}</span>
                    </Link>
                  );
                })}

                <div className="pt-3 border-t border-border mt-3 space-y-1">
                  {!isGuest ? (
                    <>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setMobileDrawerOpen(false)}
                          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-semibold text-xs text-primary hover:bg-surface-raised"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Panel Admin (Ayah)</span>
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setMobileDrawerOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-semibold text-xs text-danger hover:bg-surface-raised"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Keluar ({user?.full_name})</span>
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setMobileDrawerOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-semibold text-xs text-foreground-muted hover:text-foreground hover:bg-surface-raised"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Masuk sebagai Admin</span>
                    </Link>
                  )}
                </div>
              </nav>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-[11px] text-foreground-muted font-mono text-center">
                Punya Kaffa © {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
