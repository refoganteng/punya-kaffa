# PRD — Punya Kaffa
**Product Requirements Document v1.1**
Tanggal: Agustus 2026 | Update: Tailwind v4 semantic tokens, dark/light mode

---

## 1. Ringkasan Produk

**Punya Kaffa** adalah aplikasi web pribadi keluarga untuk mengarsipkan seluruh barang yang pernah dimiliki, dibeli, atau diterima sebagai hadiah oleh Kaffa — dari masa bayi hingga dewasa. Aplikasi ini berfungsi sebagai *memory catalog* sekaligus *product review journal* keluarga, lengkap dengan rating, ulasan jujur, dan tautan pembelian.

**Tagline:** *Setiap barang punya cerita. Kaffa punya semuanya.*

---

## 2. Tujuan & Sasaran

| Tujuan | Indikator Keberhasilan |
|---|---|
| Arsip digital seluruh barang Kaffa | Semua barang tercatat dengan foto & metadata lengkap |
| Review jujur dari keluarga | Setiap barang memiliki minimal 1 ulasan |
| Referensi pembelian ulang | Link belanja aktif dapat diakses kapan saja |
| Kenangan tumbuh kembang | Timeline barang berdasarkan usia/tahun bisa dilihat kembali |

---

## 3. Pengguna (Roles)

### 3.1 User Roles

| Role | Deskripsi | Akses |
|---|---|---|
| **Admin** | Ayah (Refo) | Full access: CRUD semua data, manajemen user, konfigurasi sistem |
| **Orang Tua** | Ayah & Ibu | Tambah barang, buat ulasan, edit data milik sendiri |
| **Kaffa** | Pemilik barang | Lihat semua barang, buat ulasan sendiri (nanti kalau sudah besar) |

### 3.2 Persona

- **Ayah (Admin):** Ingin arsip rapi, bisa cari cepat, tahu mana barang yang worth it dibeli lagi.
- **Ibu:** Ingin catat dengan mudah, bisa upload foto langsung dari HP.
- **Kaffa (masa depan):** Ingin nostalgia, lihat barang-barang waktu kecil dengan review lucu dari dirinya sendiri.

---

## 4. Tech Stack

| Layer | Teknologi |
|---|---|
| **Frontend** | Next.js 15 (App Router) |
| **UI Components** | shadcn/ui |
| **Styling** | Tailwind CSS v4 |
| **Backend/API** | Next.js Route Handlers (API Routes) |
| **Database** | Supabase PostgreSQL |
| **Auth** | Supabase Auth (email/password + magic link) |
| **Storage** | Supabase Storage (foto barang) |
| **ORM** | Supabase JS Client (atau Prisma opsional) |
| **Deploy** | EdgeOne Pages (Tencent Cloud) via GitHub repository |
| **Runtime** | Edge-compatible (Next.js Edge Runtime untuk API kritis) |

### 4.1 Catatan EdgeOne Deployment
- Build output: `next export` static + serverless functions jika EdgeOne mendukung, atau pure static SSG dengan client-side Supabase calls.
- Jika EdgeOne support SSR: gunakan Next.js standalone output.
- Environment variables dikonfigurasi di EdgeOne dashboard.
- GitHub Actions untuk CI/CD pipeline ke EdgeOne.

---

## 5. Fitur Utama

### 5.1 Manajemen Barang (Item Catalog)

Setiap barang memiliki data:

| Field | Tipe | Keterangan |
|---|---|---|
| `name` | string | Nama barang |
| `brand` | string | Merek/brand |
| `category_id` | FK | Kategori barang |
| `subcategory` | string | Subkategori opsional |
| `description` | text | Deskripsi barang |
| `photos` | array | URL foto (Supabase Storage) |
| `acquisition_type` | enum | `bought` / `gift` / `hand_me_down` |
| `acquired_at` | date | Tanggal didapat |
| `acquired_price` | decimal | Harga beli (opsional, jika dibeli) |
| `gifted_by` | string | Nama pemberi (jika hadiah) |
| `purchase_url` | url | Link toko online |
| `store_name` | string | Nama toko/marketplace |
| `kaffa_age_months` | int | Usia Kaffa saat mendapatkan barang (bulan) |
| `status` | enum | `active` / `outgrown` / `donated` / `lost` |
| `is_recommended` | bool | Direkomendasikan untuk dibeli ulang? |
| `tags` | array | Tag bebas (e.g., "teething", "favorite", "alergi") |
| `created_by` | FK | User yang menambahkan |
| `created_at` | timestamp | — |

