import { getItems } from "@/lib/actions/items";
import { getCategoriesWithCount } from "@/lib/actions/categories";
import { CatalogClient } from "@/components/items/CatalogClient";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const [items, categories] = await Promise.all([
    getItems(),
    getCategoriesWithCount(),
  ]);

  return <CatalogClient initialItems={items} categories={categories} />;
}
