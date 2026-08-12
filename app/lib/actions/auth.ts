// app/actions/auth.ts  (یا lib/actions/auth.ts)
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

  const { fullName, email, password } = validated.data;

  // ۲. چک کردن تکراری بودن ایمیل
  const { data: existingUser } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (existingUser) {
    return { error: "این ایمیل قبلاً ثبت شده است" };
  }

  // ۳. هش کردن پسورد
  const hashedPassword = await bcrypt.hash(password, 12);

  // ۴. ذخیره کاربر جدید
  const { data: newUser, error } = await supabaseAdmin
    .from("users")
    .insert({
      name: fullName,          // چون در دیتابیس فیلد name داری
      email: email,
      password: hashedPassword,
      // image: null (اختیاری)
    })
    .select()
    .single();

  if (error) {
    console.error("Register error:", error);
    return { error: "خطا در ثبت‌نام. دوباره تلاش کنید" };
  }

  // ۵. بعد از ثبت‌نام موفق، کاربر رو لاگین کن
  await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  return { success: true };
}