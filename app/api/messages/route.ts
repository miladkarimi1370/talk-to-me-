import { auth } from "@/app/lib/auth";
import { supabaseAdmin } from "@/app/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const conversationId = request.nextUrl.searchParams.get("conversation_id");
    if (!conversationId) return NextResponse.json({ error: "Missing conversation_id" }, { status: 400 });

    const { data, error } = await supabaseAdmin
      .from("messages")
      .select("id, conversation_id, sender_id, content, created_at")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data || []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { conversation_id, content } = body;

    if (!conversation_id || !content?.trim()) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("messages")
      .insert({ conversation_id, sender_id: session.user.id, content: content.trim() })
      .select("id, conversation_id, sender_id, content, created_at")
      .single();

    if (error || !data) return NextResponse.json({ error: error?.message }, { status: 500 });

    await supabaseAdmin
      .from("conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", conversation_id);

    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}