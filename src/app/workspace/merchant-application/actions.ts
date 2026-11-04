"use server";

import { redirect } from "next/navigation";
import { requireRoles } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";

const CATEGORIES = ["restaurant", "supermarket", "fruits_vegetables", "meat_seafood"] as const;
type MerchantCategory = (typeof CATEGORIES)[number];

function value(formData: FormData, field: string): string {
  const raw = formData.get(field);
  return typeof raw === "string" ? raw.trim() : "";
}

function slugValue(raw: string): string | null {
  if (!raw) return null;
  return raw
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/[-_]{2,}/g, "-")
    .replace(/^[-_]+|[-_]+$/g, "");
}

export async function submitMerchantApplication(formData: FormData) {
  await requireRoles(["customer"]);
  const businessName = value(formData, "business_name");
  const rawSlug = value(formData, "proposed_slug");
  const proposedSlug = slugValue(rawSlug);
  const category = value(formData, "merchant_category");
  const contactPerson = value(formData, "contact_person");
  const phone = value(formData, "phone");
  const city = value(formData, "city");
  const district = value(formData, "district");
  const addressLine = value(formData, "address_line");
  const description = value(formData, "description");

  const invalid =
    businessName.length < 2 || businessName.length > 160 ||
    (rawSlug.length > 0 && (!proposedSlug || proposedSlug.length < 2 || proposedSlug.length > 80 || !/^[a-z0-9]+([_-][a-z0-9]+)*$/.test(proposedSlug))) ||
    !CATEGORIES.includes(category as MerchantCategory) ||
    contactPerson.length < 2 || contactPerson.length > 120 ||
    phone.length < 7 || phone.length > 32 ||
    city.length < 2 || city.length > 100 ||
    district.length < 2 || district.length > 120 ||
    addressLine.length < 3 || addressLine.length > 240 ||
    description.length > 2000;

  if (invalid) redirect("/workspace/merchant-application?error=invalid");

  const supabase = await createClient();
  const { error } = await supabase.from("merchant_applications").insert({
    business_name: businessName,
    proposed_slug: proposedSlug,
    merchant_category: category as MerchantCategory,
    description: description || null,
    contact_person: contactPerson,
    phone,
    city,
    district,
    address_line: addressLine,
  });

  if (error) {
    console.error("Merchant application submission failed:", error.code);
    if (error.code === "23505") redirect("/workspace/merchant-application?error=already_pending");
    redirect("/workspace/merchant-application?error=submit_failed");
  }

  redirect("/workspace/merchant-application?submitted=1");
}