### 5.2 Kategori Barang

Kategori default (dapat dikustomisasi Admin):

```
📦 Pakaian
   ├── Baju Harian
   ├── Baju Tidur
   ├── Baju Pesta
   ├── Sepatu & Kaos Kaki
   └── Aksesori Pakaian

🧸 Mainan
   ├── Mainan Edukatif
   ├── Mainan Fisik/Motorik
   ├── Mainan Imajinasi
   └── Elektronik/Gadget Anak

📚 Buku
   ├── Board Book (0-2 tahun)
   ├── Picture Book
   └── Buku Cerita

🛁 Peralatan Mandi & Perawatan
   ├── Sabun & Sampo
   ├── Minyak & Lotion
   └── Aksesoris Mandi

💊 Suplemen & Vitamin
   ├── Vitamin Harian
   └── Suplemen Khusus

🍼 Perlengkapan Makan
   ├── MPASI Tools
   └── Peralatan Makan

🛏️ Perlengkapan Tidur & Kamar
   ├── Tempat Tidur & Bedding
   └── Peralatan Kamar

🧳 Perlengkapan Perjalanan
   ├── Stroller & Carrier
   └── Tas & Aksesoris Travel

💉 Kesehatan & Medis
   ├── Alat Kesehatan
   └── Obat-obatan

🎒 Perlengkapan Sekolah (nanti)
```

### 5.3 Sistem Review & Rating

Setiap barang bisa punya **multiple reviews** dari user berbeda:

| Field | Tipe | Keterangan |
|---|---|---|
| `item_id` | FK | Barang yang direview |
| `reviewer_id` | FK | User yang mereview |
| `reviewer_role` | enum | `ayah` / `ibu` / `kaffa` |
| `rating` | int (1-10) | Skala 1–10 |
| `title` | string | Judul singkat review |
| `body` | text | Ulasan panjang |
| `pros` | text | Kelebihan |
| `cons` | text | Kekurangan |
| `would_buy_again` | bool | Beli lagi? |
| `usage_duration` | string | Sudah dipakai berapa lama |
| `reviewed_at` | timestamp | — |

**Rating Display:**
- Rata-rata rating dari semua reviewer
- Breakdown per reviewer (Ayah: 8/10, Ibu: 9/10, Kaffa: 10/10)
- Badge "Kaffa Approved ⭐" jika Kaffa sendiri memberi rating ≥8

### 5.4 Timeline & Milestone

- View barang berdasarkan usia Kaffa (slider bulan)
- Milestone otomatis: "Barang pertama", "Favorit di usia 6 bulan", dll.
- Filter: "Barang saat newborn", "Barang saat bisa duduk", dll.

### 5.5 Wishlist & Shopping List

- Daftar barang yang ingin dibeli
- Status: `wanted` → `bought` → masuk katalog
- Bisa tambah dari link marketplace

### 5.6 Panel Admin

- Dashboard statistik: total barang, per kategori, per status
- Manajemen user & role assignment
- Manajemen kategori (tambah/edit/hapus)
- Export data (CSV/JSON)
- Backup & restore

---

## 6. Halaman & Navigasi

### 6.1 Struktur Halaman

```
/                          → Landing / Home (showcase barang terbaru & stats)
/catalog                   → Katalog semua barang (grid + filter + search)
/catalog/[id]              → Detail barang + semua review
/catalog/add               → Form tambah barang baru
/catalog/[id]/edit         → Edit barang
/categories                → Daftar & browse kategori
/categories/[slug]         → Barang dalam kategori tertentu
/timeline                  → View barang by usia Kaffa
/wishlist                  → Daftar wishlist
/reviews                   → Semua review (feed)
/profile                   → Profil user + review history
/admin                     → Dashboard admin
/admin/items               → CRUD semua barang
/admin/categories          → Manajemen kategori
/admin/users               → Manajemen user & role
/admin/settings            → Konfigurasi aplikasi
/auth/login                → Login
/auth/register             → Register (invite-only atau dibatasi admin)
```

---

## 7. Database Schema

### 7.1 ERD Ringkas

