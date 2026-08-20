import * as React from "react";
import {
  Shirt,
  Baby,
  BookOpen,
  Droplets,
  Pill,
  Utensils,
  Bed,
  Luggage,
  Stethoscope,
  FolderTree,
  Package,
  LucideProps,
} from "lucide-react";

interface CategoryIconProps extends LucideProps {
  slug?: string;
  name?: string;
}

export function CategoryIcon({ slug = "", name = "", className = "w-5 h-5", ...props }: CategoryIconProps) {
  const identifier = (slug || name).toLowerCase();

  if (identifier.includes("pakaian") || identifier.includes("baju") || identifier.includes("clothing")) {
    return <Shirt className={className} {...props} />;
  }
  if (identifier.includes("mainan") || identifier.includes("toy") || identifier.includes("edukatif")) {
    return <Baby className={className} {...props} />;
  }
  if (identifier.includes("buku") || identifier.includes("book") || identifier.includes("cerita")) {
    return <BookOpen className={className} {...props} />;
  }
  if (identifier.includes("mandi") || identifier.includes("bath") || identifier.includes("perawatan")) {
    return <Droplets className={className} {...props} />;
  }
  if (identifier.includes("suplemen") || identifier.includes("vitamin") || identifier.includes("supplement")) {
    return <Pill className={className} {...props} />;
  }
  if (identifier.includes("makan") || identifier.includes("mpasi") || identifier.includes("food")) {
    return <Utensils className={className} {...props} />;
  }
  if (identifier.includes("tidur") || identifier.includes("kamar") || identifier.includes("bed")) {
    return <Bed className={className} {...props} />;
  }
  if (identifier.includes("travel") || identifier.includes("stroller") || identifier.includes("liburan")) {
    return <Luggage className={className} {...props} />;
  }
  if (identifier.includes("kesehatan") || identifier.includes("medis") || identifier.includes("health")) {
    return <Stethoscope className={className} {...props} />;
  }

  return <Package className={className} {...props} />;
}
