import { auth } from "@/app/lib/auth";
import { supabaseAdmin } from "@/app/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from("users")
      .select("id, full_name, username, email, avatar_url, last_seen")
      .eq("id", session.user.id)
      .single();

    if (error) {
      console.error("Profile GET error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Profile GET catch:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { full_name, username, avatar_url } = body;

    const { data, error } = await supabaseAdmin
      .from("users")
      .update({
        full_name,
        username,
        avatar_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", session.user.id)
      .select("id, full_name, username, email, avatar_url, last_seen")
      .single();

    if (error) {
      console.error("Profile PUT error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Profile PUT catch:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}