import { auth } from "@/app/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const POST = async (request: NextRequest) => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { chat } = body;

    if (!chat || !String(chat).trim()) {
      return NextResponse.json({ error: "chat is required" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is missing in .env" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // مدل رایگان Gemini
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: "You are a helpful assistant.",
    });

    const result = await model.generateContent(String(chat).trim());
    const response = await result.response;
    const reply = response.text();

    if (!reply) {
      return NextResponse.json({ error: "No reply" }, { status: 500 });
    }

    return NextResponse.json({ reply });

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: error?.message || "Something went wrong" },
      { status: 500 }
    );
  }
};