"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Review, ReviewerRole } from "@/types";

export async function getReviews(role?: string): Promise<(Review & { item_name?: string; item_brand?: string })[]> {
  try {
    const rawReviews = await prisma.review.findMany({
      where: role && role !== "all" ? { reviewerRole: role.toUpperCase() as any } : undefined,
      include: {
        user: true,
        item: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return rawReviews.map((r) => ({
      id: r.id,
      item_id: r.itemId,
      reviewer_id: r.reviewerId,
      reviewer_name: r.user?.fullName || "Keluarga",
      reviewer_role: r.reviewerRole.toLowerCase() as ReviewerRole,
      rating: r.rating,
      title: r.title || undefined,
      body: r.body,
      pros: r.pros || undefined,
      cons: r.cons || undefined,
      would_buy_again: r.wouldBuyAgain,
      usage_duration: r.usageDuration || undefined,
      reviewed_at: r.createdAt.toISOString(),
      item_name: r.item?.name,
      item_brand: r.item?.brand,
    }));
  } catch (error) {
    console.error("Error getReviews:", error);
    return [];
  }
}

export async function createReview(data: {
  item_id: string;
  reviewer_role: "ayah" | "ibu" | "kaffa";
  rating: number;
  title?: string;
  body: string;
  pros?: string;
  cons?: string;
  would_buy_again: boolean;
  usage_duration?: string;
}) {
  try {
    // Find or pick matching user by role
    const userRoleEnum =
      data.reviewer_role === "ayah"
        ? "ADMIN"
        : data.reviewer_role === "ibu"
        ? "PARENT"
        : "KAFFA";

    let user = await prisma.user.findFirst({
      where: { role: userRoleEnum as any },
    });

    if (!user) {
      user = await prisma.user.findFirst();
    }

    if (!user) {
      throw new Error("No user found to associate with review.");
    }

    const review = await prisma.review.create({
      data: {
        itemId: data.item_id,
        reviewerId: user.id,
        reviewerRole: data.reviewer_role.toUpperCase() as any,
        rating: data.rating,
        title: data.title,
        body: data.body,
        pros: data.pros,
        cons: data.cons,
        wouldBuyAgain: data.would_buy_again,
        usageDuration: data.usage_duration,
      },
    });

    revalidatePath("/");
    revalidatePath("/catalog");
    revalidatePath(`/catalog/${data.item_id}`);
    revalidatePath("/reviews");

    return { success: true, review };
  } catch (error: any) {
    console.error("Error createReview:", error);
    return { success: false, error: error.message };
  }
}
