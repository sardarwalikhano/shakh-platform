import Link from "next/link";
import { redirect } from "next/navigation";
import { signUp } from "@/app/login/actions";
import { getAuthenticatedContext } from "@/lib/auth/guards";
import { ROLE_HOME } from "@/lib/auth/roles";
import { isSupabaseConfigured } from "@/lib/supabase/env";

type PageProps = { searchParams: Promise<{ error?: string; message?: string }> };

export default async function SignupPage({ searchParams }: PageProps) {
  const currentUser = await getAuthenticatedContext();
  if (currentUser?.role) redirect(ROLE_HOME[currentUser.role]);
  if (currentUser && !currentUser.role) redirect("/access-pending");
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
            <span className="section-kicker">CREATE YOUR ACCOUNT</span>
            <h1>دروستکردنی هەژمار</h1>
            <p>زانیارییەکانت پڕ بکەرەوە. هەژماری نوێ بە ڕۆڵی کڕیار دەست پێ دەکات.</p>
          </div>
          {!configured && <div className="auth-alert auth-alert--warning" role="status">پەیوەندی Supabase ڕێک نەخراوە.</div>}
          {params.error === "invalid_signup" && <div className="auth-alert auth-alert--error" role="alert">ناو و ئیمەیڵ بنووسە؛ وشەی نهێنی دەبێت ١٢–١٢٨ پیت بێت و دووبارەکردنەوەکەی یەکسان بێت.</div>}
          {params.error === "signup_failed" && <div className="auth-alert auth-alert--error" role="alert">دروستکردنی هەژمار سەرکەوتوو نەبوو. تکایە دواتر هەوڵبدەرەوە.</div>}
          {params.message === "check_email" && <div className="auth-alert auth-alert--success" role="status">ئەگەر ئەم ئیمەیڵە بۆ هەژمارێک تۆمارکرابێت، بەستەری پشتڕاستکردنەوە بۆی دەنێردرێت.</div>}
          <form action={signUp} className="auth-form">
            <label htmlFor="full_name">ناوی تەواو</label>
            <input id="full_name" name="full_name" type="text" autoComplete="name" minLength={2} maxLength={160} required disabled={!configured} />
            <label htmlFor="signup_email">ئیمەیڵ</label>
            <input id="signup_email" name="signup_email" type="email" autoComplete="email" maxLength={254} required disabled={!configured} placeholder="name@example.com" />
            <label htmlFor="signup_password">وشەی نهێنی</label>
            <input id="signup_password" name="signup_password" type="password" autoComplete="new-password" minLength={12} maxLength={128} required disabled={!configured} placeholder="لانیکەم ١٢ پیت" />
            <label htmlFor="signup_password_confirmation">دووبارە وشەی نهێنی بنووسە</label>
            <input id="signup_password_confirmation" name="signup_password_confirmation" type="password" autoComplete="new-password" minLength={12} maxLength={128} required disabled={!configured} placeholder="هەمان وشەی نهێنی" />
            <small className="auth-field-hint">وشەی نهێنییەکی درێژ و تایبەت بە SHAKH بەکاربهێنە.</small>
            <button className="button button--primary auth-submit" type="submit" disabled={!configured}>دروستکردنی هەژمار</button>
          </form>
          <p className="auth-back"><Link href="/login">هەژمارت هەیە؟ بچۆ ژوورەوە</Link></p>
          <p className="auth-back"><Link href="/">گەڕانەوە بۆ پەڕەی سەرەکی</Link></p>
        </section>
      </div>
    </main>
  );
}
