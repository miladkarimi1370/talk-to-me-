// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./app/lib/auth";


export async function proxy(req: NextRequest) {
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const { pathname } = req.nextUrl;



  // مسیرهای عمومی
  const isPublic =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/api/auth");

  // اگر لاگین نیست و مسیر عمومی هم نیست → برو لاگین
  if (!isLoggedIn && !isPublic) {
<<<<<<< HEAD

=======
    console.log("Redirecting to /login");
>>>>>>> 292af5e (add complete project)
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // اگر لاگین هست و می‌خواد بره لاگین یا ثبت‌نام → برو چت
  if (isLoggedIn && (pathname === "/login" || pathname === "/register")) {
<<<<<<< HEAD

=======
    console.log("Redirecting to /chat");
>>>>>>> 292af5e (add complete project)
    return NextResponse.redirect(new URL("/chat", req.url));
  }



  return NextResponse.next();
}

export const config = {
  matcher: [
    "/chat/:path*",
    "/profile/:path*",
    "/files/:path*",
    "/agents/:path*",
    "/login",
    "/register",
  ],
};