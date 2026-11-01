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
  await supabase.auth.signOut({ scope: "local" });
  return NextResponse.redirect(new URL("/login?message=signed_out", request.url), 303);
}
