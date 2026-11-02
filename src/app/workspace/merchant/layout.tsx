import type { ReactNode } from "react";
import { requireMerchantAccess } from "@/lib/auth/guards";

export default async function MerchantLayout({ children }: Readonly<{ children: ReactNode }>) {
  await requireMerchantAccess();
  return children;
}