```
users
  id (uuid, PK)
  email
  full_name
  role: 'admin' | 'parent' | 'kaffa'
  avatar_url
  created_at

categories
  id (uuid, PK)
  name
  slug
  icon (emoji atau icon name)
  parent_id (nullable, FK → categories)  ← untuk subcategory
  sort_order
  created_at

items
  id (uuid, PK)
  name
  brand
  category_id (FK → categories)
  subcategory
  description
  photos (text[], array of URLs)
  acquisition_type: 'bought' | 'gift' | 'hand_me_down'
  acquired_at (date)
  acquired_price (decimal, nullable)
  gifted_by (nullable)
  purchase_url (nullable)
  store_name (nullable)
  kaffa_age_months (int)
  status: 'active' | 'outgrown' | 'donated' | 'lost'
  is_recommended (bool)
  tags (text[])
  created_by (FK → users)
  created_at
  updated_at

reviews
  id (uuid, PK)
  item_id (FK → items)
  reviewer_id (FK → users)
  reviewer_role: 'ayah' | 'ibu' | 'kaffa'
  rating (int, 1-10)
  title (nullable)
  body (text)
  pros (nullable)
  cons (nullable)
  would_buy_again (bool)
  usage_duration (nullable)
  created_at
  updated_at

wishlist_items
  id (uuid, PK)
  name
  brand (nullable)
  category_id (FK → categories)
  notes
  purchase_url (nullable)
  estimated_price (decimal, nullable)
  priority: 'low' | 'medium' | 'high'
  status: 'wanted' | 'bought' | 'cancelled'
  added_by (FK → users)
  created_at
```

### 7.2 Supabase RLS Policy (ringkas)

```sql
-- Items: semua authenticated user bisa read
-- Items: parent & admin bisa insert
-- Items: hanya created_by atau admin yang bisa update/delete

-- Reviews: semua authenticated user bisa read
-- Reviews: semua bisa insert review milik sendiri
-- Reviews: hanya reviewer atau admin yang bisa edit/delete
```

---

## 8. UI/UX Design Direction

### 8.1 Identitas Visual

**Punya Kaffa** bukan app korporat — ini buku kenangan digital. Tone-nya hangat, personal, sedikit playful tapi tidak childish.

**Typography:**
- Display: `Playfair Display` — untuk nama barang, headings besar; berkarakter, nostalgik
- Body: `Plus Jakarta Sans` — bersih, readable, modern tapi tidak dingin
- Mono/label: `JetBrains Mono` — untuk harga, tanggal, tag

**Signature element:** Card barang menggunakan sudut yang sedikit *imperfect* (box-shadow asimetris ringan + slight rotation pada foto utama ±1-2°), seperti foto yang ditempel di scrapbook.

---

### 8.2 Design Token System — Tailwind CSS v4

> **Aturan mutlak: ZERO hardcoded color value di mana pun dalam codebase.**
> Semua warna harus referensi semantic token via CSS custom properties.
> Tailwind v4 `@theme` block menggantikan `tailwind.config.js`.

#### `app/globals.css`

