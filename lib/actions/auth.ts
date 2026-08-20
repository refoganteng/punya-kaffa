"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { User, UserRole } from "@/types";
import bcrypt from "bcryptjs";

const SESSION_COOKIE_NAME = "kaffa_auth_session";

export async function getSessionUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (!sessionCookie?.value) {
      return null;
    }

    const parsed = JSON.parse(sessionCookie.value);
    const user = await prisma.user.findUnique({
      where: { id: parsed.id },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      full_name: user.fullName,
      role: user.role.toLowerCase() as UserRole,
      avatar_url: user.avatarUrl || undefined,
      created_at: user.createdAt.toISOString(),
    };
  } catch (error: any) {
    if (error?.digest === "DYNAMIC_SERVER_USAGE" || error?.message?.includes("Dynamic server usage")) {
      throw error;
    }
    console.error("Error getSessionUser:", error);
    return null;
  }
}

export async function login(
  email: string,
  password?: string
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const trimmedEmail = email.trim();
    const user = await prisma.user.findFirst({
      where: { email: { equals: trimmedEmail, mode: "insensitive" } },
    });

    if (!user) {
      return { success: false, error: "Email akun tidak terdaftar." };
    }

    if (user.passwordHash) {
      if (!password) {
        return { success: false, error: "Silakan masukkan kata sandi." };
      }
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return { success: false, error: "Kata sandi salah. Silakan periksa kembali." };
      }
    }

    const sessionData = {
      id: user.id,
      email: user.email,
      role: user.role.toLowerCase(),
      name: user.fullName,
    };

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.fullName,
        role: user.role.toLowerCase() as UserRole,
        avatar_url: user.avatarUrl || undefined,
        created_at: user.createdAt.toISOString(),
      },
    };
  } catch (error: any) {
    console.error("Error login:", error);
    return { success: false, error: error.message || "Terjadi kesalahan sistem saat login." };
  }
}

export async function logout(): Promise<{ success: boolean }> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
    return { success: true };
  } catch (error) {
    console.error("Error logout:", error);
    return { success: false };
  }
}
