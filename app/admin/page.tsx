import { getAdminOverview } from "@/lib/actions/admin";
import { getSessionUser } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    redirect("/login?redirect=/admin");
  }

  const data = await getAdminOverview();
  return <AdminDashboardClient data={data} />;
}
