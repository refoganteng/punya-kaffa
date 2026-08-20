"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  Plus,
  ShieldCheck,
  Menu,
  X,
  LogIn,
  LogOut,
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
      <header className="sticky top-0 z-40 w-full bg-surface/95 backdrop-blur-md border-b border-border/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
          {/* Brand Logo & Editorial Title */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground font-display font-bold text-base flex items-center justify-center shadow-xs group-hover:opacity-90 transition-opacity">
                K
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-base sm:text-lg text-foreground tracking-tight leading-tight">
                  Punya Kaffa
                </span>
                <span className="text-[10px] text-foreground-muted font-sans tracking-wide uppercase mt-0.5 hidden sm:inline">
                  Memory & Review Journal
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Elegant Navigation Links (No Chips / Segmented Box) */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-8 h-16">
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
                    "text-[13px] tracking-wide relative py-1 transition-colors duration-150 select-none",
                    isActive
                      ? "text-primary font-semibold after:absolute after:-bottom-[20px] after:left-0 after:right-0 after:h-[2px] after:bg-primary after:rounded-full"
                      : "text-foreground-muted hover:text-foreground font-medium"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Items */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Admin only: Quick Add Button */}
            {isParent && (
              <Link
                href="/catalog/add"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary-hover font-medium text-xs transition-all shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Barang</span>
              </Link>
            )}

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Admin / Login Actions */}
            {!isGuest ? (
              <div className="flex items-center gap-1">
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="p-2 rounded-lg hover:bg-surface-raised text-foreground-muted hover:text-primary transition-colors"
                    title="Panel Admin"
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => logout()}
                  className="p-2 rounded-lg hover:bg-surface-raised text-foreground-muted hover:text-danger transition-colors cursor-pointer"
                  title={`Logout (${user?.full_name})`}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-surface-raised text-foreground-muted hover:text-foreground text-xs font-medium transition-colors"
                title="Masuk sebagai Admin"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-surface-raised text-foreground-muted hover:text-foreground focus:outline-none cursor-pointer"
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
          <div className="relative w-72 bg-surface h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200 p-6 justify-between border-r border-border">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <Link
                  href="/"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-2"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm">
                    K
                  </div>
                  <span className="font-display font-bold text-base text-foreground">
                    Punya Kaffa
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-surface-raised text-foreground-muted hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Admin Quick Add if logged in */}
              {isParent && (
                <Link
                  href="/catalog/add"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-secondary text-secondary-foreground font-medium text-xs shadow-xs"
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
                        "flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-colors",
                        isActive
                          ? "text-primary font-semibold bg-primary-subtle/50"
                          : "text-foreground-muted hover:text-foreground hover:bg-surface-raised font-medium"
                      )}
                    >
                      <span>{link.label}</span>
                      {isActive && (
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      )}
                    </Link>
                  );
                })}

                <div className="pt-4 border-t border-border mt-4 space-y-1">
                  {!isGuest ? (
                    <>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setMobileDrawerOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-xs text-primary hover:bg-surface-raised"
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
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-xs text-danger hover:bg-surface-raised cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Keluar ({user?.full_name})</span>
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setMobileDrawerOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-xs text-foreground-muted hover:text-foreground hover:bg-surface-raised"
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
