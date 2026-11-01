import type { UserRole } from "@/lib/auth/roles";
export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "بەڕێوەبەری گشتی",
  admin: "بەڕێوەبەر",
  restaurant: "خاوەنی خواردنگە",
  supermarket: "خاوەنی مارکێت",
  produce_vendor: "فرۆشیاری میوە و سەوزە",
  meat_seafood_vendor: "فرۆشیاری گۆشت و ماسی",
  captain: "کاپتنی گەیاندن",
  customer: "کڕیار",
};
export const ROLE_WORKSPACE_LABELS: Record<UserRole, string> = {
  super_admin: "بەڕێوەبردنی گشتی",
  admin: "ناوەندی بەڕێوەبردن",
  restaurant: "بەڕێوەبردنی خواردنگە",
  supermarket: "بەڕێوەبردنی مارکێت",
  produce_vendor: "بەڕێوەبردنی میوە و سەوزە",
  meat_seafood_vendor: "بەڕێوەبردنی گۆشت و ماسی",
  captain: "ناوەندی کاپتن",
  customer: "هەژماری کڕیار",
};
