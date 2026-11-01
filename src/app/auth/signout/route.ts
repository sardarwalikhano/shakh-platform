import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

export async function POST(request: NextRequest) {
  if (!getSupabasePublicEnv()) {
    return NextResponse.redirect(new URL("/setup-required", request.url));
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (data?.claims) await supabase.auth.signOut();

  return NextResponse.redirect(new URL("/login?message=signed_out", request.url));
}
