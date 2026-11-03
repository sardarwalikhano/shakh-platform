"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireMerchantAccess } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";

function field(data: FormData, key: string): string {
  const value = data.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function createMerchantProduct(data: FormData) {
  const merchant = await requireMerchantAccess();
  const name = field(data, "name");
  const description = field(data, "description");
  const categoryId = field(data, "category_id") || null;
  const rawPrice = field(data, "price_iqd");
  const rawStock = field(data, "stock_quantity");
  const sku = field(data, "sku") || null;
  const unit = field(data, "unit") || "piece";
  const price = Number(rawPrice);
  const stock = rawStock === "" ? null : Number(rawStock);

  if (
    name.length < 2 || name.length > 180 || description.length > 2000 ||
    !/^\d+$/.test(rawPrice) || !Number.isSafeInteger(price) || price < 0 ||
    (stock !== null && (!/^\d+$/.test(rawStock) || !Number.isSafeInteger(stock) || stock < 0)) ||
    unit.length < 1 || unit.length > 32 || (sku !== null && sku.length > 120)
  ) redirect("/workspace/merchant/products?error=invalid");

  const supabase = await createClient();
  const { error } = await supabase.from("products").insert({
    store_id: merchant.storeId,
    category_id: categoryId,
    name,
    description: description || null,
    sku,
    price_iqd: price,
    stock_quantity: stock,
    unit,
    // status and is_available are intentionally omitted: PostgreSQL defaults
    // create a draft/unavailable-to-public record without widening INSERT grants.
  });

  if (error) {
    console.error("Merchant product insert failed:", error.code);
    redirect(error.code === "23505" ? "/workspace/merchant/products?error=sku_taken" : "/workspace/merchant/products?error=save_failed");
  }

  revalidatePath("/workspace/merchant/products");
  redirect("/workspace/merchant/products?saved=1");
}

/**
 * Merchants may pause/resume a published product, but cannot change its
 * moderation status. The database deliberately withholds UPDATE permission
 * on products.status from authenticated users.
 */
export async function setMerchantProductAvailability(data: FormData) {
  const merchant = await requireMerchantAccess();
  const productId = field(data, "product_id");
  const nextAvailable = field(data, "next_available");

  if (!/^[0-9a-f-]{36}$/i.test(productId) || !["true", "false"].includes(nextAvailable)) {
    redirect("/workspace/merchant/products?error=invalid");
  }

  const supabase = await createClient();
  const { data: updated, error } = await supabase
    .from("products")
    .update({ is_available: nextAvailable === "true" })
    .eq("id", productId)
    .eq("store_id", merchant.storeId)
    .eq("status", "published")
    .select("id")
    .maybeSingle();

  if (error || !updated) {
    console.error("Merchant product availability update failed:", error?.code ?? "published_product_not_found");
    redirect("/workspace/merchant/products?error=availability_failed");
  }

  revalidatePath("/workspace/merchant/products");
  revalidatePath("/marketplace");
  redirect("/workspace/merchant/products?saved=1");
}
