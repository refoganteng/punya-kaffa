import { getItemById } from "@/lib/actions/items";
import { getSessionUser } from "@/lib/actions/auth";
import { redirect, notFound } from "next/navigation";
import { EditItemClient } from "@/components/items/EditItemClient";

export const dynamic = "force-dynamic";

interface EditItemPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditItemPage({ params }: EditItemPageProps) {
  const user = await getSessionUser();
  const { id } = await params;

  if (!user || (user.role !== "admin" && user.role !== "parent")) {
    redirect(`/login?redirect=/catalog/${id}/edit`);
  }

  const item = await getItemById(id);
  if (!item) {
    notFound();
  }

  return <EditItemClient item={item} />;
}
