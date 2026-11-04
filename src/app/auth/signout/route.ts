import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  let validOrigin = false;
  try {
    validOrigin = Boolean(origin) && new URL(origin as string).origin === request.nextUrl.origin;
  } catch {
    validOrigin = false;
  }
  if (!validOrigin) return new NextResponse("Forbidden", { status: 403 });
  if (!getSupabasePublicEnv()) return NextResponse.redirect(new URL("/setup-required", request.url), 303);

  const supabase = await createClient();
  const { error } = await supabase.auth.signOut({ scope: "local" });
  if (error) {
    console.error("Local sign-out failed:", error.code);
    return NextResponse.redirect(new URL("/workspace/security?error=local_signout_failed", request.url), 303);
  }
  return NextResponse.redirect(new URL("/login?message=signed_out", request.url), 303);
}
