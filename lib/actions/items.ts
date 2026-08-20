"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Item, AcquisitionType, ItemStatus } from "@/types";

export async function getItems(): Promise<Item[]> {
  try {
    const rawItems = await prisma.item.findMany({
      include: {
        category: true,
        reviews: true,
      },
      orderBy: {
        acquiredAt: "desc",
      },
    });

    return rawItems.map((item) => {
      const totalReviews = item.reviews.length;
      const avgRating =
        totalReviews > 0
          ? item.reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
          : 0;

      const kaffaApproved = item.reviews.some(
        (r) => r.reviewerRole.toLowerCase() === "kaffa" && r.rating >= 8
      );

      return {
        id: item.id,
        name: item.name,
        brand: item.brand,
        category_id: item.categoryId,
        category_name: item.category?.name || "Kategori",
        subcategory: item.subcategory || undefined,
        description: item.description,
        photos: item.photos,
        acquisition_type: item.acquisitionType.toLowerCase() as AcquisitionType,
        acquired_at: item.acquiredAt.toISOString().split("T")[0],
        acquired_price: item.acquiredPrice ? Number(item.acquiredPrice) : undefined,
        gifted_by: item.giftedBy || undefined,
        purchase_url: item.purchaseUrl || undefined,
        store_name: item.storeName || undefined,
        kaffa_age_months: item.kaffaAgeMonths,
        status: item.status.toLowerCase() as ItemStatus,
        is_recommended: item.isRecommended,
        tags: item.tags,
        created_by: item.createdBy,
        created_at: item.createdAt.toISOString(),
        updated_at: item.updatedAt.toISOString(),
        average_rating: avgRating,
        total_reviews: totalReviews,
        kaffa_approved: kaffaApproved,
      };
    });
  } catch (error) {
    console.error("Error getItems:", error);
    return [];
  }
}

export async function getItemById(id: string): Promise<Item | null> {
  try {
    const item = await prisma.item.findUnique({
      where: { id },
      include: {
        category: true,
        reviews: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!item) return null;

    const totalReviews = item.reviews.length;
    const avgRating =
      totalReviews > 0
        ? item.reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
        : 0;

    const kaffaApproved = item.reviews.some(
      (r) => r.reviewerRole.toLowerCase() === "kaffa" && r.rating >= 8
    );

    return {
      id: item.id,
      name: item.name,
      brand: item.brand,
      category_id: item.categoryId,
      category_name: item.category?.name || "Kategori",
      subcategory: item.subcategory || undefined,
      description: item.description,
      photos: item.photos,
      acquisition_type: item.acquisitionType.toLowerCase() as AcquisitionType,
      acquired_at: item.acquiredAt.toISOString().split("T")[0],
      acquired_price: item.acquiredPrice ? Number(item.acquiredPrice) : undefined,
      gifted_by: item.giftedBy || undefined,
      purchase_url: item.purchaseUrl || undefined,
      store_name: item.storeName || undefined,
      kaffa_age_months: item.kaffaAgeMonths,
      status: item.status.toLowerCase() as ItemStatus,
      is_recommended: item.isRecommended,
      tags: item.tags,
      created_by: item.createdBy,
      created_at: item.createdAt.toISOString(),
      updated_at: item.updatedAt.toISOString(),
      average_rating: avgRating,
      total_reviews: totalReviews,
      kaffa_approved: kaffaApproved,
    };
  } catch (error) {
    console.error("Error getItemById:", error);
    return null;
  }
}

export async function createItem(data: {
  name: string;
  brand: string;
  category_id: string;
  subcategory?: string;
  description: string;
  photos: string[];
  acquisition_type: "bought" | "gift" | "hand_me_down";
  acquired_at: string;
  acquired_price?: number;
  gifted_by?: string;
  purchase_url?: string;
  store_name?: string;
  kaffa_age_months: number;
  status: "active" | "outgrown" | "donated" | "lost";
  is_recommended?: boolean;
  tags: string[];
}) {
  try {
    // Get default admin user
    const defaultUser = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });

    if (!defaultUser) {
      throw new Error("User admin not found. Please run db:seed first.");
    }

    const item = await prisma.item.create({
      data: {
        name: data.name,
        brand: data.brand,
        categoryId: data.category_id,
        subcategory: data.subcategory,
        description: data.description,
        photos: data.photos.length > 0 ? data.photos : ["https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80"],
        acquisitionType: data.acquisition_type.toUpperCase() as any,
        acquiredAt: new Date(data.acquired_at),
        acquiredPrice: data.acquired_price ? Number(data.acquired_price) : undefined,
        giftedBy: data.gifted_by,
        purchaseUrl: data.purchase_url,
        storeName: data.store_name,
        kaffaAgeMonths: Number(data.kaffa_age_months),
        status: data.status.toUpperCase() as any,
        isRecommended: data.is_recommended ?? true,
        tags: data.tags,
        createdBy: defaultUser.id,
      },
    });

    revalidatePath("/");
    revalidatePath("/catalog");
    revalidatePath("/categories");
    revalidatePath("/timeline");
    return { success: true, item };
  } catch (error: any) {
    console.error("Error createItem:", error);
    return { success: false, error: error.message };
  }
}

export async function updateItem(
  id: string,
  data: {
    name: string;
    brand: string;
    description: string;
    status?: "active" | "outgrown" | "donated" | "lost";
  }
) {
  try {
    const item = await prisma.item.update({
      where: { id },
      data: {
        name: data.name,
        brand: data.brand,
        description: data.description,
        ...(data.status && { status: data.status.toUpperCase() as any }),
      },
    });

    revalidatePath("/");
    revalidatePath("/catalog");
    revalidatePath(`/catalog/${id}`);
    return { success: true, item };
  } catch (error: any) {
    console.error("Error updateItem:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteItem(id: string) {
  try {
    await prisma.item.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/catalog");
    revalidatePath("/timeline");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleteItem:", error);
    return { success: false, error: error.message };
  }
}
