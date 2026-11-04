import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSupabasePublicEnv } from "@/lib/supabase/env";
import { getRoleFromClaims, ROLE_HOME, type UserRole } from "@/lib/auth/roles";

export type AuthenticatedContext = {
  id: string;
  email: string | null;
  role: UserRole | null;
};

const RECOVERY_AUTH_MAX_AGE_SECONDS = 15 * 60;

function hasRecentRecoveryAuthentication(claims: Record<string, unknown>): boolean {
  const methods = claims.amr;
  if (!Array.isArray(methods)) return false;

  const nowSeconds = Math.floor(Date.now() / 1000);
  return methods.some((entry) => {
    if (!entry || typeof entry !== "object") return false;
    const method = entry as Record<string, unknown>;
    if (method.method !== "recovery" || typeof method.timestamp !== "number") return false;
    if (!Number.isFinite(method.timestamp)) return false;

    const ageSeconds = nowSeconds - method.timestamp;
    return ageSeconds >= 0 && ageSeconds <= RECOVERY_AUTH_MAX_AGE_SECONDS;
  });
}

async function readAuthenticatedContext(recoveryOnly = false): Promise<AuthenticatedContext | null> {
  if (!getSupabasePublicEnv()) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error) return null;

  const claims = data?.claims as Record<string, unknown> | undefined;
  if (!claims || typeof claims.sub !== "string") return null;

  // Password recovery must be tied to a recent, verified recovery authentication event.
  // A normal password-authenticated session must not be able to use the reset flow.
  if (recoveryOnly && !hasRecentRecoveryAuthentication(claims)) return null;

  return {
    id: claims.sub,
    email: typeof claims.email === "string" ? claims.email : null,
    role: getRoleFromClaims(claims),
  };
}

export async function getAuthenticatedContext(): Promise<AuthenticatedContext | null> {
  return readAuthenticatedContext();
}

export async function getRecoveryAuthenticatedContext(): Promise<AuthenticatedContext | null> {
  return readAuthenticatedContext(true);
}

export async function requireAuthenticatedContext() {
  const context = await getAuthenticatedContext();
  if (!context) redirect("/login");
  if (!context.role) redirect("/access-pending");
  return context as AuthenticatedContext & { role: UserRole };
}

export async function requireRoles(allowedRoles: readonly UserRole[]) {
  const context = await requireAuthenticatedContext();
  if (!allowedRoles.includes(context.role)) redirect(ROLE_HOME[context.role]);
  return context;
}
