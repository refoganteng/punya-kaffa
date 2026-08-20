"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("refo@punyakaffa.local");
  const [password, setPassword] = React.useState("******");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface border border-border rounded-3xl p-8 space-y-6 shadow-xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground font-bold text-2xl flex items-center justify-center mx-auto shadow-md">
            K
          </div>
          <h1 className="font-display font-bold text-2xl text-foreground">
            Punya Kaffa
          </h1>
          <p className="text-xs text-foreground-muted">
            Masuk ke buku kenangan digital keluarga Kaffa
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-foreground mb-1">
              Email Keluarga
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block font-semibold text-foreground mb-1">
              Kata Sandi
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary-hover transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            <span>Masuk ke Aplikasi</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="p-3 rounded-xl bg-surface-raised border border-border text-center text-[11px] text-foreground-muted">
          <p className="font-medium text-foreground">Akses Khusus Keluarga</p>
          <p className="mt-0.5">Disiapkan untuk Ayah, Ibu, dan Kaffa di masa depan.</p>
        </div>
      </div>
    </div>
  );
}
