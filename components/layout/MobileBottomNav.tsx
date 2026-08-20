"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, Clock, Heart, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const BOTTOM_TABS = [
  { label: "Beranda", href: "/", icon: Home },
  { label: "Katalog", href: "/catalog", icon: Package },
  { label: "Timeline", href: "/timeline", icon: Clock },
  { label: "Wishlist", href: "/wishlist", icon: Heart },
  { label: "Ulasan", href: "/reviews", icon: MessageSquare },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-border/80 px-2 py-1.5 pb-safe shadow-lg">
      <nav className="flex items-center justify-around">
        {BOTTOM_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center min-w-[54px] py-1 transition-all select-none relative",
                isActive
                  ? "text-primary font-semibold"
                  : "text-foreground-muted hover:text-foreground active:opacity-70 font-normal"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 transition-transform duration-150",
                  isActive ? "scale-105" : "opacity-80"
                )}
                strokeWidth={isActive ? 2.2 : 1.7}
              />
              <span className="text-[10px] mt-0.5 tracking-tight leading-none">
                {tab.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-primary mt-0.5" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
