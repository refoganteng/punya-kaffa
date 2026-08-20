"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Menu, X, User as UserIcon, Plus } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Sidebar } from "./Sidebar";
import { MOCK_USERS } from "@/lib/mock-data";

interface TopbarProps {
  onSearchQueryChange?: (query: string) => void;
}

export function Topbar({ onSearchQueryChange }: TopbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const currentUser = MOCK_USERS[0]; // Refo (Ayah) default active user

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-surface/90 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Trigger & Page Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-xl bg-surface-raised hover:bg-surface border border-border text-foreground-muted focus:outline-none"
            aria-label="Buka Menu Navigasi"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/" className="md:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground font-bold flex items-center justify-center text-base">
              K
            </div>
            <span className="font-display font-bold text-base text-foreground">
              Punya Kaffa
            </span>
          </Link>
        </div>

        {/* Center: Quick Search Input */}
        <div className="flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-subtle" />
            <input
              type="text"
              placeholder="Cari barang Kaffa (e.g. Wooden cube, stroller)..."
              onChange={(e) => onSearchQueryChange?.(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-foreground-subtle transition-all"
            />
          </div>
        </div>

        {/* Right: Actions (Theme Toggle, Add Quick, Profile Avatar) */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/catalog/add"
            className="sm:hidden p-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium flex items-center gap-1"
            title="Tambah Barang Baru"
          >
            <Plus className="w-4 h-4" />
          </Link>

          <ThemeToggle />

          {/* User Profile Info */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-border">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-border bg-surface-raised flex items-center justify-center">
              {currentUser.avatar_url ? (
                // eslint-disable-next-next/no-img-element
                <img
                  src={currentUser.avatar_url}
                  alt={currentUser.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="w-4 h-4 text-foreground-muted" />
              )}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold text-foreground leading-none">
                {currentUser.full_name}
              </p>
              <p className="text-[10px] text-foreground-muted font-mono mt-0.5 uppercase">
                {currentUser.role}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-overlay backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-64 bg-surface max-w-xs h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            <div className="p-3 flex justify-end">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl bg-surface-raised text-foreground-muted hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
