import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSupabasePublicEnv } from "@/lib/supabase/env";
import { getSiteUrl } from "@/lib/site-url";
import { isSupabaseConfigured } from "@/lib/supabase/env";

type PageProps = { searchParams: Promise<{ error?: string; message?: string }> };

async function requestPasswordReset(formData: FormData) {
  "use server";
  if (!getSupabasePublicEnv()) redirect("/setup-required");
  const rawEmail = formData.get("email");
  const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    redirect("/forgot-password?error=invalid_email");
  }
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: new URL("/auth/confirm?flow=recovery", getSiteUrl()).toString(),
  });
  if (error) console.error("Password reset request failed:", error.code);
  // Generic response prevents account enumeration.
  redirect("/forgot-password?message=requested");
}

export default async function ForgotPasswordPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const configured = isSupabaseConfigured();
  return (
    <main className="auth-page">
      <div className="auth-wrap auth-wrap--single">
        <Link className="auth-brand" href="/">
          <span className="brand-mark">ش</span>
          <span><strong>SHAKH</strong><small>بازاڕی یەکگرتوو</small></span>
        </Link>
        <section className="auth-panel auth-panel--standalone">
          <div className="auth-panel-heading">
            <span className="section-kicker">ACCOUNT RECOVERY</span>
            <h1>وشەی نهێنی لەبیرچووە؟</h1>
            <p>ئیمەیڵی هەژمارەکەت بنووسە. ئەگەر هەژمارەکە بوونی هەبێت، بەستەری گۆڕینی وشەی نهێنیت بۆ دەنێردرێت.</p>
          </div>
          {!configured && <div className="auth-alert auth-alert--warning" role="status">پەیوەندی Supabase ڕێک نەخراوە.</div>}
          {params.error === "invalid_email" && <div className="auth-alert auth-alert--error" role="alert">ئیمەیڵێکی دروست بنووسە.</div>}
          {params.error === "invalid_link" && <div className="auth-alert auth-alert--error" role="alert">بەستەرەکە بەسەرچووە یان دروست نییە. داوای بەستەرێکی نوێ بکە.</div>}
          {params.message === "requested" && <div className="auth-alert auth-alert--success" role="status">ئەگەر ئەم ئیمەیڵە بە هەژمارێکەوە بەستراوە، ڕێنمایی گۆڕینی وشەی نهێنی دەنێردرێت.</div>}
          <form action={requestPasswordReset} className="auth-form">
            <label htmlFor="recovery-email">ئیمەیڵ</label>
            <input id="recovery-email" name="email" type="email" autoComplete="email" maxLength={254} required disabled={!configured} placeholder="name@example.com" />
            <button className="button button--primary auth-submit" type="submit" disabled={!configured}>ناردنی بەستەری گەڕاندنەوە</button>
          </form>
          <p className="auth-back"><Link href="/login">گەڕانەوە بۆ چوونەژوورەوە</Link></p>
        </section>
      </div>
    </main>
  );
}
