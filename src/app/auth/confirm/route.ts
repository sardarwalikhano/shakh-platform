import type { EmailOtpType } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

const EMAIL_OTP_TYPES = new Set<EmailOtpType>([
  "signup", "invite", "magiclink", "recovery", "email_change", "email",
]);

export async function GET(request: NextRequest) {
  if (!getSupabasePublicEnv()) {
    return NextResponse.redirect(new URL("/setup-required", request.url));
  }

  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const rawType = request.nextUrl.searchParams.get("type");

  if (!tokenHash || !rawType || !EMAIL_OTP_TYPES.has(rawType as EmailOtpType)) {
    return NextResponse.redirect(new URL("/login?error=confirmation_failed", request.url));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: rawType as EmailOtpType,
  });

  if (error) {
    return NextResponse.redirect(new URL("/login?error=confirmation_failed", request.url));
  }

  return NextResponse.redirect(new URL("/access-pending", request.url));
}
