<<<<<<< HEAD
=======
// app/actions/auth.ts  (یا lib/actions/auth.ts)
>>>>>>> 292af5e (add complete project)
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

<<<<<<< HEAD
  const { full_name, email, password, username, avatar_url, bio } = validated.data;

  // ۲. چک کردن تکراری بودن ایمیل
  const { data: existingEmail } = await supabaseAdmin
=======
  const { fullName, email, password } = validated.data;

  // ۲. چک کردن تکراری بودن ایمیل
  const { data: existingUser } = await supabaseAdmin
>>>>>>> 292af5e (add complete project)
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

<<<<<<< HEAD
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
=======
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
>>>>>>> 292af5e (add complete project)
    })
    .select()
    .single();

  if (error) {
    console.error("Register error:", error);
    return { error: "خطا در ثبت‌نام. دوباره تلاش کنید" };
  }

<<<<<<< HEAD
  // ۶. بعد از ثبت‌نام موفق، کاربر رو لاگین کن
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
=======
  // ۵. بعد از ثبت‌نام موفق، کاربر رو لاگین کن
  await signIn("credentials", {
    email,
    password,
    redirect: false,
  });
>>>>>>> 292af5e (add complete project)

  return { success: true };
}