```css
@import "tailwindcss";

@theme {
  /* ── Typography ── */
  --font-display: "Playfair Display", Georgia, serif;
  --font-sans:    "Plus Jakarta Sans", system-ui, sans-serif;
  --font-mono:    "JetBrains Mono", monospace;

  /* ── Semantic Color Tokens (Light Mode default) ──
     Semua token di bawah ini WAJIB dipakai. Jangan pakai nilai hex
     langsung di JSX/className. Tailwind v4 auto-generate utility
     classes dari token ini: bg-background, text-foreground, dll. */

  /* Backgrounds */
  --color-background:        oklch(98% 0.012 60);   /* warm off-white */
  --color-surface:           oklch(95% 0.018 60);   /* card background */
  --color-surface-raised:    oklch(92% 0.022 60);   /* hover/elevated */
  --color-overlay:           oklch(20% 0.02 60 / 50%);

  /* Foregrounds / Text */
  --color-foreground:        oklch(18% 0.025 60);   /* primary text */
  --color-foreground-muted:  oklch(50% 0.030 60);   /* secondary text */
  --color-foreground-subtle: oklch(68% 0.025 60);   /* placeholder */

  /* Brand — Primary (Terra Cotta) */
  --color-primary:           oklch(65% 0.14 42);
  --color-primary-hover:     oklch(60% 0.14 42);
  --color-primary-subtle:    oklch(93% 0.04 42);
  --color-primary-foreground: oklch(99% 0.005 60);

  /* Brand — Secondary (Teal) */
  --color-secondary:          oklch(52% 0.09 210);
  --color-secondary-hover:    oklch(47% 0.09 210);
  --color-secondary-subtle:   oklch(93% 0.03 210);
  --color-secondary-foreground: oklch(99% 0.005 60);

  /* Semantic States */
  --color-success:            oklch(55% 0.12 145);
  --color-success-subtle:     oklch(93% 0.04 145);
  --color-warning:            oklch(72% 0.15 75);
  --color-warning-subtle:     oklch(96% 0.04 75);
  --color-danger:             oklch(58% 0.18 25);
  --color-danger-subtle:      oklch(95% 0.04 25);

  /* Borders & Dividers */
  --color-border:             oklch(85% 0.022 60);
  --color-border-strong:      oklch(72% 0.030 60);
  --color-ring:               oklch(65% 0.14 42);   /* focus ring = primary */

  /* Scrapbook Signature */
  --color-stamp:              oklch(65% 0.14 42 / 12%);  /* watermark/stamp bg */
}

/* ── Dark Mode ──
   Semua token di-override, tidak ada nilai baru yang muncul. */
@media (prefers-color-scheme: dark) {
  :root {
    --color-background:        oklch(14% 0.018 60);
    --color-surface:           oklch(19% 0.022 60);
    --color-surface-raised:    oklch(24% 0.025 60);
    --color-overlay:           oklch(5% 0.01 60 / 60%);

    --color-foreground:        oklch(93% 0.015 60);
    --color-foreground-muted:  oklch(65% 0.025 60);
    --color-foreground-subtle: oklch(45% 0.020 60);

    --color-primary:           oklch(70% 0.13 42);
    --color-primary-hover:     oklch(75% 0.13 42);
    --color-primary-subtle:    oklch(25% 0.05 42);
    --color-primary-foreground: oklch(10% 0.01 60);

    --color-secondary:          oklch(60% 0.09 210);
    --color-secondary-hover:    oklch(65% 0.09 210);
    --color-secondary-subtle:   oklch(22% 0.04 210);
    --color-secondary-foreground: oklch(10% 0.01 60);

    --color-success:            oklch(62% 0.12 145);
    --color-success-subtle:     oklch(22% 0.05 145);
    --color-warning:            oklch(75% 0.14 75);
    --color-warning-subtle:     oklch(25% 0.05 75);
    --color-danger:             oklch(65% 0.17 25);
    --color-danger-subtle:      oklch(22% 0.06 25);

    --color-border:             oklch(28% 0.022 60);
    --color-border-strong:      oklch(40% 0.028 60);
    --color-ring:               oklch(70% 0.13 42);

    --color-stamp:              oklch(70% 0.13 42 / 10%);
  }
}

/* Support class-based dark mode toggle (untuk manual toggle) */
.dark {
  --color-background:        oklch(14% 0.018 60);
  --color-surface:           oklch(19% 0.022 60);
  /* ... (sama dengan @media dark di atas) */
}
```

#### Cara Pakai di Komponen

```tsx
// ✅ BENAR — semantic token
<div className="bg-background text-foreground">
<div className="bg-surface border border-border">
<button className="bg-primary text-primary-foreground hover:bg-primary-hover">
<p className="text-foreground-muted">

// ❌ SALAH — hardcoded, DILARANG
<div className="bg-[#FDFAF6] text-[#2C2416]">
<div style={{ backgroundColor: '#E8875A' }}>
<div className="bg-orange-400">        ← Tailwind palette langsung juga DILARANG
```

#### Token Reference Map

| Token Class | Light | Dark | Dipakai untuk |
|---|---|---|---|
| `bg-background` | warm off-white | very dark warm | Body/page background |
| `bg-surface` | warm cream | dark card | Card, panel, sidebar |
| `bg-surface-raised` | slightly darker | elevated card | Hover state, dropdown |
| `text-foreground` | dark brown | near-white | Teks utama |
| `text-foreground-muted` | medium brown | medium gray-warm | Teks sekunder, label |
| `text-foreground-subtle` | light warm gray | dim gray | Placeholder |
| `bg-primary` | terra cotta | brighter terra cotta | Button utama, badge |
| `text-primary` | terra cotta | brighter terra cotta | Link, icon aktif |
| `bg-primary-subtle` | pale terra cotta | dark terra cotta tint | Tag, chip background |
| `bg-secondary` | teal | brighter teal | Button sekunder |
| `bg-success-subtle` | pale green | dark green tint | Badge "Kaffa Approved" |
| `bg-danger-subtle` | pale red | dark red tint | Alert, error state |
| `border-border` | warm beige | dark warm | Border default |
| `ring-ring` | terra cotta | terra cotta | Focus outline |

