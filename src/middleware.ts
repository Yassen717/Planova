import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Protected paths
  const protectedPaths = [
    "/dashboard",
    "/projects",
    "/tasks",
    "/reports",
    "/users",
    "/api/projects",
    "/api/tasks",
    "/api/comments",
    "/api/notifications",
  ];

  // Check if path is protected
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected) {
    // Check for session token
    const token = request.cookies.get("authjs.session-token") || 
                  request.cookies.get("__Secure-authjs.session-token");

    if (!token) {
      const url = new URL("/auth/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|auth).*)",
  ],
};
