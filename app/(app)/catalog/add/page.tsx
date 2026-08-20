import { getCategoriesWithCount } from "@/lib/actions/categories";
import { getSessionUser } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import { AddItemClient } from "@/components/items/AddItemClient";

export const dynamic = "force-dynamic";

export default async function AddItemPage() {
  const user = await getSessionUser();
  if (!user || (user.role !== "admin" && user.role !== "parent")) {
    redirect("/login?redirect=/catalog/add");
  }

  const categories = await getCategoriesWithCount();
  return <AddItemClient categories={categories} />;
}
