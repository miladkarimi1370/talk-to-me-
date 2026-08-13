import { auth } from "@/app/lib/auth";
import { supabaseAdmin } from "@/app/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: conversationId } = await params;
    const userId = session.user.id;

    // چک کن کاربر توی این گفتگو هست
    const { data: participant, error: pError } = await supabaseAdmin
      .from("conversation_participants")
      .select("id")
      .eq("conversation_id", conversationId)
      .eq("user_id", userId)
      .single();

    if (pError || !participant) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // همه پیام‌های نخوانده (که sender من نیستم) رو خوانده کن
    const { error } = await supabaseAdmin
      .from("messages")
      .update({ read_at: new Date().toISOString() })
      .eq("conversation_id", conversationId)
      .neq("sender_id", userId)
      .is("read_at", null);

    if (error) {
      console.error("Mark read error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("POST /api/conversations/[id]/read error:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}