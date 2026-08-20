"use client";

import * as React from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { ShieldCheck, UserCheck, Lock } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  const { login } = useAuth();
  const [email, setEmail] = React.useState("refo@punyakaffa.local");
  const [password, setPassword] = React.useState("kaffa2024");
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const success = await login(email);
      if (success) {
        router.push(redirectPath);
      } else {
        setErrorMsg("Email tidak ditemukan atau terjadi kesalahan.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal masuk.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (roleEmail: string) => {
    setEmail(roleEmail);
    setIsLoading(true);
    const success = await login(roleEmail);
    if (success) {
      router.push(redirectPath);
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md bg-surface border border-border rounded-3xl p-8 space-y-6 shadow-xl">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground font-bold text-2xl flex items-center justify-center mx-auto shadow-md">
          K
        </div>
        <h1 className="font-display font-bold text-2xl text-foreground">
          Login Admin & Keluarga
        </h1>
        <p className="text-xs text-foreground-muted">
          Masuk untuk mengelola katalog, menambah barang, dan menulis ulasan
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-danger-subtle text-danger border border-danger/30 text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-foreground mb-1">
            Email Keluarga (Admin / Parent)
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-ring font-mono"
          />
        </div>

        <div>
          <label className="block font-semibold text-foreground mb-1">
            Kata Sandi / PIN
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-ring font-mono"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary-hover transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Lock className="w-4 h-4" />
          <span>{isLoading ? "Memproses..." : "Masuk sebagai Admin"}</span>
        </button>
      </form>

      {/* Quick Role Switcher for Family testing */}
      <div className="pt-2 border-t border-border space-y-2">
        <p className="text-[11px] font-semibold text-foreground-muted text-center">
          Pilih Cepat Akun Keluarga:
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleQuickLogin("refo@punyakaffa.local")}
            className="p-2.5 rounded-xl bg-background hover:bg-surface-raised border border-border text-xs font-semibold text-foreground flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>Ayah (Admin)</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin("ibu@punyakaffa.local")}
            className="p-2.5 rounded-xl bg-background hover:bg-surface-raised border border-border text-xs font-semibold text-foreground flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5 text-secondary" />
            <span>Ibu (Parent)</span>
          </button>
        </div>
      </div>

      <div className="text-center pt-2">
        <Link
          href="/"
          className="text-xs text-foreground-muted hover:text-primary transition-colors inline-flex items-center gap-1"
        >
          <span>← Kembali ke Mode Pengunjung (Guest)</span>
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-xs text-foreground-muted">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
