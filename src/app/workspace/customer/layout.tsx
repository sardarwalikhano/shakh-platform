import type { ReactNode } from "react";
import { requireRoles } from "@/lib/auth/guards";

export default async function CustomerLayout({ children }: Readonly<{ children: ReactNode }>) {
  await requireRoles(["customer"]);
  return children;
}
