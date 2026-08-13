import { auth } from "@/app/lib/auth";
import { supabaseAdmin } from "@/app/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { content, conversation_id } = body;

  if (!content?.trim() || !conversation_id) {
    return NextResponse.json(
      { error: "content and conversation_id are required" },
      { status: 400 }
    );
  }

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
    .select()
    .single();

  if (error) {
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

  let query = supabaseAdmin
    .from("messages")
    .select("*")
    .eq("conversation_id", conversation_id)
    .is("deleted_at", null) // soft delete نمایش نده
    .order("created_at", { ascending: true });

  if (search?.trim()) {
    query = query.ilike("content", `%${search.trim()}%`);
  }

  const { data: messages, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(messages, { status: 200 });
}