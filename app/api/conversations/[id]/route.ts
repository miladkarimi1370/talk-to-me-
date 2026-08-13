// app/api/conversations/[id]/route.ts
import { auth } from "@/app/lib/auth";
import { supabaseAdmin } from "@/app/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(
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

    // گرفتن طرف مقابل
    const { data: otherParticipant, error: oError } = await supabaseAdmin
      .from("conversation_participants")
      .select("users ( id, full_name, username, avatar_url, last_seen )")
      .eq("conversation_id", conversationId)
      .neq("user_id", userId)
      .single();

    if (oError) {
      console.error("Other participant error:", oError);
    }

    const otherUser = (otherParticipant as any)?.users || {};

    return NextResponse.json({
      id: conversationId,
      other_user: {
        id: otherUser.id || "",
        full_name: otherUser.full_name || "Unknown",
        username: otherUser.username || "",
        avatar_url: otherUser.avatar_url || null,
        last_seen: otherUser.last_seen || null,
      },
    });
  } catch (err: any) {
    console.error("GET /api/conversations/[id] error:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}