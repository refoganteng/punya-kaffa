import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRupiah(amount?: number): string {
  if (amount === undefined || amount === null) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatKaffaAge(months: number): string {
  if (months === 0) return "Newborn (0 bulan)";
  if (months < 12) return `${months} bulan`;
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  if (remMonths === 0) return `${years} tahun`;
  return `${years} thn ${remMonths} bln`;
}

export function calculateKaffaAgeInMonths(
  acquiredDateStr: string,
  birthDateStr: string = process.env.NEXT_PUBLIC_KAFFA_BIRTH_DATE || "2024-10-01"
): number {
  const birth = new Date(birthDateStr);
  const acquired = new Date(acquiredDateStr);
  let months = (acquired.getFullYear() - birth.getFullYear()) * 12;
  months -= birth.getMonth();
  months += acquired.getMonth();
  return months <= 0 ? 0 : months;
}
