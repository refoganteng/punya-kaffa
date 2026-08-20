import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, UserRole, AcquisitionType, ItemStatus, ReviewerRole, WishlistPriority, WishlistStatus } from "@prisma/client";

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting seed...");

  // 1. Seed Users
  const ayah = await prisma.user.upsert({
    where: { email: "refo@punyakaffa.local" },
    update: {},
    create: {
      email: "refo@punyakaffa.local",
      fullName: "Refo (Ayah)",
      role: UserRole.ADMIN,
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    },
  });

  const ibu = await prisma.user.upsert({
    where: { email: "ibu@punyakaffa.local" },
    update: {},
    create: {
      email: "ibu@punyakaffa.local",
      fullName: "Ibu Kaffa",
      role: UserRole.PARENT,
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    },
  });

  const kaffa = await prisma.user.upsert({
    where: { email: "kaffa@punyakaffa.local" },
    update: {},
    create: {
      email: "kaffa@punyakaffa.local",
      fullName: "Kaffa",
      role: UserRole.KAFFA,
      avatarUrl: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=200&q=80",
    },
  });

  console.log("✅ Users seeded:", { ayah: ayah.email, ibu: ibu.email, kaffa: kaffa.email });

  // 2. Seed Categories
  const categoriesData = [
    { name: "Pakaian", slug: "pakaian", icon: "📦", sortOrder: 1 },
    { name: "Mainan", slug: "mainan", icon: "🧸", sortOrder: 2 },
    { name: "Buku", slug: "buku", icon: "📚", sortOrder: 3 },
    { name: "Mandi & Perawatan", slug: "mandi-perawatan", icon: "🛁", sortOrder: 4 },
    { name: "Suplemen & Vitamin", slug: "suplemen-vitamin", icon: "💊", sortOrder: 5 },
    { name: "Perlengkapan Makan", slug: "perlengkapan-makan", icon: "🍼", sortOrder: 6 },
    { name: "Tidur & Kamar", slug: "tidur-kamar", icon: "🛏️", sortOrder: 7 },
    { name: "Perlengkapan Travel", slug: "perlengkapan-travel", icon: "🧳", sortOrder: 8 },
    { name: "Kesehatan & Medis", slug: "kesehatan-medis", icon: "💉", sortOrder: 9 },
  ];

  const categoryMap = new Map<string, string>();

  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categoryMap.set(cat.slug, created.id);
  }

  console.log("✅ Categories seeded:", categoriesData.length);

  // 3. Seed Items
  const catMainanId = categoryMap.get("mainan")!;
  const catTravelId = categoryMap.get("perlengkapan-travel")!;
  const catBukuId = categoryMap.get("buku")!;

  const itemCube = await prisma.item.create({
    data: {
      name: "Wooden Activity Cube 5-in-1",
      brand: "Hape Toys",
      categoryId: catMainanId,
      subcategory: "Mainan Edukatif",
      description: "Activity cube kayu multifungsi dilengkapi labirin manik-manik, roda gigi berputar, pencocok bentuk, dan papan angka.",
      photos: [
        "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80"
      ],
      acquisitionType: AcquisitionType.BOUGHT,
      acquiredAt: new Date("2024-12-15"),
      acquiredPrice: 349000,
      purchaseUrl: "https://tokopedia.com",
      storeName: "Tokopedia Official",
      kaffaAgeMonths: 2,
      status: ItemStatus.ACTIVE,
      isRecommended: true,
      tags: ["favorite", "edukatif", "kayu", "motorik"],
      createdBy: ayah.id,
      reviews: {
        create: [
          {
            reviewerId: ayah.id,
            reviewerRole: ReviewerRole.AYAH,
            rating: 9,
            title: "Sangat kokoh dan edukatif!",
            body: "Bahan kayunya sangat solid, cat water-based aman jika digigit Kaffa.",
            pros: "Kayu berkualitas tinggi, pinggiran tumpul, tidak berbau cat",
            cons: "Agak berat kalau dipindah-pindah",
            wouldBuyAgain: true,
            usageDuration: "8 bulan",
          },
          {
            reviewerId: ibu.id,
            reviewerRole: ReviewerRole.IBU,
            rating: 10,
            title: "Kaffa betah main sendirian lama",
            body: "Ini salah satu mainan terbaik Kaffa waktu umur 6-12 bulan. Melatih motorik halus dan konsentrasi.",
            pros: "Warna pastel cantik, serbaguna, tahan banting",
            cons: "Tidak ada",
            wouldBuyAgain: true,
            usageDuration: "1 tahun",
          },
          {
            reviewerId: kaffa.id,
            reviewerRole: ReviewerRole.KAFFA,
            rating: 10,
            title: "Paling suka putar-putar roda giginya!",
            body: "Mainan kayu favorit aku dari bayi!",
            wouldBuyAgain: true,
          }
        ]
      }
    }
  });

  const itemStroller = await prisma.item.create({
    data: {
      name: "Compact Travel Stroller Coya",
      brand: "Cybex",
      categoryId: catTravelId,
      subcategory: "Stroller & Carrier",
      description: "Stroller ultra-kompak dengan lipatan cepat yang memenuhi standar kabin pesawat.",
      photos: [
        "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80"
      ],
      acquisitionType: AcquisitionType.BOUGHT,
      acquiredAt: new Date("2024-11-01"),
      acquiredPrice: 4500000,
      purchaseUrl: "https://shopee.co.id",
      storeName: "Shopee Mall Cybex",
      kaffaAgeMonths: 1,
      status: ItemStatus.ACTIVE,
      isRecommended: true,
      tags: ["travel", "kabin-size", "stroller", "premium"],
      createdBy: ayah.id,
      reviews: {
        create: [
          {
            reviewerId: ayah.id,
            reviewerRole: ReviewerRole.AYAH,
            rating: 9,
            title: "Ringan dan lipatnya serbaguna untuk masuk bagasi",
            body: "Lipatannya cabin size, manuver rodanya halus banget waktu dipake di mall maupun di trotoar.",
            pros: "Suspensi empuk, lipat 1 tangan, bahan breathable",
            cons: "Harga lumayan tinggi",
            wouldBuyAgain: true,
            usageDuration: "1.5 tahun",
          }
        ]
      }
    }
  });

  console.log("✅ Sample items & reviews seeded");

  // 4. Seed Wishlist
  await prisma.wishlistItem.create({
    data: {
      name: "Balance Bike Kayu 12 Inch",
      brand: "Kinderfeets",
      categoryId: catMainanId,
      notes: "Persiapan Kaffa latihan keseimbangan sepeda usia 1.5 tahun",
      purchaseUrl: "https://tokopedia.com",
      estimatedPrice: 1250000,
      priority: WishlistPriority.HIGH,
      status: WishlistStatus.WANTED,
      addedBy: ayah.id,
    }
  });

  console.log("✅ Wishlist seeded");
  console.log("🎉 Seed finished successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
