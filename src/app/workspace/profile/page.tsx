import { requireAuthenticatedContext } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "./profile-form";

const ROLE_LABELS: Record<string, string> = {
  super_admin: "بەڕێوەبەری گشتی",
  admin: "بەڕێوەبەر",
  restaurant: "خاوەنی خواردنگە",
  supermarket: "خاوەنی مارکێت",
  produce_vendor: "فرۆشیاری میوە و سەوزە",
  meat_seafood_vendor: "فرۆشیاری گۆشت و ماسی",
  captain: "کاپتنی گەیاندن",
  customer: "کڕیار",
};

export default async function ProfilePage() {
  const user = await requireAuthenticatedContext();
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("full_name, phone, preferred_locale, created_at")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !profile) {
    return (
      <section className="workspace-page">
        <span className="section-kicker">ACCOUNT PROFILE</span>
        <h1>پرۆفایلی من</h1>
        <div className="workspace-empty" role="alert">
          <strong>زانیاریی پرۆفایل بەردەست نییە</strong>
          <span>نەتوانرا تۆماری پرۆفایل بخوێندرێتەوە. دڵنیابە لە چوونەژوورەوە و پەیوەندی بە بەڕێوەبەرەوە بکە.</span>
        </div>
      </section>
    );
  }

  const displayName = profile.full_name?.trim() || "بەکارهێنەری SHAKH";
  const initials = displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.slice(0, 1))
    .join("") || "ش";
  const joinedDate = new Intl.DateTimeFormat("ckb-IQ", {
    dateStyle: "medium",
  }).format(new Date(profile.created_at));

  return (
    <section className="workspace-page profile-page">
      <div className="profile-page-heading">
        <div>
          <span className="section-kicker">ACCOUNT & PERSONAL DETAILS</span>
          <h1>پرۆفایلی من</h1>
          <p>زانیاریی کەسی و ڕێکخستنی هەژمارەکەت لە یەک شوێن بەڕێوەببە.</p>
        </div>
        <span className="profile-page-index">01 / ACCOUNT</span>
      </div>

      <div className="profile-layout">
        <aside className="profile-card profile-summary">
          <div className="profile-avatar" aria-label="نیشانی پرۆفایل">
            {initials}
          </div>
          <span className="profile-summary-label">هەژماری چالاک</span>
          <h2>{displayName}</h2>
          <p className="profile-summary-email" dir="ltr">{user.email ?? "ئیمەیڵ بەردەست نییە"}</p>
          <span className="profile-role-pill">{ROLE_LABELS[user.role] ?? "بەکارهێنەر"}</span>

          <div className="profile-summary-divider" />
          <div className="profile-summary-meta">
            <span>بەرواری دروستکردنی هەژمار</span>
            <strong>{joinedDate}</strong>
          </div>
          <div className="profile-summary-meta">
            <span>زمانی پەسەندکراو</span>
            <strong>
              {profile.preferred_locale === "ar"
                ? "العربية"
                : profile.preferred_locale === "en"
                  ? "English"
                  : "کوردیی سۆرانی"}
            </strong>
          </div>
        </aside>

        <div className="profile-main-column">
          <section className="profile-card profile-details">
            <div className="profile-section-heading">
              <div>
                <span className="section-kicker">PERSONAL INFORMATION</span>
                <h2>زانیاریی کەسی</h2>
                <p>بۆ نوێکردنەوەی زانیاریی پەیوەندیکردن، خانەکان بگۆڕە.</p>
              </div>
              <span className="profile-section-number">01</span>
            </div>

            <ProfileForm
              fullName={profile.full_name ?? ""}
              phone={profile.phone ?? ""}
              preferredLocale={profile.preferred_locale}
            />
          </section>

          <section className="profile-card profile-security">
            <span className="profile-security-icon" aria-hidden="true">⌑</span>
            <div>
              <h3>پاراستنی هەژمار</h3>
              <p>ئیمەیڵ و ڕۆڵی هەژمار لەم پەڕەیەدا ناخوازرێن و ناگۆڕدرێن. دەستکارییان تەنها لە ڕێگەی ڕێکاریی پشتڕاستکراوی هەژمار و بەڕێوەبەری باوەڕپێکراوەوە دەکرێت.</p>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
