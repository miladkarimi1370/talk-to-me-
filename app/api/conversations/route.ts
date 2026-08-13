import { auth } from "@/app/lib/auth";
import { supabaseAdmin } from "@/app/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const { data: myParticipants, error: pError } = await supabaseAdmin
      .from("conversation_participants")
      .select("conversation_id")
      .eq("user_id", userId);

    if (pError) {
      console.error("Participants error:", pError);
      return NextResponse.json({ error: pError.message }, { status: 500 });
    }

    if (!myParticipants || myParticipants.length === 0) {
      return NextResponse.json([]);
    }

    const conversationIds = myParticipants.map((p) => p.conversation_id);
    console.log("Found conversation IDs:", conversationIds.length, conversationIds);

    const { data: conversations, error: cError } = await supabaseAdmin
      .from("conversations")
      .select(
        `
        id, title, created_by, is_group, created_at, updated_at,
        conversation_participants!inner ( user_id, users ( id, full_name, username, avatar_url, last_seen ) ),
        messages ( id, content, created_at, sender_id, read_at )
      `
      )
      .in("id", conversationIds)
      .order("updated_at", { ascending: false });

    if (cError) {
      console.error("Conversations error:", cError);
      return NextResponse.json({ error: cError.message }, { status: 500 });
    }

    console.log("Raw conversations from DB:", conversations?.length || 0);

    const formatted = (conversations || []).map((conv: any) => {
      const other = conv.conversation_participants?.find(
        (p: any) => p.user_id !== userId
      );
      const otherUser = other?.users || {};

      const msgs = conv.messages || [];
      msgs.sort(
        (a: any, b: any) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      const lastMsg = msgs[0];

      const unreadCount = msgs.filter(
        (m: any) => m.sender_id !== userId && !m.read_at
      ).length;

      return {
        id: conv.id,
        title: conv.title,
        created_by: conv.created_by,
        is_group: conv.is_group,
        created_at: conv.created_at,
        updated_at: conv.updated_at,
        other_user: {
          id: otherUser.id || "",
          full_name: otherUser.full_name || "Unknown",
          username: otherUser.username || "",
          avatar_url: otherUser.avatar_url || null,
          last_seen: otherUser.last_seen || null,
        },
        last_message: lastMsg
          ? { content: lastMsg.content, created_at: lastMsg.created_at }
          : null,
        unread_count: unreadCount,
      };
    });

    console.log("Formatted conversations:", formatted.length);
    return NextResponse.json(formatted);
  } catch (err: any) {
    console.error("GET /api/conversations error:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { other_user_id } = await request.json();
    if (!other_user_id) {
      return NextResponse.json(
        { error: "other_user_id is required" },
        { status: 400 }
      );
    }

    const { data: myConvs } = await supabaseAdmin
      .from("conversation_participants")
      .select("conversation_id")
      .eq("user_id", session.user.id);

    const myConvIds = myConvs?.map((c) => c.conversation_id) || [];

    if (myConvIds.length > 0) {
      const { data: shared } = await supabaseAdmin
        .from("conversation_participants")
        .select("conversation_id")
        .in("conversation_id", myConvIds)
        .eq("user_id", other_user_id)
        .single();

      if (shared) {
        return NextResponse.json({ conversation_id: shared.conversation_id });
      }
    }

    const { data: conv, error: cErr } = await supabaseAdmin
      .from("conversations")
      .insert({})
      .select()
      .single();

    if (cErr || !conv) {
      return NextResponse.json(
        { error: cErr?.message || "Failed to create conversation" },
        { status: 500 }
      );
    }

    const { error: pErr } = await supabaseAdmin
      .from("conversation_participants")
      .insert([
        { conversation_id: conv.id, user_id: session.user.id },
        { conversation_id: conv.id, user_id: other_user_id },
      ]);

    if (pErr) {
      return NextResponse.json({ error: pErr.message }, { status: 500 });
    }

    return NextResponse.json({ conversation_id: conv.id }, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/conversations error:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}