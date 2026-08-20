import { Navbar } from "@/components/layout/Navbar";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary-subtle">
      {/* Top Navbar for Public & Family Users */}
      <Navbar />

      {/* Main Content Viewport with mobile bottom spacing */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 pb-24 md:pb-12">
        {children}
      </main>

      {/* Mobile Sticky Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