---

### 8.3 Dark/Light Mode Toggle

```tsx
// components/ThemeToggle.tsx
// Menggunakan next-themes untuk class-based toggle
// Install: npm install next-themes

"use client";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="text-foreground-muted hover:text-foreground"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </Button>
  );
}
```

```tsx
// app/layout.tsx
import { ThemeProvider } from "next-themes";

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="bg-background text-foreground font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

---

### 8.4 shadcn/ui Theme Override

shadcn/ui v4 menggunakan CSS variables yang harus di-map ke token kita:

```css
/* Tambahkan di globals.css setelah @theme block */
:root {
  --background: var(--color-background);
  --foreground: var(--color-foreground);
  --card:        var(--color-surface);
  --card-foreground: var(--color-foreground);
  --popover:     var(--color-surface);
  --popover-foreground: var(--color-foreground);
  --primary:     var(--color-primary);
  --primary-foreground: var(--color-primary-foreground);
  --secondary:   var(--color-secondary-subtle);
  --secondary-foreground: var(--color-foreground);
  --muted:       var(--color-surface-raised);
  --muted-foreground: var(--color-foreground-muted);
  --accent:      var(--color-primary-subtle);
  --accent-foreground: var(--color-primary);
  --destructive: var(--color-danger);
  --border:      var(--color-border);
  --input:       var(--color-border);
  --ring:        var(--color-ring);
  --radius: 0.5rem;
}
```

### 8.5 Layout Katalog

```
┌─────────────────────────────────────┐
│  🔍 Search  [Kategori ▼] [Sort ▼]  │
├──────┬──────┬──────┬──────┬────────┤
│ Card │ Card │ Card │ Card │  ...   │  ← Grid 2/3/4 col responsive
│  ▪   │  ▪   │  ▪   │  ▪   │        │
│ foto │ foto │ foto │ foto │        │
│ nama │ nama │ nama │ nama │        │
│ ⭐8.5│ ⭐9.2│ ⭐7.0│ ⭐10 │        │
└──────┴──────┴──────┴──────┴────────┘
```

### 8.6 Detail Barang

```
┌──────────────────────────────────────────┐
│  ← Back     [Edit] [Delete]              │
│                                          │
│  [Photo Gallery - 2:3 aspect ratio]      │
│   ○ ○ ● ○  ← dots navigator             │
│                                          │
│  Nama Barang           Status Badge      │
│  Brand • Kategori                        │
│  📅 Didapat: Jan 2025 (usia 3 bulan)    │
│  🛒 Dibeli di Tokopedia  [Beli Lagi →]  │
│  💰 Rp 125.000                           │
│                                          │
│  ──────── Ulasan Keluarga ────────       │
│                                          │
│  [Ayah]  ⭐⭐⭐⭐⭐⭐⭐⭐☆☆  8/10         │
│  "Oke banget, awet..."                   │
│  ✅ Beli lagi  |  Dipakai: 6 bulan      │
│                                          │
│  [Ibu]   ⭐⭐⭐⭐⭐⭐⭐⭐⭐☆  9/10         │
│  "Kaffa suka banget..."                  │
│                                          │
│  [+ Tulis Ulasan]                        │
│                                          │
│  ──── Tags ────                          │
│  #favorite  #newborn  #teething          │
└──────────────────────────────────────────┘
```

---

## 9. Fitur Per Fase

### Phase 1 — MVP (2–3 minggu)
- [ ] Setup Tailwind v4 `@theme` block + semantic token system
- [ ] Dark/light mode via `next-themes` + class toggle
- [ ] shadcn/ui mapping ke semantic tokens
- [ ] Auth (login, logout, session)
- [ ] CRUD barang + upload foto ke Supabase Storage
- [ ] Kategori default (hard-coded seed)
- [ ] Review & rating (1-10)
- [ ] Katalog dengan search & filter kategori
- [ ] Detail barang
- [ ] Role dasar: admin & parent
- [ ] Deploy ke EdgeOne

### Phase 2 — Enhancement (1–2 minggu)
- [ ] Timeline view (by usia Kaffa)
- [ ] Wishlist
- [ ] Role Kaffa + review dari Kaffa
- [ ] Filter lanjutan (status, acquisition type, range usia)
- [ ] Panel admin lengkap
- [ ] Manajemen kategori dari UI

### Phase 3 — Polish & Fun (future)
- [ ] "Kaffa Approved" badge system
- [ ] Export PDF / cetak kenangan
- [ ] Milestone otomatis (barang pertama, barang di ulang tahun ke-1, dll.)
- [ ] Notifikasi (e.g., "Kaffa sudah outgrow pakaian ini?")
- [ ] Dark mode
- [ ] PWA (installable di HP)
- [ ] Backup otomatis ke Google Drive

---

## 10. Struktur Proyek Next.js

```
punya-kaffa/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (app)/
│   │   ├── layout.tsx              ← Sidebar + Topbar layout
│   │   ├── page.tsx                ← Home/Dashboard
│   │   ├── catalog/
│   │   │   ├── page.tsx            ← Grid katalog
│   │   │   ├── add/page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx        ← Detail
│   │   │       └── edit/page.tsx
│   │   ├── categories/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── timeline/page.tsx
│   │   ├── wishlist/page.tsx
│   │   └── reviews/page.tsx
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx                ← Dashboard stats
│   │   ├── items/page.tsx
│   │   ├── categories/page.tsx
│   │   └── users/page.tsx
│   └── api/
│       ├── items/route.ts
│       ├── items/[id]/route.ts
│       ├── reviews/route.ts
│       └── upload/route.ts
├── components/
│   ├── ui/                         ← shadcn components
│   ├── items/
│   │   ├── ItemCard.tsx
│   │   ├── ItemForm.tsx
│   │   ├── ItemGallery.tsx
│   │   └── ItemFilters.tsx
│   ├── reviews/
│   │   ├── ReviewCard.tsx
│   │   ├── ReviewForm.tsx
│   │   └── RatingStars.tsx
│   └── layout/
│       ├── Sidebar.tsx
│       └── Topbar.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts               ← Browser client
│   │   ├── server.ts               ← Server client
│   │   └── middleware.ts
│   └── utils.ts
├── types/
│   └── index.ts                    ← TypeScript types
├── public/
├── .github/
│   └── workflows/
│       └── deploy-edgeone.yml      ← CI/CD pipeline
├── next.config.ts
├── middleware.ts                   ← Auth guard
└── .env.local
```

---

## 11. Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # Server-side only

# App Config
NEXT_PUBLIC_APP_NAME=Punya Kaffa
NEXT_PUBLIC_KAFFA_BIRTH_DATE=2024-10-01  # untuk hitung usia otomatis
```

