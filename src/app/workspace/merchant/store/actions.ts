"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireMerchantAccess } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";

function value(formData: FormData, field: string): string {
  const raw = formData.get(field);
  return typeof raw === "string" ? raw.trim() : "";
}

export async function updateMerchantStoreProfile(formData: FormData) {
  const merchant = await requireMerchantAccess();
  const name = value(formData, "name");
  const rawSlug = value(formData, "slug");
  const slug = rawSlug.toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/[-_]{2,}/g, "-").replace(/^[-_]+|[-_]+$/g, "");
  const description = value(formData, "description");
  const contactPerson = value(formData, "contact_person");
  const phone = value(formData, "phone");
  const city = value(formData, "city");
  const district = value(formData, "district");
  const addressLine = value(formData, "address_line");

  if (
    name.length < 2 || name.length > 160 ||
    slug.length < 2 || slug.length > 80 || !/^[a-z0-9]+([_-][a-z0-9]+)*$/.test(slug) ||
    description.length > 2000 ||
    contactPerson.length < 2 || contactPerson.length > 120 ||
    phone.length < 7 || phone.length > 32 ||
    city.length < 2 || city.length > 100 ||
    district.length < 2 || district.length > 120 ||
    addressLine.length < 3 || addressLine.length > 240
  ) redirect("/workspace/merchant/store?error=invalid");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("stores")
    .update({
      name,
      slug,
      description: description || null,
      contact_person: contactPerson,
      phone,
      city,
      district,
      address_line: addressLine,
    })
    .eq("owner_id", merchant.id)
    .eq("is_platform_store", false)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    console.error("Merchant store profile update failed:", error?.code ?? "not_found");
    if (error?.code === "23505") redirect("/workspace/merchant/store?error=slug_taken");
    redirect("/workspace/merchant/store?error=save_failed");
  }

  revalidatePath("/workspace/merchant");
  revalidatePath("/workspace/merchant/store");
  redirect("/workspace/merchant/store?saved=1");
}
