import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSupabasePublicEnv } from "@/lib/supabase/env";
import { getRoleFromClaims, ROLE_HOME, type UserRole } from "@/lib/auth/roles";

export type AuthenticatedContext = {
  id: string;
  email: string | null;
  role: UserRole | null;
};

export async function getAuthenticatedContext(): Promise<AuthenticatedContext | null> {
  if (!getSupabasePublicEnv()) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error) return null;

  const claims = data?.claims as Record<string, unknown> | undefined;
  if (!claims || typeof claims.sub !== "string") return null;

  return {
    id: claims.sub,
    email: typeof claims.email === "string" ? claims.email : null,
    role: getRoleFromClaims(claims),
  };
}

export async function requireAuthenticatedContext() {
  const context = await getAuthenticatedContext();
  if (!context) redirect("/login");
  if (!context.role) redirect("/access-pending");
  return context as AuthenticatedContext & { role: UserRole };
}

export async function requireMerchantAccess() {
  const context = await requireAuthenticatedContext();
  if (!["restaurant", "supermarket", "produce_vendor", "meat_seafood_vendor"].includes(context.role)) {
    redirect(ROLE_HOME[context.role]);
  }

  const supabase = await createClient();
  const { data: store, error } = await supabase
    .from("stores")
    .select("id,status")
    .eq("owner_id", context.id)
    .eq("is_platform_store", false)
    .maybeSingle();

  if (error || !store) {
    console.error("Merchant access store check failed:", error?.code ?? "store_not_found");
    redirect("/access-pending");
  }
  if (store.status !== "active") redirect("/merchant-suspended");

  return context as AuthenticatedContext & { role: UserRole };
}

export async function requireRoles(allowedRoles: readonly UserRole[]) {
  const context = await requireAuthenticatedContext();
  if (!allowedRoles.includes(context.role)) redirect(ROLE_HOME[context.role]);
  return context;
}
