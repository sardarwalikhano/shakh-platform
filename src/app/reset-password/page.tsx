import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getRecoveryAuthenticatedContext } from "@/lib/auth/guards";

type PageProps = { searchParams: Promise<{ error?: string }> };

async function updatePasswordFromRecovery(formData: FormData) {
  "use server";
  const context = await getRecoveryAuthenticatedContext();
  if (!context) redirect("/forgot-password?error=invalid_link");

  const rawPassword = formData.get("password");
  const rawConfirmation = formData.get("password_confirmation");
  const password = typeof rawPassword === "string" ? rawPassword : "";
  const confirmation = typeof rawConfirmation === "string" ? rawConfirmation : "";
  const length = Array.from(password).length;
  if (length < 12 || length > 128 || password !== confirmation) {
    redirect("/reset-password?error=invalid_password");
  }

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) redirect("/forgot-password?error=invalid_link");

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    console.error("Recovery password update failed:", error.code);
    redirect("/reset-password?error=update_failed");
  }
  const { error: revokeError } = await supabase.auth.signOut({ scope: "global" });
  if (revokeError) {
    console.error("Post-recovery session revocation failed:", revokeError.code);
    redirect("/login?message=password_updated_revoke_failed");
  }
  redirect("/login?message=password_updated");
}

export default async function ResetPasswordPage({ searchParams }: PageProps) {
  const user = await getRecoveryAuthenticatedContext();
  if (!user) redirect("/forgot-password?error=invalid_link");
  const params = await searchParams;

  return (
    <main className="auth-page">
      <div className="auth-wrap auth-wrap--single">
        <Link className="auth-brand" href="/">
          <span className="brand-mark">ش</span>
          <span><strong>SHAKH</strong><small>بازاڕی یەکگرتوو</small></span>
        </Link>
        <section className="auth-panel auth-panel--standalone">
          <div className="auth-panel-heading">
            <span className="section-kicker">SECURE YOUR ACCOUNT</span>
            <h1>وشەی نهێنیی نوێ</h1>
            <p>وشەی نهێنییەکی نوێ و تایبەت بۆ هەژمارەکەت دابنێ.</p>
          </div>
          {params.error === "invalid_password" && <div className="auth-alert auth-alert--error" role="alert">وشەی نهێنییەکان دەبێت یەکسان بن و لانیکەم ١٢ پیت بێت.</div>}
          {params.error === "update_failed" && <div className="auth-alert auth-alert--error" role="alert">نوێکردنەوە سەرکەوتوو نەبوو. تکایە دواتر داوای بەستەرێکی نوێ بکە.</div>}
          <form action={updatePasswordFromRecovery} className="auth-form">
            <label htmlFor="new-password">وشەی نهێنیی نوێ</label>
            <input id="new-password" name="password" type="password" autoComplete="new-password" minLength={12} maxLength={128} required />
            <label htmlFor="confirm-password">دووبارە وشەی نهێنی بنووسە</label>
            <input id="confirm-password" name="password_confirmation" type="password" autoComplete="new-password" minLength={12} maxLength={128} required />
            <button className="button button--primary auth-submit" type="submit">پاشەکەوتکردنی وشەی نهێنی</button>
          </form>
        </section>
      </div>
    </main>
  );
}
