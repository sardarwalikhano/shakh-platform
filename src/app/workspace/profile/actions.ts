"use server";

import { revalidatePath } from "next/cache";
import { getAuthenticatedContext } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";

export type ProfileActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

const INITIAL_STATE: ProfileActionState = {
  status: "idle",
  message: "",
};

function readText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function updateProfile(
  previousState: ProfileActionState = INITIAL_STATE,
  formData: FormData,
): Promise<ProfileActionState> {
  void previousState;
  const user = await getAuthenticatedContext();
  if (!user || !user.role) {
    return {
      status: "error",
      message: "تکایە دووبارە بچۆرە ژوورەوە.",
    };
  }

  const fullName = readText(formData, "full_name");
  const phone = readText(formData, "phone");
  const preferredLocale = readText(formData, "preferred_locale");

  if (fullName.length < 2 || fullName.length > 160) {
    return {
      status: "error",
      message: "ناوی تەواو دەبێت لە نێوان ٢ تا ١٦٠ پیت بێت.",
    };
  }

  if (
    phone.length > 32 ||
    (phone !== "" && !/^\+?[0-9][0-9\s().-]{5,30}$/.test(phone))
  ) {
    return {
      status: "error",
      message: "ژمارەی مۆبایل بە شێوەیەکی دروست بنووسە.",
    };
  }

  if (!["ckb", "ar", "en"].includes(preferredLocale)) {
    return {
      status: "error",
      message: "زمانی هەڵبژێردراو پشتیوانی ناکرێت.",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      phone: phone || null,
      preferred_locale: preferredLocale,
    })
    .eq("id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Profile update failed:", error.code);
    return {
      status: "error",
      message: "نوێکردنەوەی پرۆفایل سەرکەوتوو نەبوو. تکایە دووبارە هەوڵبدەرەوە.",
    };
  }

  if (!data) {
    return {
      status: "error",
      message: "تۆماری پرۆفایل نەدۆزرایەوە. پەیوەندی بە بەڕێوەبەرەوە بکە.",
    };
  }

  revalidatePath("/workspace");
  revalidatePath("/workspace/profile");

  return {
    status: "success",
    message: "زانیارییەکانی پرۆفایل بە سەرکەوتوویی نوێکرانەوە.",
  };
}
