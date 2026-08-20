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
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-lg border-t border-border px-3 py-2 pb-safe shadow-lg">
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
                "flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-xl transition-all duration-200",
                isActive
                  ? "text-primary font-bold scale-105"
                  : "text-foreground-muted hover:text-foreground active:scale-95"
              )}
            >
              <div
                className={cn(
                  "p-1 rounded-xl transition-colors",
                  isActive ? "bg-primary-subtle" : "bg-transparent"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-foreground-muted")} />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium leading-none">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
