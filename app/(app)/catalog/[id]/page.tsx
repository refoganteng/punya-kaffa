import { getItemById, deleteItem } from "@/lib/actions/items";
import { getReviews } from "@/lib/actions/reviews";
import { notFound } from "next/navigation";
import { ItemDetailClient } from "@/components/items/ItemDetailClient";

export const dynamic = "force-dynamic";

interface ItemPageProps {
  params: Promise<{ id: string }>;
}

export default async function ItemDetailPage({ params }: ItemPageProps) {
  const { id } = await params;
  const item = await getItemById(id);

  if (!item) {
    notFound();
  }

  const allReviews = await getReviews();
  const itemReviews = allReviews.filter((r) => r.item_id === item.id);

  return <ItemDetailClient item={item} initialReviews={itemReviews} />;
}
