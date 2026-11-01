"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSupabasePublicEnv } from "@/lib/supabase/env";
import { getRoleFromClaims, ROLE_HOME } from "@/lib/auth/roles";
import { getSiteUrl } from "@/lib/site-url";

const MIN_PASSWORD_LENGTH = 12;
const MAX_PASSWORD_LENGTH = 128;
function textField(form: FormData, name: string): string {
  const value = form.get(name);
  return typeof value === "string" ? value.trim() : "";
}
function passwordField(form: FormData, name: string): string {
  const value = form.get(name);
  return typeof value === "string" ? value : "";
}
function normalizedEmail(form: FormData, name: string): string {
  return textField(form, name).toLowerCase();
}
function validEmail(email: string): boolean {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function confirmationRedirect(): string {
  return new URL("/auth/confirm", getSiteUrl()).toString();
}

export async function signIn(formData: FormData) {
  if (!getSupabasePublicEnv()) redirect("/setup-required");
  const email = normalizedEmail(formData, "email");
  const password = passwordField(formData, "password");
  if (!validEmail(email) || !password) redirect("/login?error=missing_fields");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    if (error.code === "email_not_confirmed") redirect("/login?error=email_not_confirmed");
    redirect("/login?error=invalid_credentials");
  }

  const { data } = await supabase.auth.getClaims();
  const role = getRoleFromClaims(data?.claims);
  if (role) redirect(ROLE_HOME[role]);
  redirect("/access-pending");
}

export async function signUp(formData: FormData) {
  if (!getSupabasePublicEnv()) redirect("/setup-required");
  const fullName = textField(formData, "full_name");
  const email = normalizedEmail(formData, "signup_email");
  const password = passwordField(formData, "signup_password");
  const confirmation = passwordField(formData, "signup_password_confirmation");
  if (
    fullName.length < 2 ||
    fullName.length > 160 ||
    !validEmail(email) ||
    Array.from(password).length < MIN_PASSWORD_LENGTH ||
    Array.from(password).length > MAX_PASSWORD_LENGTH ||
    password !== confirmation
  ) redirect("/login?error=invalid_signup");

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: confirmationRedirect(),
      // Profile display data only; roles and permissions are never accepted from the browser.
      data: { full_name: fullName },
    },
  });
  if (error) {
    console.error("Supabase sign-up failed:", error.code);
    redirect("/login?error=signup_failed");
  }
  // Generic result prevents email-account enumeration.
  redirect("/login?message=check_email");
}

export async function resendSignupConfirmation(formData: FormData) {
  if (!getSupabasePublicEnv()) redirect("/setup-required");
  const email = normalizedEmail(formData, "email");
  if (!validEmail(email)) redirect("/login?error=invalid_email");

  const supabase = await createClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo: confirmationRedirect() },
  });
  if (error) console.error("Confirmation resend failed:", error.code);
  redirect("/login?message=check_email");
}
