"use client";

import * as React from "react";
import { User } from "@/types";
import { login as loginAction, logout as logoutAction } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isParent: boolean;
  isGuest: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isParent: false,
  isGuest: true,
  login: async () => ({ success: false }),
  logout: async () => {},
});

export function AuthProvider({
  children,
  initialUser = null,
}: {
  children: React.ReactNode;
  initialUser?: User | null;
}) {
  const router = useRouter();
  const [user, setUser] = React.useState<User | null>(initialUser);

  const isAdmin = user?.role === "admin";
  const isParent = user?.role === "admin" || user?.role === "parent";
  const isGuest = !user;

  const login = async (email: string, password?: string) => {
    const res = await loginAction(email, password);
    if (res.success && res.user) {
      setUser(res.user);
      router.refresh();
      return { success: true };
    }
    return { success: false, error: res.error || "Gagal masuk." };
  };

  const logout = async () => {
    await logoutAction();
    setUser(null);
    router.refresh();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isParent,
        isGuest,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return React.useContext(AuthContext);
}
