"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRoles } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";

export async function reviewMerchantApplication(formData: FormData) {
  await requireRoles(["admin", "super_admin"]);
  const applicationId = typeof formData.get("application_id") === "string"
    ? String(formData.get("application_id")).trim()
    : "";
  const decision = typeof formData.get("decision") === "string"
    ? String(formData.get("decision")).trim()
    : "";
  const reviewNote = typeof formData.get("review_note") === "string"
    ? String(formData.get("review_note")).trim()
    : "";

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(applicationId)) {
    redirect("/workspace/admin/merchant-applications?error=invalid");
  }
  if (!["start_review", "approve", "reject"].includes(decision)) {
    redirect("/workspace/admin/merchant-applications?error=invalid");
  }
  if (decision === "reject" && (reviewNote.length < 2 || reviewNote.length > 1200)) {
    redirect("/workspace/admin/merchant-applications?error=note_required");
  }
  if (reviewNote.length > 1200) {
    redirect("/workspace/admin/merchant-applications?error=invalid");
  }

  const supabase = await createClient();
  const { error } = await supabase.functions.invoke("review-merchant-application", {
    body: { applicationId, decision, reviewNote },
  });

  if (error) {
    console.error("Merchant application review failed:", error.message);
    redirect("/workspace/admin/merchant-applications?error=review_failed");
  }

  revalidatePath("/workspace/admin/merchant-applications");
  revalidatePath("/workspace/merchant-application");
  revalidatePath("/workspace/merchant");
  redirect(`/workspace/admin/merchant-applications?result=${decision}`);
}
