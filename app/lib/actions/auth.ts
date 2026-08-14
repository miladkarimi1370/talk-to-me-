
"use server";

import { RegisterSchema, RegisterInput } from "@/app/lib/validate";
import { supabaseAdmin } from "@/app/lib/supabase";
import bcrypt from "bcryptjs";
import { signIn } from "../auth";


export async function registerUser(data: RegisterInput) {
  // ۱. اعتبارسنجی
  const validated = RegisterSchema.safeParse(data);
  if (!validated.success) {
    return { error: "اطلاعات وارد شده معتبر نیست" };
  }


  const { full_name, email, password, username, avatar_url, bio } = validated.data;

  // ۲. چک کردن تکراری بودن ایمیل
  const { data: existingEmail } = await supabaseAdmin

    .from("users")
    .select("id")
    .eq("email", email)
    .single();


  if (existingEmail) {
    return { error: "این ایمیل قبلاً ثبت شده است" };
  }

  // ۳. چک کردن تکراری بودن username
  const { data: existingUsername } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("username", username)
    .single();

  if (existingUsername) {
    return { error: "این نام کاربری قبلاً ثبت شده است" };
  }

  // ۴. هش کردن پسورد
  const hashedPassword = await bcrypt.hash(password, 12);

  // ۵. ذخیره کاربر جدید
  const { data: newUser, error } = await supabaseAdmin
    .from("users")
    .insert({
      full_name,
      email,
      username,
      password: hashedPassword,
      avatar_url: avatar_url || null,
      bio: bio || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Register error:", error);
    return { error: "خطا در ثبت‌نام. دوباره تلاش کنید" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (err) {
    console.error("Auto login error:", err);
    return { success: true, message: "ثبت‌نام موفق. لطفاً وارد شوید." };
  }


  return { success: true };
}