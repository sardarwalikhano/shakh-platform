import type { EmailOtpType } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabasePublicEnv } from "@/lib/supabase/env";
import { getRoleFromClaims, ROLE_HOME } from "@/lib/auth/roles";

const EMAIL_OTP_TYPES = new Set<EmailOtpType>([
  "signup", "invite", "magiclink", "recovery", "email_change", "email",
]);

export async function GET(request: NextRequest) {
  if (!getSupabasePublicEnv()) return NextResponse.redirect(new URL("/setup-required", request.url));

  const code = request.nextUrl.searchParams.get("code");
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const rawType = request.nextUrl.searchParams.get("type");
  const supabase = await createClient();
  let confirmationError: string | null = null;

  // PKCE is the default for @supabase/ssr. Keep token_hash support for custom email templates.
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    confirmationError = error?.message ?? null;
  } else if (tokenHash && rawType && EMAIL_OTP_TYPES.has(rawType as EmailOtpType)) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: rawType as EmailOtpType });
    confirmationError = error?.message ?? null;
  } else {
    confirmationError = "Missing or invalid confirmation parameters.";
  }

  if (confirmationError) return NextResponse.redirect(new URL("/login?error=confirmation_failed", request.url));
  if (rawType === "recovery" || request.nextUrl.searchParams.get("flow") === "recovery") {
    return NextResponse.redirect(new URL("/reset-password", request.url));
  }

  const { data } = await supabase.auth.getClaims();
  const role = getRoleFromClaims(data?.claims);
  if (role) return NextResponse.redirect(new URL(ROLE_HOME[role], request.url));
  return NextResponse.redirect(new URL("/access-pending", request.url));
}
