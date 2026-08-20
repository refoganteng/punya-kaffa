import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  UserRole,
  AcquisitionType,
  ItemStatus,
  ReviewerRole,
  WishlistPriority,
  WishlistStatus,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting rich database seed...");

  const defaultPasswordHash = await bcrypt.hash("kaffa2024", 10);

  // 1. Seed Users
  const ayah = await prisma.user.upsert({
    where: { email: "refo@punyakaffa.local" },
    update: {
      passwordHash: defaultPasswordHash,
    },
    create: {
      email: "refo@punyakaffa.local",
      fullName: "Refo (Ayah)",
      passwordHash: defaultPasswordHash,
      role: UserRole.ADMIN,
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    },
  });

  const ibu = await prisma.user.upsert({
    where: { email: "ibu@punyakaffa.local" },
    update: {
      passwordHash: defaultPasswordHash,
    },
    create: {
      email: "ibu@punyakaffa.local",
      fullName: "Ibu Kaffa",
      passwordHash: defaultPasswordHash,
      role: UserRole.PARENT,
      avatarUrl:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    },
  });

  const kaffa = await prisma.user.upsert({
    where: { email: "kaffa@punyakaffa.local" },
    update: {
      passwordHash: defaultPasswordHash,
    },
    create: {
      email: "kaffa@punyakaffa.local",
      fullName: "Kaffa",
      passwordHash: defaultPasswordHash,
      role: UserRole.KAFFA,
      avatarUrl:
        "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=200&q=80",
    },
  });

  console.log("✅ Users ready");

  // 2. Seed Categories
  const categoriesData = [
    { name: "Pakaian", slug: "pakaian", icon: "pakaian", sortOrder: 1 },
    { name: "Mainan", slug: "mainan", icon: "mainan", sortOrder: 2 },
    { name: "Buku", slug: "buku", icon: "buku", sortOrder: 3 },
    { name: "Mandi & Perawatan", slug: "mandi-perawatan", icon: "mandi-perawatan", sortOrder: 4 },
    { name: "Suplemen & Vitamin", slug: "suplemen-vitamin", icon: "suplemen-vitamin", sortOrder: 5 },
    { name: "Perlengkapan Makan", slug: "perlengkapan-makan", icon: "perlengkapan-makan", sortOrder: 6 },
    { name: "Tidur & Kamar", slug: "tidur-kamar", icon: "tidur-kamar", sortOrder: 7 },
    { name: "Perlengkapan Travel", slug: "perlengkapan-travel", icon: "perlengkapan-travel", sortOrder: 8 },
    { name: "Kesehatan & Medis", slug: "kesehatan-medis", icon: "kesehatan-medis", sortOrder: 9 },
  ];

  const categoryMap = new Map<string, string>();
  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, icon: cat.icon, sortOrder: cat.sortOrder },
      create: cat,
    });
    categoryMap.set(cat.slug, created.id);
  }

  console.log("✅ 9 Categories ready");

  // Clean existing items & wishlist for fresh rich state
  await prisma.review.deleteMany({});
  await prisma.wishlistItem.deleteMany({});
  await prisma.item.deleteMany({});

  // 3. Populate Rich Items per Category
  const itemsData = [
    // --- 1. PAKAIAN ---
    {
      name: "Jumper Katun Organik Bamboo 3-Pack",
      brand: "Bohopanna",
      categoryId: categoryMap.get("pakaian")!,
      subcategory: "Baju Harian",
      description: "Jumper bayi berbahan serat bambu organik yang sejuk, hipoalergenik, dan sangat lembut di kulit sensitif bayi.",
      photos: [
        "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80",
      ],
      acquisitionType: AcquisitionType.BOUGHT,
      acquiredAt: new Date("2024-08-10"),
      acquiredPrice: 165000,
      purchaseUrl: "https://tokopedia.com",
      storeName: "Bohopanna Official Store",
      kaffaAgeMonths: 0,
      status: ItemStatus.OUTGROWN,
      isRecommended: true,
      tags: ["bamboo", "organik", "newborn", "adem"],
      createdBy: ibu.id,
      reviews: [
        {
          reviewerId: ibu.id,
          reviewerRole: ReviewerRole.IBU,
          rating: 10,
          title: "Bahan paling adem waktu Kaffa newborn!",
          body: "Kaffa gampang biang keringat kalau pakai baju biasa, tapi pas pakai jumper bamboo ini kulitnya tetap mulus.",
          pros: "Super lembut, elastis, menyerap keringat seketika",
          cons: "Cepat kekecilan karena Kaffa cepat tumbuh",
          wouldBuyAgain: true,
          usageDuration: "3 bulan",
        },
      ],
    },
    {
      name: "Sleepsuit 2-Way Zipper Anti-Colic",
      brand: "Velvet Junior",
      categoryId: categoryMap.get("pakaian")!,
      subcategory: "Baju Tidur",
      description: "Baju tidur one-piece dengan resleting 2 arah memudahkan ganti popok di malam hari tanpa membuka baju seluruhnya.",
      photos: [
        "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80",
      ],
      acquisitionType: AcquisitionType.BOUGHT,
      acquiredAt: new Date("2024-09-05"),
      acquiredPrice: 85000,
      purchaseUrl: "https://shopee.co.id",
      storeName: "Velvet Junior Mall",
      kaffaAgeMonths: 1,
      status: ItemStatus.ACTIVE,
      isRecommended: true,
      tags: ["sleepsuit", "zipper", "baju-tidur", "praktis"],
      createdBy: ayah.id,
      reviews: [
        {
          reviewerId: ayah.id,
          reviewerRole: ReviewerRole.AYAH,
          rating: 9,
          title: "Penyelamat Ayah waktu ganti popok tengah malam",
          body: "Resleting 2 arahnya bener-bener ngebantu banget waktu Kaffa kebangun jam 2 pagi. Ga perlu kancing cetek yang ribet.",
          pros: "Resleting halus ada pelindung dagu, bahan katun SNI",
          cons: "Pilihan motif agak terbatas",
          wouldBuyAgain: true,
          usageDuration: "4 bulan",
        },
      ],
    },
    {
      name: "Jaket Puffer Windbreaker Bayi",
      brand: "Uniqlo Baby",
      categoryId: categoryMap.get("pakaian")!,
      subcategory: "Outerwear & Jaket",
      description: "Jaket hangat tahan angin berbahan ringan dengan lapisan dalam fleece halus, cocok untuk bepergian ke daerah sejuk.",
      photos: [
        "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=800&q=80",
      ],
      acquisitionType: AcquisitionType.GIFT,
      acquiredAt: new Date("2024-11-20"),
      acquiredPrice: 399000,
      giftedBy: "Tante Rina",
      purchaseUrl: "https://uniqlo.com/id",
      storeName: "Uniqlo Official",
      kaffaAgeMonths: 3,
      status: ItemStatus.ACTIVE,
      isRecommended: true,
      tags: ["jaket", "travel", "hangat", "kado"],
      createdBy: ibu.id,
      reviews: [
        {
          reviewerId: ibu.id,
          reviewerRole: ReviewerRole.IBU,
          rating: 9,
          title: "Cocok buat liburan keluarga ke Bandung & Puncak",
          body: "Kaffa tetap hangat dan leluasa gerak. Ringan banget waktu dilipat masuk tas.",
          pros: "Bisa dicuci mesin cuci biasa, hoodie pas di kepala",
          cons: "Harganya lumayan jika beli sendiri",
          wouldBuyAgain: true,
          usageDuration: "3 bulan",
        },
      ],
    },

    // --- 2. MAINAN ---
    {
      name: "Wooden Activity Cube 5-in-1",
      brand: "Hape Toys",
      categoryId: categoryMap.get("mainan")!,
      subcategory: "Mainan Edukatif",
      description: "Activity cube kayu multifungsi dilengkapi labirin manik-manik, roda gigi berputar, pencocok bentuk, dan papan angka.",
      photos: [
        "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80",
      ],
      acquisitionType: AcquisitionType.BOUGHT,
      acquiredAt: new Date("2024-10-15"),
      acquiredPrice: 349000,
      purchaseUrl: "https://tokopedia.com",
      storeName: "Tokopedia Official",
      kaffaAgeMonths: 2,
      status: ItemStatus.ACTIVE,
      isRecommended: true,
      tags: ["favorite", "edukatif", "kayu", "motorik"],
      createdBy: ayah.id,
      reviews: [
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
        },
      ],
    },
    {
      name: "Kick & Play Deluxe Piano Gym",
      brand: "Fisher-Price",
      categoryId: categoryMap.get("mainan")!,
      subcategory: "Playmat & Sensory",
      description: "Playmat sensorik dengan tuts piano yang menyala dan berbunyi ketika ditendang kaki bayi saat tummy time dan telentang.",
      photos: [
        "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=800&q=80",
      ],
      acquisitionType: AcquisitionType.BOUGHT,
      acquiredAt: new Date("2024-09-01"),
      acquiredPrice: 599000,
      purchaseUrl: "https://tokopedia.com",
      storeName: "Fisher-Price Official",
      kaffaAgeMonths: 1,
      status: ItemStatus.ACTIVE,
      isRecommended: true,
      tags: ["playmat", "piano", "tummy-time", "musik"],
      createdBy: ibu.id,
      reviews: [
        {
          reviewerId: ibu.id,
          reviewerRole: ReviewerRole.IBU,
          rating: 10,
          title: "Lagu 'Maybe' Fisher Price terngiang-ngiang!",
          body: "Bagus banget buat stimulasi motorik kasar kaki bayi dari umur 1 bulan.",
          pros: "Matras bisa dicuci mesin, musik interaktif, piano bisa dilepas",
          cons: "Volume suara paling tinggi agak kencang",
          wouldBuyAgain: true,
          usageDuration: "6 bulan",
        },
      ],
    },
    {
      name: "LEGO DUPLO My First Animal Train",
      brand: "LEGO",
      categoryId: categoryMap.get("mainan")!,
      subcategory: "Balok Susun",
      description: "Balok susun ukuran besar ramah balita bertema kereta hewan (gajah, jerapah, panda, harimau).",
      photos: [
        "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80",
      ],
      acquisitionType: AcquisitionType.GIFT,
      acquiredAt: new Date("2025-01-10"),
      acquiredPrice: 289000,
      giftedBy: "Om Dimas",
      purchaseUrl: "https://lego.com",
      storeName: "Lego Certified Store",
      kaffaAgeMonths: 5,
      status: ItemStatus.ACTIVE,
      isRecommended: true,
      tags: ["lego", "duplo", "hewan", "kreativitas"],
      createdBy: ayah.id,
      reviews: [
        {
          reviewerId: ayah.id,
          reviewerRole: ReviewerRole.AYAH,
          rating: 9,
          title: "Ukuran balok besar, tidak tertelan",
          body: "Kualitas plastik LEGO tidak ada tandingannya. Presisi saat dipasang dan gampang dilepas tangan mungil Kaffa.",
          pros: "Aman dari bahaya tersedak, warna cerah, melatih logika",
          cons: "Isi balok hanya 15 pcs",
          wouldBuyAgain: true,
          usageDuration: "4 bulan",
        },
      ],
    },

    // --- 3. BUKU ---
    {
      name: "Cloth Book Sensorik Bunyi & Raba",
      brand: "Jollybaby",
      categoryId: categoryMap.get("buku")!,
      subcategory: "Buku Kain",
      description: "Buku bantal kain berisi tekstur ekor binatang 3D, cermin aman bayi, dan kresek-kresek suara interaktif.",
      photos: [
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
      ],
      acquisitionType: AcquisitionType.BOUGHT,
      acquiredAt: new Date("2024-09-12"),
      acquiredPrice: 79000,
      purchaseUrl: "https://shopee.co.id",
      storeName: "Jollybaby Indonesia",
      kaffaAgeMonths: 1,
      status: ItemStatus.ACTIVE,
      isRecommended: true,
      tags: ["cloth-book", "sensorik", "buku-bantal", "tekstur"],
      createdBy: ibu.id,
      reviews: [
        {
          reviewerId: ibu.id,
          reviewerRole: ReviewerRole.IBU,
          rating: 9,
          title: "Aman digigit dan bisa dicuci berkali-kali",
          body: "Buku pertama Kaffa waktu fase oral. Ditarik-tarik dan digigit tetap awet tidak robek.",
          pros: "Bisa dicuci berulang, warna cerah kontras",
          cons: "Halaman agak tipis",
          wouldBuyAgain: true,
          usageDuration: "5 bulan",
        },
      ],
    },
    {
      name: "Seri Tubuh Kita & Mengenal Emosi",
      brand: "Rabbithole",
      categoryId: categoryMap.get("buku")!,
      subcategory: "Board Book",
      description: "Board book tebal dengan ilustrasi hangat yang mengajarkan anggota tubuh dan cara mengekspresikan perasaan.",
      photos: [
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
      ],
      acquisitionType: AcquisitionType.BOUGHT,
      acquiredAt: new Date("2024-11-15"),
      acquiredPrice: 195000,
      purchaseUrl: "https://rabbitholeid.com",
      storeName: "Rabbithole ID",
      kaffaAgeMonths: 3,
      status: ItemStatus.ACTIVE,
      isRecommended: true,
      tags: ["board-book", "emosi", "edukasi", "read-aloud"],
      createdBy: ayah.id,
      reviews: [
        {
          reviewerId: ayah.id,
          reviewerRole: ReviewerRole.AYAH,
          rating: 10,
          title: "Buku bedtime reading wajib tiap malam",
          body: "Ceritanya sederhana tapi penuh pesan emosional. Halaman karton tebal tahan air ludah bayi.",
          pros: "Ujung rounded aman, cerita bermakna, ilustrasi lokal",
          cons: "Harga per paket lumayan premium",
          wouldBuyAgain: true,
          usageDuration: "6 bulan",
        },
        {
          reviewerId: kaffa.id,
          reviewerRole: ReviewerRole.KAFFA,
          rating: 9,
          title: "Suka tunjuk mata, hidung, mulut!",
          body: "Buku cerita kesukaan Kaffa sebelum bobo.",
          wouldBuyAgain: true,
        },
      ],
    },

    // --- 4. MANDI & PERAWATAN ---
    {
      name: "Baby Gentle Wash & Shampoo 400ml",
      brand: "Cetaphil Baby",
      categoryId: categoryMap.get("mandi-perawatan")!,
      subcategory: "Sabun & Sampo",
      description: "Formula 2-in-1 dengan ekstrak calendula organik yang menutrisi kulit dan rambut bayi tanpa pedih di mata.",
      photos: [
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
      ],
      acquisitionType: AcquisitionType.BOUGHT,
      acquiredAt: new Date("2024-08-01"),
      acquiredPrice: 189000,
      purchaseUrl: "https://watsons.co.id",
      storeName: "Watsons Official",
      kaffaAgeMonths: 0,
      status: ItemStatus.ACTIVE,
      isRecommended: true,
      tags: ["sabun", "sampo", "calendula", "kulit-sensitif"],
      createdBy: ibu.id,
      reviews: [
        {
          reviewerId: ibu.id,
          reviewerRole: ReviewerRole.IBU,
          rating: 10,
          title: "Kulit Kaffa ga pernah bruntusan sama sekali",
          body: "Sudah repurchase botol ke-3. Wanginya lembut banget khas bayi dan tidak bikin kulit kering.",
          pros: "Tidak pedih di mata, pump praktis, busa lembut",
          cons: "Harga lebih mahal dibanding sabun minimarket",
          wouldBuyAgain: true,
          usageDuration: "6 bulan",
        },
      ],
    },
    {
      name: "Bak Mandi Lipat Ergonomis dengan Sensor Suhu",
      brand: "Karibu",
      categoryId: categoryMap.get("mandi-perawatan")!,
      subcategory: "Bak Mandi",
      description: "Bak mandi bayi yang dapat dilipat tipis 7cm dilengkapi sumbat pembuangan air pintar yang berubah warna jika air terlalu panas.",
      photos: [
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
      ],
      acquisitionType: AcquisitionType.BOUGHT,
      acquiredAt: new Date("2024-08-05"),
      acquiredPrice: 285000,
      purchaseUrl: "https://tokopedia.com",
      storeName: "Karibu Indonesia",
      kaffaAgeMonths: 0,
      status: ItemStatus.ACTIVE,
      isRecommended: true,
      tags: ["bak-mandi", "lipat", "hemat-tempat", "sensor-suhu"],
      createdBy: ayah.id,
      reviews: [
        {
          reviewerId: ayah.id,
          reviewerRole: ReviewerRole.AYAH,
          rating: 9,
          title: "Sangat hemat tempat untuk kamar mandi apartemen/rumah minimalis",
          body: "Bisa digantung di dinding setelah kering. Sensor suhunya akurat mempermudah takar air hangat.",
          pros: "Kaki kokoh anti-slip, lipatan elastis berkualitas tinggi",
          cons: "Harus dipastikan kering sebelum dilipat agar tidak lembap",
          wouldBuyAgain: true,
          usageDuration: "6 bulan",
        },
      ],
    },
    {
      name: "Minyak Telon Aromaterapi Lavender 100ml",
      brand: "Doodle",
      categoryId: categoryMap.get("mandi-perawatan")!,
      subcategory: "Minyak Telon",
      description: "Minyak telon premium dengan aroma lavender eksklusif yang mampu melindungi dari gigitan nyamuk hingga 8 jam.",
      photos: [
        "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80",
      ],
      acquisitionType: AcquisitionType.BOUGHT,
      acquiredAt: new Date("2024-08-15"),
      acquiredPrice: 45000,
      purchaseUrl: "https://shopee.co.id",
      storeName: "Doodle Exclusive Baby Care",
      kaffaAgeMonths: 0,
      status: ItemStatus.ACTIVE,
      isRecommended: true,
      tags: ["telon", "lavender", "anti-nyamuk", "hangat"],
      createdBy: ibu.id,
      reviews: [
        {
          reviewerId: ibu.id,
          reviewerRole: ReviewerRole.IBU,
          rating: 10,
          title: "Wanginya elegan, beda dari telon biasa!",
          body: "Bikin Kaffa tidur nyenyak sehabis mandi sore karena aroma lavendernya menenangkan.",
          pros: "Tidak menyengat, hangatnya pas, anti nyamuk ampuh",
          cons: "Cepat habis kalau dipakai sekeluarga",
          wouldBuyAgain: true,
          usageDuration: "6 bulan",
        },
      ],
    },

    // --- 5. SUPLEMEN & VITAMIN ---
    {
      name: "Baby's DHA with Vitamin D3 Drops",
      brand: "Nordic Naturals",
      categoryId: categoryMap.get("suplemen-vitamin")!,
      subcategory: "Minyak Ikan / DHA",
      description: "DHA murni dari minyak hati ikan kod liar Kutub Utara untuk perkembangan optimal otak, saraf, dan penglihatan bayi.",
      photos: [
        "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=800&q=80",
      ],
      acquisitionType: AcquisitionType.BOUGHT,
      acquiredAt: new Date("2024-09-01"),
      acquiredPrice: 340000,
      purchaseUrl: "https://iherb.com",
      storeName: "iHerb International",
      kaffaAgeMonths: 1,
      status: ItemStatus.ACTIVE,
      isRecommended: true,
      tags: ["dha", "omega3", "vitamin-d3", "otak"],
      createdBy: ayah.id,
      reviews: [
        {
          reviewerId: ayah.id,
          reviewerRole: ReviewerRole.AYAH,
          rating: 9,
          title: "Suplemen otak terbaik rekomendasi DSA Kaffa",
          body: "Dilengkapi pipet ukur presisi. Rasanya tidak terlalu amis jika dicampur ASI/susu.",
          pros: "Kualitas grade farmasi internasional, bebas merkuri",
          cons: "Harus disimpan di kulkas setelah dibuka",
          wouldBuyAgain: true,
          usageDuration: "5 bulan",
        },
      ],
    },
    {
      name: "Probiotic Drops Suplemen Pencernaan",
      brand: "Interlac",
      categoryId: categoryMap.get("suplemen-vitamin")!,
      subcategory: "Probiotik",
      description: "Tetes probiotik Lactobacillus reuteri Protectis untuk mengatasi kolik, gumoh, sembelit, dan menjaga kesehatan usus bayi.",
      photos: [
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
      ],
      acquisitionType: AcquisitionType.BOUGHT,
      acquiredAt: new Date("2024-08-20"),
      acquiredPrice: 315000,
      purchaseUrl: "https://halodoc.com",
      storeName: "Apotek Resmi Halodoc",
      kaffaAgeMonths: 0,
      status: ItemStatus.ACTIVE,
      isRecommended: true,
      tags: ["probiotik", "kolik", "pencernaan", "anti-sembelit"],
      createdBy: ibu.id,
      reviews: [
        {
          reviewerId: ibu.id,
          reviewerRole: ReviewerRole.IBU,
          rating: 10,
          title: "Kolik Kaffa langsung mereda setelah 3 hari rutin!",
          body: "Waktu Kaffa sering nangis malam karena perut kembung/kolik, obat tetes ini penyelamat kami berdua.",
          pros: "Cukup 5 tetes sehari, ampuh atasi kembung",
          cons: "Botol kecil cepat habis",
          wouldBuyAgain: true,
          usageDuration: "4 bulan",
        },
      ],
    },

    // --- 6. PERLENGKAPAN MAKAN ---
    {
      name: "Multiply 6-in-1 High Chair & Booster",
      brand: "Joie",
      categoryId: categoryMap.get("perlengkapan-makan")!,
      subcategory: "Kursi Makan Bayi",
      description: "Kursi makan bayi serbaguna yang dapat bertransformasi dari kursi makan bayi, booster seat, hingga meja dan kursi belajar anak.",
      photos: [
        "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80",
      ],
      acquisitionType: AcquisitionType.BOUGHT,
      acquiredAt: new Date("2025-01-05"),
      acquiredPrice: 1750000,
      purchaseUrl: "https://mothercare.co.id",
      storeName: "Mothercare Indonesia",
      kaffaAgeMonths: 5,
      status: ItemStatus.ACTIVE,
      isRecommended: true,
      tags: ["high-chair", "mpasi", "joie", "investasi-panjang"],
      createdBy: ayah.id,
      reviews: [
        {
          reviewerId: ayah.id,
          reviewerRole: ReviewerRole.AYAH,
          rating: 9,
          title: "Investasi jangka panjang untuk persiapan MPASI Kaffa",
          body: "Kokoh banget, bisa dipakai sampai umur 6 tahun. Ketinggian kursi dan nampan bisa diatur 5 tingkat.",
          pros: "Multi-fungsi 6-in-1, bantalan empuk mudah dilap",
          cons: "Ukurannya cukup besar di ruang makan",
          wouldBuyAgain: true,
          usageDuration: "2 bulan",
        },
      ],
    },
    {
      name: "Silicone Feeding Set Suction Plate & Spoon",
      brand: "Mushie",
      categoryId: categoryMap.get("perlengkapan-makan")!,
      subcategory: "Piring & Sendok MPASI",
      description: "Piring silikon dengan suction perekat kuat ke meja, bebas BPA, microwave safe, dan sendok lentur lembut untuk gusi bayi.",
      photos: [
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
      ],
      acquisitionType: AcquisitionType.BOUGHT,
      acquiredAt: new Date("2025-01-15"),
      acquiredPrice: 220000,
      purchaseUrl: "https://tokopedia.com",
      storeName: "Mushie Official",
      kaffaAgeMonths: 5,
      status: ItemStatus.ACTIVE,
      isRecommended: true,
      tags: ["mushie", "silikon", "suction-plate", "mpasi"],
      createdBy: ibu.id,
      reviews: [
        {
          reviewerId: ibu.id,
          reviewerRole: ReviewerRole.IBU,
          rating: 9,
          title: "Suction-nya nempel kuat, piring ga bisa dilempar Kaffa!",
          body: "Warna sage green-nya cantik bernuansa estetik, mudah dibersihkan dan tidak meninggalkan bau minyak.",
          pros: "Food grade silikon, suction kuat, tahan panas",
          cons: "Jangan dicuci dengan sabun berpewangi kuat agar tidak menyerap",
          wouldBuyAgain: true,
          usageDuration: "2 bulan",
        },
      ],
    },

    // --- 7. TIDUR & KAMAR ---
    {
      name: "Leaf Grow Baby Rocker & Bouncer",
      brand: "Nuna",
      categoryId: categoryMap.get("tidur-kamar")!,
      subcategory: "Bouncer & Ayunan",
      description: "Bouncer elegan dengan gerakan ayunan daun alami tanpa baterai atau suara motorik, mampu menahan beban hingga 60 kg.",
      photos: [
        "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80",
      ],
      acquisitionType: AcquisitionType.BOUGHT,
      acquiredAt: new Date("2024-08-01"),
      acquiredPrice: 3800000,
      purchaseUrl: "https://nuna.eu",
      storeName: "Nuna Official Store ID",
      kaffaAgeMonths: 0,
      status: ItemStatus.ACTIVE,
      isRecommended: true,
      tags: ["bouncer", "nuna", "tidur", "ayunan-tenang"],
      createdBy: ayah.id,
      reviews: [
        {
          reviewerId: ayah.id,
          reviewerRole: ReviewerRole.AYAH,
          rating: 10,
          title: "Kaffa tidur tenang sekali di sini saat siang hari",
          body: "Sekali dorong bisa goyang halus lebih dari 2 menit. Bahan organik katunnya adem dan desainnya sangat estetik di ruang keluarga.",
          pros: "Gerakan ayunan sangat natural, tahan sampai dewasa (60kg), tanpa listrik",
          cons: "Harga premium",
          wouldBuyAgain: true,
          usageDuration: "6 bulan",
        },
        {
          reviewerId: kaffa.id,
          reviewerRole: ReviewerRole.KAFFA,
          rating: 10,
          title: "Tempat bobo siang paling adem!",
          body: "Suka banget diayun-ayun pelan sampai ngantuk.",
          wouldBuyAgain: true,
        },
      ],
    },
    {
      name: "Sleep Soother White Noise Machine",
      brand: "Dreamegg",
      categoryId: categoryMap.get("tidur-kamar")!,
      subcategory: "Alat Bantu Tidur",
      description: "Mesin suara white noise portable dengan 24 pilihan suara menenangkan (detak jantung rahim, deburan ombak, hujan, lullaby).",
      photos: [
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
      ],
      acquisitionType: AcquisitionType.BOUGHT,
      acquiredAt: new Date("2024-08-10"),
      acquiredPrice: 320000,
      purchaseUrl: "https://tokopedia.com",
      storeName: "Dreamegg Audio",
      kaffaAgeMonths: 0,
      status: ItemStatus.ACTIVE,
      isRecommended: true,
      tags: ["white-noise", "sleep-training", "tidur-nyenyak"],
      createdBy: ibu.id,
      reviews: [
        {
          reviewerId: ibu.id,
          reviewerRole: ReviewerRole.IBU,
          rating: 9,
          title: "Meredam suara motor dan petir di luar rumah",
          body: "Kaffa ga gampang kaget terbangun lagi sejak pakai white noise machine ini. Baterai tahan 12 jam nonstop.",
          pros: "Bisa dibawa bepergian, ada lampu tidur hangat, suara jernih",
          cons: "Tombol agak kecil saat ruangan gelap",
          wouldBuyAgain: true,
          usageDuration: "6 bulan",
        },
      ],
    },

    // --- 8. PERLENGKAPAN TRAVEL ---
    {
      name: "Compact Travel Stroller Coya Cabin Size",
      brand: "Cybex",
      categoryId: categoryMap.get("perlengkapan-travel")!,
      subcategory: "Stroller & Kereta Dorong",
      description: "Stroller ultra-kompak dengan lipatan satu detik yang memenuhi standar kabin pesawat udara dan suspensi roda depan empuk.",
      photos: [
        "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80",
      ],
      acquisitionType: AcquisitionType.BOUGHT,
      acquiredAt: new Date("2024-11-01"),
      acquiredPrice: 4500000,
      purchaseUrl: "https://shopee.co.id",
      storeName: "Shopee Mall Cybex",
      kaffaAgeMonths: 3,
      status: ItemStatus.ACTIVE,
      isRecommended: true,
      tags: ["travel", "kabin-size", "stroller", "premium"],
      createdBy: ayah.id,
      reviews: [
        {
          reviewerId: ayah.id,
          reviewerRole: ReviewerRole.AYAH,
          rating: 9,
          title: "Ringan dan lipatnya serbaguna untuk masuk bagasi pesawat",
          body: "Lipatannya cabin size, manuver rodanya halus banget waktu dipake di mall maupun di trotoar jalan.",
          pros: "Suspensi empuk, lipat 1 tangan, bahan breathable",
          cons: "Harga lumayan tinggi",
          wouldBuyAgain: true,
          usageDuration: "4 bulan",
        },
      ],
    },
    {
      name: "Omni 360 Cool Air Mesh Gendongan Bayi",
      brand: "Ergobaby",
      categoryId: categoryMap.get("perlengkapan-travel")!,
      subcategory: "Gendongan Bayi / Carrier",
      description: "Gendongan ergonomis bersertifikat International Hip Dysplasia Institute dengan bahan jaring 3D mesh yang adem untuk cuaca tropis.",
      photos: [
        "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=800&q=80",
      ],
      acquisitionType: AcquisitionType.BOUGHT,
      acquiredAt: new Date("2024-09-10"),
      acquiredPrice: 2450000,
      purchaseUrl: "https://ergobaby.co.id",
      storeName: "Ergobaby Official Indonesia",
      kaffaAgeMonths: 1,
      status: ItemStatus.ACTIVE,
      isRecommended: true,
      tags: ["gendongan", "ergonomis", "m-shape", "cool-mesh"],
      createdBy: ayah.id,
      reviews: [
        {
          reviewerId: ayah.id,
          reviewerRole: ReviewerRole.AYAH,
          rating: 10,
          title: "Punggung dan bahu Ayah ga pegal walau gendong 2 jam!",
          body: "Distribusi beban ke pinggang sangat merata. Posisi duduk Kaffa selalu M-shape sempurna.",
          pros: "Sangat ergonomis, bahan mesh adem, bisa 4 posisi gendong",
          cons: "Memasang buckle belakang butuh sedikit latihan",
          wouldBuyAgain: true,
          usageDuration: "5 bulan",
        },
      ],
    },

    // --- 9. KESEHATAN & MEDIS ---
    {
      name: "ThermoScan 7 Digital Ear Thermometer IRT6520",
      brand: "Braun",
      categoryId: categoryMap.get("kesehatan-medis")!,
      subcategory: "Termometer Digital",
      description: "Termometer telinga presisi standar dokter anak dengan teknologi Age Precision dan ujung sensor yang sudah dihangatkan (pre-warmed tip).",
      photos: [
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
      ],
      acquisitionType: AcquisitionType.BOUGHT,
      acquiredAt: new Date("2024-08-01"),
      acquiredPrice: 850000,
      purchaseUrl: "https://tokopedia.com",
      storeName: "Braun Healthcare Official",
      kaffaAgeMonths: 0,
      status: ItemStatus.ACTIVE,
      isRecommended: true,
      tags: ["termometer", "braun", "demam", "akurat"],
      createdBy: ibu.id,
      reviews: [
        {
          reviewerId: ibu.id,
          reviewerRole: ReviewerRole.IBU,
          rating: 10,
          title: "Wajib punya di kotak P3K bayi!",
          body: "Hanya butuh 1 detik untuk baca suhu telinga waktu Kaffa tidur tanpa bikin dia terbangun rewel.",
          pros: "Sangat akurat, lampu indikator warna hijau-kuning-merah, cepat 1 detik",
          cons: "Perlu ganti lens filter pelindung secara berkala",
          wouldBuyAgain: true,
          usageDuration: "6 bulan",
        },
      ],
    },
    {
      name: "Electric Nasal Aspirator Penyedot Ingus Bayi",
      brand: "Little Giant",
      categoryId: categoryMap.get("kesehatan-medis")!,
      subcategory: "Alat Pernapasan",
      description: "Penyedot lendir hidung elektrik dengan daya hisap aman dan lembut, dilengkapi musik penenang dan lampu LED.",
      photos: [
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
      ],
      acquisitionType: AcquisitionType.BOUGHT,
      acquiredAt: new Date("2024-10-01"),
      acquiredPrice: 275000,
      purchaseUrl: "https://shopee.co.id",
      storeName: "Little Giant Baby",
      kaffaAgeMonths: 2,
      status: ItemStatus.ACTIVE,
      isRecommended: true,
      tags: ["nasal-aspirator", "pilek", "hidung-tersumbat", "medis"],
      createdBy: ibu.id,
      reviews: [
        {
          reviewerId: ibu.id,
          reviewerRole: ReviewerRole.IBU,
          rating: 9,
          title: "Kaffa bisa bernapas lega waktu flu pertama kali",
          body: "Ujung silikonnya sangat lentur tidak melukai rongga hidung. Mudah dibongkar untuk disterilkan.",
          pros: "Hisapan lembut tapi efektif, mudah dicuci, ada musik penenang",
          cons: "Suara motorik getar saat dinyalakan",
          wouldBuyAgain: true,
          usageDuration: "4 bulan",
        },
      ],
    },
  ];

  for (const item of itemsData) {
    const { reviews, ...itemFields } = item;
    await prisma.item.create({
      data: {
        ...itemFields,
        reviews: {
          create: reviews,
        },
      },
    });
  }

  console.log(`✅ Seeded ${itemsData.length} rich items across all 9 categories!`);

  // 4. Seed Wishlist
  const wishlistData = [
    {
      name: "Balance Bike Kayu 12 Inch",
      brand: "Kinderfeets",
      categoryId: categoryMap.get("mainan")!,
      notes: "Persiapan Kaffa latihan keseimbangan sepeda usia 1.5 tahun",
      purchaseUrl: "https://tokopedia.com",
      estimatedPrice: 1250000,
      priority: WishlistPriority.HIGH,
      status: WishlistStatus.WANTED,
      addedBy: ayah.id,
    },
    {
      name: "Montessori Wooden Bookshelf Display",
      brand: "Mamatomama",
      categoryId: categoryMap.get("tidur-kamar")!,
      notes: "Rak buku display hadap depan agar Kaffa gampang pilih buku sendiri",
      purchaseUrl: "https://shopee.co.id",
      estimatedPrice: 650000,
      priority: WishlistPriority.MEDIUM,
      status: WishlistStatus.WANTED,
      addedBy: ibu.id,
    },
    {
      name: "Sepatu Pre-Walker Barefoot Leather",
      brand: "Attipas",
      categoryId: categoryMap.get("pakaian")!,
      notes: "Untuk belajar jalan pertama kali di luar ruangan",
      purchaseUrl: "https://tokopedia.com",
      estimatedPrice: 299000,
      priority: WishlistPriority.MEDIUM,
      status: WishlistStatus.WANTED,
      addedBy: ibu.id,
    },
    {
      name: "Baby Food Thermal Jar 300ml",
      brand: "Thermos",
      categoryId: categoryMap.get("perlengkapan-makan")!,
      notes: "Wadah bubur tahan panas 6 jam untuk bepergian liburan",
      purchaseUrl: "https://tokopedia.com",
      estimatedPrice: 380000,
      priority: WishlistPriority.HIGH,
      status: WishlistStatus.WANTED,
      addedBy: ayah.id,
    },
  ];

  for (const w of wishlistData) {
    await prisma.wishlistItem.create({ data: w });
  }

  console.log(`✅ Seeded ${wishlistData.length} wishlist items`);
  console.log("🎉 Database seeding completed with rich, multi-category items!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
