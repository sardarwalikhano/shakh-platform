import type { ReactNode } from "react";
import { requireRoles } from "@/lib/auth/guards";

export default async function CaptainLayout({ children }: Readonly<{ children: ReactNode }>) {
  await requireRoles(["captain"]);
  return children;
}
