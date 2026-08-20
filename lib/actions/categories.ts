"use server";

import { prisma } from "@/lib/prisma";
import { Category } from "@/types";

export interface CategoryWithCount extends Category {
  itemCount: number;
}

export async function getCategoriesWithCount(): Promise<CategoryWithCount[]> {
  try {
    const rawCategories = await prisma.category.findMany({
      include: {
        _count: {
          select: { items: true },
        },
      },
      orderBy: {
        sortOrder: "asc",
      },
    });

    return rawCategories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      icon: c.icon,
      parent_id: c.parentId || undefined,
      sort_order: c.sortOrder,
      created_at: c.createdAt.toISOString(),
      itemCount: c._count.items,
    }));
  } catch (error) {
    console.error("Error getCategoriesWithCount:", error);
    return [];
  }
}
