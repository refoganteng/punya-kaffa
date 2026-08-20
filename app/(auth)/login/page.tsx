"use client";

import * as React from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { ShieldCheck, UserCheck, Lock, Key, ArrowLeft } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  const { login } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg("Silakan masukkan email.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      const success = await login(email);
      if (success) {
        router.push(redirectPath);
      } else {
        setErrorMsg("Email tidak ditemukan di database Supabase.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal masuk.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-surface border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground font-bold text-2xl flex items-center justify-center mx-auto shadow-md">
          K
        </div>
        <h1 className="font-display font-bold text-2xl text-foreground">
          Login Admin & Keluarga
        </h1>
        <p className="text-xs text-foreground-muted">
          Masuk untuk mengelola katalog barang, review, dan wishlist
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
            Email Akun Keluarga
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. refo@punyakaffa.local"
            className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-ring font-mono placeholder:text-foreground-subtle"
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
            placeholder="Masukkan kata sandi apa saja"
            className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-ring font-mono placeholder:text-foreground-subtle"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary-hover transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Lock className="w-4 h-4" />
          <span>{isLoading ? "Memproses..." : "Masuk ke Akun"}</span>
        </button>
      </form>

      {/* Clear Credential Info Box */}
      <div className="p-4 rounded-2xl bg-surface-raised border border-border text-xs space-y-2.5">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <Key className="w-4 h-4 text-primary" />
          <span>Daftar Akun yang Terdaftar di Database:</span>
        </div>

        <div className="space-y-1.5 font-mono text-[11px]">
          <div className="flex items-center justify-between p-2 rounded-xl bg-background border border-border">
            <div>
              <span className="text-foreground-muted block text-[10px]">Ayah (Admin):</span>
              <strong className="text-foreground">refo@punyakaffa.local</strong>
            </div>
            <button
              type="button"
              onClick={() => setEmail("refo@punyakaffa.local")}
              className="text-[10px] text-primary hover:underline font-sans font-semibold px-2 py-1 bg-primary-subtle rounded-md cursor-pointer"
            >
              Gunakan
            </button>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-background border border-border">
            <div>
              <span className="text-foreground-muted block text-[10px]">Ibu (Parent):</span>
              <strong className="text-foreground">ibu@punyakaffa.local</strong>
            </div>
            <button
              type="button"
              onClick={() => setEmail("ibu@punyakaffa.local")}
              className="text-[10px] text-primary hover:underline font-sans font-semibold px-2 py-1 bg-primary-subtle rounded-md cursor-pointer"
            >
              Gunakan
            </button>
          </div>
        </div>

        <p className="text-[10px] text-foreground-muted leading-relaxed">
          💡 <em>Password:</em> Bisa diisi kata sandi apa saja untuk testing login.
        </p>
      </div>

      <div className="text-center pt-1">
        <Link
          href="/"
          className="text-xs text-foreground-muted hover:text-primary transition-colors inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Mode Pengunjung (Guest)</span>
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
