"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRoles } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function reviewMerchantApplication(formData: FormData) {
  await requireRoles(["admin", "super_admin"]);
  const applicationId = String(formData.get("application_id") ?? "").trim();
  const storeId = String(formData.get("store_id") ?? "").trim();
  const decision = String(formData.get("decision") ?? "").trim();
  const reviewNote = String(formData.get("review_note") ?? "").trim();
  const storeAction = decision === "suspend_store" || decision === "reactivate_store";

  if (!["start_review", "approve", "reject", "suspend_store", "reactivate_store"].includes(decision)) {
    redirect("/workspace/admin/merchant-applications?error=invalid");
  }
  if (reviewNote.length > 1200) redirect("/workspace/admin/merchant-applications?error=invalid");

  const body = storeAction
    ? (() => {
        if (!UUID_PATTERN.test(storeId)) redirect("/workspace/admin/merchant-applications?error=invalid");
        if (reviewNote.length < 2) redirect("/workspace/admin/merchant-applications?error=note_required");
        return { storeId, decision, reviewNote };
      })()
    : (() => {
        if (!UUID_PATTERN.test(applicationId)) redirect("/workspace/admin/merchant-applications?error=invalid");
        if (decision === "reject" && reviewNote.length < 2) redirect("/workspace/admin/merchant-applications?error=note_required");
        return { applicationId, decision, reviewNote };
      })();

  const supabase = await createClient();
  const { error } = await supabase.functions.invoke("review-merchant-application", { body });

  if (error) {
    console.error("Merchant moderation action failed:", error.message);
    redirect("/workspace/admin/merchant-applications?error=review_failed");
  }

  revalidatePath("/workspace/admin/merchant-applications");
  revalidatePath("/workspace/merchant-application");
  revalidatePath("/workspace/merchant");
  revalidatePath("/workspace/merchant/store");
  redirect(`/workspace/admin/merchant-applications?result=${decision}`);
}
