import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { getSessionUser } from "@/lib/actions/auth";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Punya Kaffa — Memory Catalog & Review Journal Keluarga",
  description: "Setiap barang punya cerita. Kaffa punya semuanya.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialUser = await getSessionUser();

  return (
    <html lang="id" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${plusJakartaSans.variable} ${playfairDisplay.variable} ${jetbrainsMono.variable} bg-background text-foreground font-sans antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider initialUser={initialUser}>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
