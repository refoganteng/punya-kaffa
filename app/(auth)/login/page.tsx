"use client";

import * as React from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { Lock, Key, ArrowLeft, ShieldCheck, UserCheck } from "lucide-react";

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
      setErrorMsg("Silakan masukkan email akun.");
      return;
    }
    if (!password) {
      setErrorMsg("Silakan masukkan kata sandi.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await login(email, password);
      if (res.success) {
        router.push(redirectPath);
      } else {
        setErrorMsg(res.error || "Email atau kata sandi tidak valid.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal masuk ke akun.");
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
          Masuk untuk mengelola arsip barang, menulis review, dan wishlist
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-danger-subtle text-danger border border-danger/30 text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleLogin} autoComplete="off" className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-foreground mb-1">
            Email Akun Keluarga
          </label>
          <input
            type="email"
            required
            name="admin_login_email"
            id="admin_login_email"
            autoComplete="off"
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
            required
            name="admin_login_secret"
            id="admin_login_secret"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan kata sandi akun"
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

      {/* Credential Helper Box for Deployment */}
      <div className="p-4 rounded-2xl bg-surface-raised border border-border text-xs space-y-2.5">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <Key className="w-4 h-4 text-primary" />
          <span>Kredensial Akun Keluarga:</span>
        </div>

        <div className="space-y-2 font-mono text-[11px]">
          <div className="p-2.5 rounded-xl bg-background border border-border space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-foreground-muted text-[10px] font-sans font-semibold">Ayah (Admin):</span>
              <button
                type="button"
                onClick={() => {
                  setEmail("refo@punyakaffa.local");
                  setPassword("kaffa2024");
                }}
                className="text-[10px] text-primary hover:underline font-sans font-semibold px-2 py-0.5 bg-primary-subtle rounded-md cursor-pointer"
              >
                Pilih
              </button>
            </div>
            <p className="text-foreground font-semibold">refo@punyakaffa.local</p>
            <p className="text-[10px] text-foreground-muted">Password: <code className="text-primary font-bold">kaffa2024</code></p>
          </div>

          <div className="p-2.5 rounded-xl bg-background border border-border space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-foreground-muted text-[10px] font-sans font-semibold">Ibu (Parent):</span>
              <button
                type="button"
                onClick={() => {
                  setEmail("ibu@punyakaffa.local");
                  setPassword("kaffa2024");
                }}
                className="text-[10px] text-primary hover:underline font-sans font-semibold px-2 py-0.5 bg-primary-subtle rounded-md cursor-pointer"
              >
                Pilih
              </button>
            </div>
            <p className="text-foreground font-semibold">ibu@punyakaffa.local</p>
            <p className="text-[10px] text-foreground-muted">Password: <code className="text-primary font-bold">kaffa2024</code></p>
          </div>
        </div>
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
