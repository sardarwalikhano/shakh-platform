import type { ReactNode } from "react";
import { requireRoles } from "@/lib/auth/guards";
import { MERCHANT_ROLES } from "@/lib/auth/roles";

export default async function MerchantLayout({ children }: Readonly<{ children: ReactNode }>) {
  await requireRoles(MERCHANT_ROLES);
  return children;
}
