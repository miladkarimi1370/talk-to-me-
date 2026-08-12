import { auth } from "@/app/lib/auth";
import { supabaseAdmin } from "@/app/lib/supabase";

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { content, conversation_id, role } = body;

  if (!content || !conversation_id || !role) {
    return NextResponse.json(
      { error: "content و conversation_id و role الزامی هستند" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("messages")
    .insert([
      {
        content,
        conversation_id,
        role,
      },
    ])
    .select()
    .single();

  if (error) {

    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}




export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // گرفتن مقدار سرچ از URL
  const search = request.nextUrl.searchParams.get("content"); // مثلاً ?content=hello

  let query = supabaseAdmin
    .from("messages")
    .select("*")
    .order("created_at", { ascending: true }); // جدیدترین‌ها اول

  // اگر کاربر چیزی در سرچ نوشته بود
  if (search && search.trim().length > 0) {
    // جستجو در محتوای پیام (case-insensitive)
    query = query.ilike("content", `%${search.trim()}%`);
  } else {
    // اگر سرچ خالی بود → فقط آخرین پیام‌ها را محدود کن (مثلاً ۲۰ تا)
    query = query.limit(20);
  }

  const { data: messages, error } = await query;

  if (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // پیام‌ها را از جدید به قدیم برمی‌گردانیم (اگر خواستی می‌تونی برعکس کنی)
  return NextResponse.json(messages, { status: 200 });
}