"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSupabasePublicEnv } from "@/lib/supabase/env";
import { getRoleFromClaims, ROLE_HOME } from "@/lib/auth/roles";
import { getSiteUrl } from "@/lib/site-url";

function textField(form: FormData, name: string): string {
  const value = form.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function passwordField(form: FormData, name: string): string {
  const value = form.get(name);
  return typeof value === "string" ? value : "";
}

export async function signIn(formData: FormData) {
  if (!getSupabasePublicEnv()) redirect("/setup-required");

  const email = textField(formData, "email");
  const password = passwordField(formData, "password");
  if (!email || !password) redirect("/login?error=missing_fields");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect("/login?error=invalid_credentials");

  const { data } = await supabase.auth.getClaims();
  const role = getRoleFromClaims(data?.claims);
  if (role) redirect(ROLE_HOME[role]);
  redirect("/access-pending");
}

export async function signUp(formData: FormData) {
  if (!getSupabasePublicEnv()) redirect("/setup-required");

  const fullName = textField(formData, "full_name");
  const email = textField(formData, "signup_email");
  const password = passwordField(formData, "signup_password");
  if (!fullName || !email || password.length < 10) {
    redirect("/login?error=invalid_signup");
  }

  const emailRedirectTo = new URL("/auth/confirm", getSiteUrl()).toString();
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo,
      // Collect profile text only. No authorization role is accepted at signup.
      data: { full_name: fullName },
    },
  });

  if (error) redirect("/login?error=signup_failed");
  redirect("/login?message=check_email");
}
