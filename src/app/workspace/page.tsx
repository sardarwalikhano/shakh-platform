import { redirect } from "next/navigation";
import { requireAuthenticatedContext } from "@/lib/auth/guards";
import { ROLE_HOME } from "@/lib/auth/roles";

export default async function WorkspaceIndexPage() {
  const user = await requireAuthenticatedContext();
  redirect(ROLE_HOME[user.role]);
}
