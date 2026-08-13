import { auth } from "@/app/lib/auth";
import { supabaseAdmin } from "@/app/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const search = request.nextUrl.searchParams.get("q") || "";

    let query = supabaseAdmin
      .from("users")
      .select("id, full_name, username, avatar_url, last_seen")
      .neq("id", session.user.id);

    if (search.trim()) {
      query = query.or(
        `full_name.ilike.%${search.trim()}%,username.ilike.%${search.trim()}%`
      );
    }

    const { data, error } = await query.order("full_name", { ascending: true });

    if (error) {
      console.error("Supabase users error:", error);
      return NextResponse.json(
        { error: error.message, details: error },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (err: any) {
    console.error("GET /api/users error:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}