import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Auth middleware — protects dashboard routes.
 *
 * Currently uses a simple cookie check (demo auth).
 * Replace with real session/JWT validation when implementing
 * proper authentication (NextAuth, Clerk, etc.).
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for auth cookie
  const authToken = request.cookies.get("sabeh-auth-token");

  // Protected routes: /dashboard and all sub-routes
  if (pathname.startsWith("/dashboard")) {
    if (!authToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If user is already logged in and visits /login, redirect to dashboard
  if (pathname === "/login" && authToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
