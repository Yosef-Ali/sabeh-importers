import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Auth middleware — protects dashboard and admin routes.
 *
 * Uses two cookies:
 *   sabeh-session   — httpOnly JWT (verified in server components via session.ts)
 *   sabeh-auth-token — non-httpOnly cookie storing the user's role,
 *                      readable here in the Edge runtime for fast role checks
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const role = request.cookies.get("sabeh-auth-token")?.value ?? null;
  // Both cookies must be present; a stale role cookie without a session token
  // means the session was cleared (e.g. logout or expiry) — treat as logged out.
  const hasSession = !!request.cookies.get("sabeh-session")?.value;
  const isLoggedIn = role !== null && hasSession;

  // ── Dashboard + seller pages: requires any authenticated user ───────────────
  const PROTECTED_PREFIXES = ["/dashboard", "/my-listings", "/messages", "/wishlist", "/saved-searches", "/onboarding"];
  const needsAuth = PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
  if (needsAuth) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── Admin: requires ADMIN or MANAGER role ──────────────────────────────────
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    const adminRoles = ["ADMIN", "MANAGER"];
    if (!adminRoles.includes(role!)) {
      // Logged in but not admin — force re-login with admin redirect
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      loginUrl.searchParams.set("reason", "insufficient_role");
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── Already logged-in user visiting public auth pages → redirect away ──────
  // Allow /login with reason=insufficient_role so they can re-authenticate.
  const PUBLIC_AUTH = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-email"];
  if (PUBLIC_AUTH.includes(pathname) && isLoggedIn) {
    if (pathname === "/login") {
      const reason = request.nextUrl.searchParams.get("reason");
      if (reason === "insufficient_role") {
        const response = NextResponse.next();
        response.cookies.delete("sabeh-auth-token");
        response.cookies.delete("sabeh-session");
        return response;
      }
    }
    // All other auth pages: redirect based on role
    const adminRoles = ["ADMIN", "MANAGER"];
    if (adminRoles.includes(role!)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protected routes
    "/dashboard",
    "/dashboard/:path*",
    "/my-listings",
    "/my-listings/:path*",
    "/messages",
    "/messages/:path*",
    "/wishlist",
    "/saved-searches",
    "/onboarding",
    "/admin",
    "/admin/:path*",
    // Public auth routes (redirect away if already logged in)
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
  ],
};
