import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const COOKIE_NAME = "sabeh-session";
const ROLE_COOKIE = "sabeh-auth-token";
const SECRET = process.env.NEXTAUTH_SECRET || "sabeh-default-secret-change-in-production";

export type SessionPayload = {
  userId: string;
  role: string;
  email: string;
  name: string;
};

// ── Encode a signed token: base64url(payload).hmac ───────────────────────────
function signToken(payload: SessionPayload, expiresAt: number): string {
  const data = Buffer.from(JSON.stringify({ ...payload, exp: expiresAt })).toString("base64url");
  const sig = createHmac("sha256", SECRET).update(data).digest("base64url");
  return `${data}.${sig}`;
}

function verifyToken(token: string): (SessionPayload & { exp: number }) | null {
  try {
    const [data, sig] = token.split(".");
    if (!data || !sig) return null;

    const expected = createHmac("sha256", SECRET).update(data).digest("base64url");
    // Timing-safe comparison
    const sigBuf = Buffer.from(sig);
    const expBuf = Buffer.from(expected);
    if (sigBuf.length !== expBuf.length) return null;
    if (!timingSafeEqual(sigBuf, expBuf)) return null;

    const payload = JSON.parse(Buffer.from(data, "base64url").toString());
    if (payload.exp < Date.now()) return null; // expired
    return payload;
  } catch {
    return null;
  }
}

// ── Write session cookies ─────────────────────────────────────────────────────
export async function createSessionWithLegacyCookie(payload: SessionPayload) {
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  const token = signToken(payload, expiresAt);

  const cookieOpts = {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  };

  const jar = cookies();
  // httpOnly JWT-like token (never readable by JS)
  jar.set(COOKIE_NAME, token, { ...cookieOpts, httpOnly: true });
  // Non-httpOnly role cookie for Edge middleware fast-path
  jar.set(ROLE_COOKIE, payload.role, { ...cookieOpts, httpOnly: false });
}

// ── Read and verify the session ───────────────────────────────────────────────
export function getSession(): SessionPayload | null {
  try {
    const token = cookies().get(COOKIE_NAME)?.value;
    if (!token) return null;
    const payload = verifyToken(token);
    if (!payload) return null;
    return { userId: payload.userId, role: payload.role, email: payload.email, name: payload.name };
  } catch {
    return null;
  }
}

// ── Full user row (for server components that need DB data) ───────────────────
export async function getCurrentUser() {
  const session = getSession();
  if (!session) return null;

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.userId),
    columns: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      avatar: true,
      isActive: true,
      verificationStatus: true,
      createdAt: true,
    },
  });

  if (!user || !user.isActive) return null;
  return user;
}

// ── Logout ────────────────────────────────────────────────────────────────────
export function clearSession() {
  const jar = cookies();
  jar.delete(COOKIE_NAME);
  jar.delete(ROLE_COOKIE);
}
