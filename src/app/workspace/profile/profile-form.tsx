"use client";

import { useActionState } from "react";
import { updateProfile, type ProfileActionState } from "./actions";

type ProfileFormProps = {
  fullName: string;
  phone: string;
  preferredLocale: string;
};

const INITIAL_STATE: ProfileActionState = {
  status: "idle",
  message: "",
};

export function ProfileForm({
  fullName,
  phone,
  preferredLocale,
}: ProfileFormProps) {
  const [state, formAction, pending] = useActionState(updateProfile, INITIAL_STATE);

  return (
    <form action={formAction} className="profile-form">
      <div className="profile-form-grid">
        <div className="profile-field profile-field--full">
          <label htmlFor="profile-full-name">ناوی تەواو</label>
          <input
            id="profile-full-name"
            name="full_name"
            type="text"
            autoComplete="name"
            minLength={2}
            maxLength={160}
            defaultValue={fullName}
            required
          />
          <small>ئەم ناوە لە ناساندنی هەژمارەکەتدا بەکاردێت.</small>
        </div>

        <div className="profile-field">
          <label htmlFor="profile-phone">ژمارەی مۆبایل</label>
          <input
            id="profile-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            maxLength={32}
            defaultValue={phone}
            placeholder="+964 7xx xxx xxxx"
            dir="ltr"
          />
          <small>بە کۆدی وڵات بنووسە، ئەگەر هەیە.</small>
        </div>

        <div className="profile-field">
          <label htmlFor="profile-locale">زمانی پەسەندکراو</label>
          <select
            id="profile-locale"
            name="preferred_locale"
            defaultValue={preferredLocale}
          >
            <option value="ckb">کوردیی سۆرانی</option>
            <option value="ar">العربية</option>
            <option value="en">English</option>
          </select>
          <small>ڕێکخستنی زمان بۆ ئەزموونی بەکارهێنانە.</small>
        </div>
      </div>

      {state.message && (
        <p
          className={`profile-form-message profile-form-message--${state.status}`}
          role={state.status === "error" ? "alert" : "status"}
          aria-live="polite"
        >
          {state.message}
        </p>
      )}

      <div className="profile-form-footer">
        <span>تەنها زانیارییە کەسییەکانت نوێ دەکرێنەوە.</span>
        <button className="button button--primary profile-save" type="submit" disabled={pending}>
          {pending ? "لە نوێکردنەوەدایە..." : "پاشەکەوتکردنی گۆڕانکارییەکان"}
        </button>
      </div>
    </form>
  );
}
