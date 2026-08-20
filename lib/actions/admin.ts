"use server";

import { prisma } from "@/lib/prisma";
import { User, UserRole } from "@/types";

export async function getAdminOverview() {
  try {
    const [items, reviews, categories, users] = await Promise.all([
      prisma.item.findMany({ include: { category: true } }),
      prisma.review.findMany(),
      prisma.category.findMany({
        include: {
          _count: { select: { items: true } },
        },
      }),
      prisma.user.findMany(),
    ]);

    const totalItems = items.length;
    const totalReviews = reviews.length;
    const totalSpent = items.reduce(
      (acc, item) => acc + (item.acquiredPrice ? Number(item.acquiredPrice) : 0),
      0
    );

    const categoryBreakdown = categories.map((c) => ({
      id: c.id,
      name: c.name,
      icon: c.icon,
      count: c._count.items,
    }));

    const formattedUsers: User[] = users.map((u) => ({
      id: u.id,
      email: u.email,
      full_name: u.fullName,
      role: u.role.toLowerCase() as UserRole,
      avatar_url: u.avatarUrl || undefined,
      created_at: u.createdAt.toISOString(),
    }));

    return {
      totalItems,
      totalReviews,
      totalSpent,
      categoryBreakdown,
      users: formattedUsers,
      backupData: {
        exportedAt: new Date().toISOString(),
        items,
        reviews,
        categories,
        users,
      },
    };
  } catch (error) {
    console.error("Error getAdminOverview:", error);
    return {
      totalItems: 0,
      totalReviews: 0,
      totalSpent: 0,
      categoryBreakdown: [],
      users: [],
      backupData: {},
    };
  }
}