---

## 12. GitHub Actions — Deploy ke EdgeOne

```yaml
# .github/workflows/deploy-edgeone.yml
name: Deploy to EdgeOne

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}

      - name: Deploy to EdgeOne Pages
        uses: TencentEdgeOne/pages-action@v1
        with:
          apiToken: ${{ secrets.EDGEONE_API_TOKEN }}
          projectName: punya-kaffa
          directory: .next   # atau 'out' jika static export
```

---

## 13. Non-Functional Requirements

| Aspek | Target |
|---|---|
| **Performance** | LCP < 2.5s, Lighthouse ≥ 90 |
| **Mobile** | Fully responsive, foto bisa diupload dari HP |
| **Security** | RLS Supabase aktif, service role key tidak terekspos |
| **Availability** | EdgeOne CDN global, uptime 99%+ |
| **Privacy** | Aplikasi private, hanya user terdaftar bisa akses |
| **Backup** | Supabase daily backup (plan free sudah include) |

---

## 14. Open Questions

1. **Tanggal lahir Kaffa** — perlu dikonfirmasi untuk kalkulasi usia otomatis.
2. **Invite system** — apakah register terbuka atau hanya via invite link dari Admin?
3. **EdgeOne plan** — perlu konfirmasi apakah pakai EdgeOne Pages (static) atau dengan Functions support untuk SSR.
4. **Review Kaffa** — sampai berapa tahun Kaffa bisa isi review sendiri? Perlu UI yang lebih child-friendly nanti?
5. **Foto limit** — berapa foto maksimal per barang? (Supabase free: 1GB storage)

---

## 15. Success Metrics

- Semua barang Kaffa berhasil terdokumentasi
- Setiap anggota keluarga aktif mengisi review
- Bisa dicari barang apa pun dalam < 5 detik
- Kaffa di masa depan bisa buka dan nostalgia dengan senang 🥹

---

*Dokumen ini adalah living document. Update sesuai perkembangan development.*