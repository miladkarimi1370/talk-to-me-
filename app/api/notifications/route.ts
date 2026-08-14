import { auth } from "@/app/lib/auth";
import { supabaseAdmin } from "@/app/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from("notifications")
      .select("id, title, content, read, created_at")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      // اگه جدول وجود نداره، ارور نده — فقط خالی برگردون
      if (error.message?.includes("does not exist")) {
        console.warn("Notifications table not found, returning empty");
        return NextResponse.json([]);
      }
      console.error("Notifications error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (err: any) {
    console.error("GET /api/notifications error:", err);
    return NextResponse.json([], { status: 200 }); 
  }
}