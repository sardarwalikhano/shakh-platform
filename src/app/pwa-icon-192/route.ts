import { renderPwaIcon } from "@/lib/pwa/render-icon";

export const runtime = "edge";
export const dynamic = "force-static";

export function GET() {
  return renderPwaIcon(192);
}
