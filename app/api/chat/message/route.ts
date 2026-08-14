import { auth } from "@/app/lib/auth";
import { supabaseAdmin } from "@/app/lib/supabase";
<<<<<<< HEAD
=======

>>>>>>> 292af5e (add complete project)
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth();

<<<<<<< HEAD
  if (!session?.user?.id) {
=======
  if (!session?.user) {
>>>>>>> 292af5e (add complete project)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
<<<<<<< HEAD
  const { content, conversation_id } = body;

  if (!content?.trim() || !conversation_id) {
    return NextResponse.json(
      { error: "content and conversation_id are required" },
=======
  const { content, conversation_id, role } = body;

  if (!content || !conversation_id || !role) {
    return NextResponse.json(
      { error: "content و conversation_id و role الزامی هستند" },
>>>>>>> 292af5e (add complete project)
      { status: 400 }
    );
  }

<<<<<<< HEAD
  // 🔒 چک کن کاربر توی این گفتگو شرکت داره
  const { data: participant } = await supabaseAdmin
    .from("conversation_participants")
    .select("id")
    .eq("conversation_id", conversation_id)
    .eq("user_id", session.user.id)
    .single();

  if (!participant) {
    return NextResponse.json(
      { error: "You are not a participant in this conversation" },
      { status: 403 }
    );
  }

  // 💾 ذخیره پیام
  const { data, error } = await supabaseAdmin
    .from("messages")
    .insert({
      content: content.trim(),
      conversation_id,
      sender_id: session.user.id,
      message_status: "sent",
    })
=======
  const { data, error } = await supabaseAdmin
    .from("messages")
    .insert([
      {
        content,
        conversation_id,
        role,
      },
    ])
>>>>>>> 292af5e (add complete project)
    .select()
    .single();

  if (error) {
<<<<<<< HEAD
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const conversation_id = searchParams.get("conversation_id");
  const search = searchParams.get("content"); // جستجو داخل پیام‌ها

  if (!conversation_id) {
    return NextResponse.json(
      { error: "conversation_id is required" },
      { status: 400 }
    );
  }

  // 🔒 چک کن کاربر توی این گفتگو هست
  const { data: participant } = await supabaseAdmin
    .from("conversation_participants")
    .select("id")
    .eq("conversation_id", conversation_id)
    .eq("user_id", session.user.id)
    .single();

  if (!participant) {
    return NextResponse.json(
      { error: "You are not a participant in this conversation" },
      { status: 403 }
    );
  }
=======

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
>>>>>>> 292af5e (add complete project)

  let query = supabaseAdmin
    .from("messages")
    .select("*")
<<<<<<< HEAD
    .eq("conversation_id", conversation_id)
    .is("deleted_at", null) // soft delete نمایش نده
    .order("created_at", { ascending: true });

  if (search?.trim()) {
    query = query.ilike("content", `%${search.trim()}%`);
=======
    .order("created_at", { ascending: true }); // جدیدترین‌ها اول

  // اگر کاربر چیزی در سرچ نوشته بود
  if (search && search.trim().length > 0) {
    // جستجو در محتوای پیام (case-insensitive)
    query = query.ilike("content", `%${search.trim()}%`);
  } else {
    // اگر سرچ خالی بود → فقط آخرین پیام‌ها را محدود کن (مثلاً ۲۰ تا)
    query = query.limit(20);
>>>>>>> 292af5e (add complete project)
  }

  const { data: messages, error } = await query;

  if (error) {
<<<<<<< HEAD
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

=======
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // پیام‌ها را از جدید به قدیم برمی‌گردانیم (اگر خواستی می‌تونی برعکس کنی)
>>>>>>> 292af5e (add complete project)
  return NextResponse.json(messages, { status: 200 });
}