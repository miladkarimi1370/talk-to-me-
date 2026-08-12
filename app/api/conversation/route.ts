import { auth } from "@/app/lib/auth"
import { supabaseAdmin } from "@/app/lib/supabase";

import { NextRequest, NextResponse } from "next/server"

export const GET = async (request: NextRequest) => {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized", status: 401 })
    }

    const content = request.nextUrl.searchParams.get("content");

    if (!content) {
        const { data: conversations, error } = await supabaseAdmin
            .from('conversations')
            .select('*')
            .eq("user_id", session.user.id)
            .order("updated_at", { ascending: false });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(conversations)
    } else {
        const { data: conversations, error } = await supabaseAdmin
            .from('conversations')
            .select('*')
            .eq("user_id", session.user.id)
            .ilike("title", content)
            .order("updated_at", { ascending: false })


        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(conversations)
    }

}

export const POST = async (request: NextRequest) => {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json({ error: "unauthorized", status: 401 })

    }
    const body = await request.json();

    const { title } = body;

    if (!title) {
        return NextResponse.json(
            { error: "title الزامی است" },
            { status: 400 }
        );
    }



    const { data: conversation, error } = await supabaseAdmin
        .from("conversations")
        .insert([
            {
                title,
                user_id: session.user.id,  
                is_favorite: false,
            },
        ])
        .select()
        .single();


    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(conversation, { status: 201 })
}