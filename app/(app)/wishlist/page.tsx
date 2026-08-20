import { getWishlistItems } from "@/lib/actions/wishlist";
import { getCategoriesWithCount } from "@/lib/actions/categories";
import { WishlistClient } from "@/components/wishlist/WishlistClient";

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const [wishlist, categories] = await Promise.all([
    getWishlistItems(),
    getCategoriesWithCount(),
  ]);

  return <WishlistClient initialWishlist={wishlist} categories={categories} />;
}
