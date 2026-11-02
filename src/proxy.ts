import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  const requiresAuth = request.nextUrl.pathname === "/workspace" || request.nextUrl.pathname.startsWith("/workspace/");
  return updateSession(request, requiresAuth);
}

export const config = {
  matcher: [
    /*
     * Refresh the Supabase session on public pages too, so navigating back
     * to the storefront does not leave auth cookies stale. Exclude static assets.
     */
    "/((?!_next/static|_next/image|favicon.ico|icons/|manifest.webmanifest|sw.js|offline).*)",
  ],
};
