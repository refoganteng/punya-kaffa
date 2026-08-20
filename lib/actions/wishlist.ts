"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { WishlistItem, WishlistPriority, WishlistStatus } from "@/types";

export async function getWishlistItems(): Promise<WishlistItem[]> {
  try {
    const rawWishlist = await prisma.wishlistItem.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return rawWishlist.map((w) => ({
      id: w.id,
      name: w.name,
      brand: w.brand || undefined,
      category_id: w.categoryId,
      category_name: w.category?.name || "Kategori",
      notes: w.notes || undefined,
      purchase_url: w.purchaseUrl || undefined,
      estimated_price: w.estimatedPrice ? Number(w.estimatedPrice) : undefined,
      priority: w.priority.toLowerCase() as WishlistPriority,
      status: w.status.toLowerCase() as WishlistStatus,
      added_by: w.addedBy,
      created_at: w.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error getWishlistItems:", error);
    return [];
  }
}

export async function createWishlistItem(data: {
  name: string;
  brand?: string;
  category_id?: string;
  notes?: string;
  purchase_url?: string;
  estimated_price?: number;
  priority: "low" | "medium" | "high";
}) {
  try {
    let catId = data.category_id;
    if (!catId) {
      const firstCat = await prisma.category.findFirst();
      catId = firstCat?.id;
    }

    if (!catId) {
      throw new Error("No category found for wishlist item.");
    }

    const defaultUser = await prisma.user.findFirst();
    if (!defaultUser) {
      throw new Error("No user found.");
    }

    const item = await prisma.wishlistItem.create({
      data: {
        name: data.name,
        brand: data.brand,
        categoryId: catId,
        notes: data.notes,
        purchaseUrl: data.purchase_url,
        estimatedPrice: data.estimated_price ? Number(data.estimated_price) : undefined,
        priority: data.priority.toUpperCase() as any,
        status: "WANTED",
        addedBy: defaultUser.id,
      },
    });

    revalidatePath("/");
    revalidatePath("/wishlist");
    return { success: true, item };
  } catch (error: any) {
    console.error("Error createWishlistItem:", error);
    return { success: false, error: error.message };
  }
}

export async function updateWishlistStatus(id: string, status: "wanted" | "bought" | "cancelled") {
  try {
    const item = await prisma.wishlistItem.update({
      where: { id },
      data: {
        status: status.toUpperCase() as any,
      },
    });

    revalidatePath("/");
    revalidatePath("/wishlist");
    return { success: true, item };
  } catch (error: any) {
    console.error("Error updateWishlistStatus:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteWishlistItem(id: string) {
  try {
    await prisma.wishlistItem.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/wishlist");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleteWishlistItem:", error);
    return { success: false, error: error.message };
  }
}
