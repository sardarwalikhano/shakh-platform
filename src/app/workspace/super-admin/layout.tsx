import type { ReactNode } from "react";
import { requireRoles } from "@/lib/auth/guards";

export default async function SuperAdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  await requireRoles(["super_admin"]);
  return children;
}
