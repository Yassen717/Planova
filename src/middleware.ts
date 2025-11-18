import { auth } from "@/lib/auth";

export default auth((req) => {
  if (!req.auth) {
    const { pathname } = req.nextUrl;
    const paths = ["/dashboard", "/projects", "/tasks", "/reports", "/users", "/api/projects", "/api/tasks", "/api/comments", "/api/notifications"];
    
    if (paths.some(p => pathname.startsWith(p))) {
      const url = new URL("/auth/login", req.url);
      url.searchParams.set("callbackUrl", pathname);
      return Response.redirect(url);
    }
  }
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - auth routes (login, register, error)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|auth).*)",
  ],
};
