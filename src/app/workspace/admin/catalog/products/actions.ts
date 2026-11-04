"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRoles } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const VALID_STATUSES = ["draft", "published", "archived"] as const;
type ProductStatus = (typeof VALID_STATUSES)[number];

function field(formData: FormData, name: string): string {
  const raw = formData.get(name);
  return typeof raw === "string" ? raw.trim() : "";
}

function mapModerationError(message: string): string {
  const mappings: Array<[string, string]> = [
    ["ADMIN_REQUIRED", "not_allowed"],
    ["AUTH_REQUIRED", "not_allowed"],
    ["SUPER_ADMIN_REQUIRED_FOR_PLATFORM_STORE", "super_admin_required"],
    ["PRODUCT_NOT_FOUND", "not_found"],
    ["STORE_NOT_ACTIVE", "store_not_active"],
    ["PRODUCT_INCOMPLETE", "product_incomplete"],
    ["PRODUCT_CATEGORY_NOT_ACTIVE", "category_inactive"],
    ["PRODUCT_CHANGED_REFRESH_AND_REVIEW_AGAIN", "stale_review"],
    ["ARCHIVED_PRODUCT_MUST_RETURN_TO_DRAFT_FIRST", "invalid_transition"],
    ["INVALID_MODERATION_REASON", "note_required"],
    ["PRODUCT_ID_REQUIRED", "invalid"],
    ["INVALID_PRODUCT_STATUS", "invalid"],
    ["EXPECTED_PRODUCT_VERSION_REQUIRED", "stale_review"],
  ];
  return mappings.find(([marker]) => message.includes(marker))?.[1] ?? "update_failed";
}

export async function setAdminProductStatus(formData: FormData) {
  await requireRoles(["admin", "super_admin"]);

  const productId = field(formData, "product_id");
  const rawStatus = field(formData, "new_status");
  const rawExpectedUpdatedAt = field(formData, "expected_updated_at");
  const reason = field(formData, "reason");

  if (!UUID_PATTERN.test(productId) || !VALID_STATUSES.includes(rawStatus as ProductStatus)) {
    redirect("/workspace/admin/catalog/products?error=invalid");
  }

  if (reason.length < 2 || reason.length > 1200) {
    redirect("/workspace/admin/catalog/products?error=note_required");
  }

  const expectedTimestamp = Date.parse(rawExpectedUpdatedAt);
  if (!Number.isFinite(expectedTimestamp)) {
    redirect("/workspace/admin/catalog/products?error=stale_review");
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_set_product_status_v1", {
    p_product_id: productId,
    p_new_status: rawStatus,
    p_reason: reason,
    p_expected_updated_at: rawExpectedUpdatedAt,
  });

  if (error) {
    console.error("Product moderation failed:", error.code);
    redirect(
      `/workspace/admin/catalog/products?error=${mapModerationError(error.message)}`,
    );
  }

  revalidatePath("/workspace/admin/catalog/products");
  revalidatePath("/workspace/merchant/products");
  revalidatePath("/");
  redirect(`/workspace/admin/catalog/products?result=${rawStatus}`);
}
