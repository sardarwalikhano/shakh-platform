import Link from "next/link";
import { resendSignupConfirmation, signIn } from "@/app/login/actions";
import { redirect } from "next/navigation";
import { getAuthenticatedContext } from "@/lib/auth/guards";
import { ROLE_HOME } from "@/lib/auth/roles";
import { isSupabaseConfigured } from "@/lib/supabase/env";

type LoginPageProps = { searchParams: Promise<{ error?: string; message?: string }> };

const ERRORS: Record<string, string> = {
  missing_fields: "ئیمەیڵ و وشەی نهێنی بە شێوەیەکی دروست بنووسە.",
  invalid_email: "ناونیشانی ئیمەیڵ دروست نییە.",
  invalid_credentials: "ئیمەیڵ یان وشەی نهێنی دروست نییە.",
  email_not_confirmed: "پێش چوونەژوورەوە، ئیمەیڵەکەت پشتڕاست بکەرەوە.",
  invalid_signup: "ناو و ئیمەیڵ پێویستن؛ وشەی نهێنی دەبێت ١٢–١٢٨ پیت بێت و دووبارەکردنەوەکەی یەکسان بێت.",
  signup_failed: "تۆمارکردن ئێستا سەرکەوتوو نەبوو. تکایە دواتر هەوڵبدەرەوە.",
  confirmation_failed: "بەستەری پشتڕاستکردنەوە دروست نییە یان بەسەرچووە.",
};
const MESSAGES: Record<string, string> = {
  check_email: "ئەگەر ئەم ئیمەیڵە بۆ هەژمارێک تۆمارکرابێت، بەستەری پشتڕاستکردنەوە بۆی دەنێردرێت.",
  email_confirmed: "ئیمەیڵەکەت پشتڕاست کرایەوە. دەتوانیت بچیتە ژوورەوە.",
  password_updated: "وشەی نهێنی نوێکرایەوە. بە وشەی نهێنی نوێ بچۆرە ژوورەوە.",
  signed_out: "لە ئەم ئامێرەوە بە سەرکەوتوویی چوویتەدەرەوە.",
  signed_out_all: "هەموو دانیشتنەکانی هەژمارەکەت داخراون.",
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const currentUser = await getAuthenticatedContext();
  if (currentUser?.role) redirect(ROLE_HOME[currentUser.role]);
  if (currentUser && !currentUser.role) redirect("/access-pending");
  const params = await searchParams;
  const configured = isSupabaseConfigured();
  const showResend = params.message === "check_email" || params.error === "email_not_confirmed" || params.error === "confirmation_failed";

  return (
    <main className="auth-page">
      <div className="auth-wrap">
        <Link className="auth-brand" href="/">
          <span className="brand-mark">ش</span>
          <span><strong>SHAKH</strong><small>بازاڕی یەکگرتوو</small></span>
        </Link>
        <div className="auth-grid">
          <section className="auth-aside">
            <span className="auth-aside-kicker">SHAKH ACCOUNT · SECURE ACCESS</span>
            <h1>بەخێربێیت بۆ شوێنی کار و بازاڕەکەت.</h1>
            <p>بە هەژمارەکەت بچۆرە ژوورەوە بۆ بەڕێوەبردنی داواکاری، فرۆشگا، گەیاندن و خزمەتگوزارییەکان. هەژماری نوێ بە ڕۆڵی کڕیار دەست پێ دەکات؛ دەسەڵاتە تایبەتەکان تەنها لەلایەن بەڕێوەبەری گشتییەوە دەدرێن.</p>
            <div className="auth-aside-mark">ش</div>
            <span className="auth-aside-foot">لە یەک شوێن، بۆ هەمووان.</span>
          </section>
          <section className="auth-panel">
            <div className="auth-panel-heading">
              <span className="section-kicker">هەژماری SHAKH</span>
              <h2>چوونەژوورەوە</h2>
              <p>زانیاری هەژمارەکەت بنووسە بۆ بەردەوامبوون.</p>
            </div>
            {!configured && <div className="auth-alert auth-alert--warning" role="status">پەیوەندی Supabase تەواو نەکراوە. ڕێکخستنی publishable key پشکنە.</div>}
            {params.error && ERRORS[params.error] && <div className="auth-alert auth-alert--error" role="alert">{ERRORS[params.error]}</div>}
            {params.message === "password_updated_revoke_failed" && <div className="auth-alert auth-alert--warning" role="status">وشەی نهێنی نوێکرایەوە، بەڵام داخستنی هەموو دانیشتنەکانی تر پشتڕاست نەکرا. پاش چوونەژوورەوە، لە بەشی ئاسایشی هەژمار دانیشتنەکان پشکنە.</div>}
            {params.message && MESSAGES[params.message] && <div className="auth-alert auth-alert--success" role="status">{MESSAGES[params.message]}</div>}

            <form action={signIn} className="auth-form">
              <label htmlFor="email">ئیمەیڵ</label>
              <input id="email" name="email" type="email" autoComplete="email" required disabled={!configured} placeholder="name@example.com" />
              <label htmlFor="password">وشەی نهێنی</label>
              <input id="password" name="password" type="password" autoComplete="current-password" required disabled={!configured} placeholder="وشەی نهێنییەکەت" />
              <div className="auth-inline-link"><Link href="/forgot-password">وشەی نهێنیت لەبیرچووە؟</Link></div>
              <button className="button button--primary auth-submit" type="submit" disabled={!configured}>چوونەژوورەوە <span aria-hidden="true">←</span></button>
            </form>

            {showResend && (
              <div className="auth-resend-panel">
                <strong>ئیمەیڵت پێویستی بە پشتڕاستکردنەوەیە؟</strong>
                <form action={resendSignupConfirmation} className="auth-resend-form">
                  <label htmlFor="resend_email">ئیمەیڵ</label>
                  <input id="resend_email" name="email" type="email" autoComplete="email" required disabled={!configured} placeholder="name@example.com" />
                  <button className="button button--quiet" type="submit" disabled={!configured}>دووبارە ناردنەوەی بەستەر</button>
                </form>
              </div>
            )}

            <div className="auth-divider"><span>هەژمارت نییە؟</span></div>
            <Link className="button button--quiet auth-submit" href="/signup">دروستکردنی هەژمار</Link>

            <p className="auth-back"><Link href="/">گەڕانەوە بۆ پەڕەی سەرەکی</Link></p>
          </section>
        </div>
      </div>
    </main>
  );
}
