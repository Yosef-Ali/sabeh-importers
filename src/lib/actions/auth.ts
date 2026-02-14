"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { users, emailVerifications, passwordResetTokens } from "@/db/schema";
import { eq, and, gt, isNull } from "drizzle-orm";
import { createSessionWithLegacyCookie, clearSession } from "@/lib/session";
import { redirect } from "next/navigation";

// ── Types ─────────────────────────────────────────────────────────────────────

export type LoginResult =
  | { success: true; user: { id: string; name: string; email: string; role: string; avatar: string | null; verificationStatus: string } }
  | { success: false; error: string };

export type ActionResult =
  | { success: true; message: string }
  | { success: false; error: string };

// ── Helpers ───────────────────────────────────────────────────────────────────

function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ── Login ──────────────────────────────────────────────────────────────────────

export async function loginAction(email: string, password: string): Promise<LoginResult> {
  if (!email || !password) {
    return { success: false, error: "Email and password are required." };
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, email.toLowerCase().trim()),
  });

  if (!user) {
    return { success: false, error: "Invalid email or password." };
  }

  if (!user.isActive) {
    return { success: false, error: "Your account has been suspended. Contact support." };
  }

  if (!user.isEmailVerified) {
    return { success: false, error: "EMAIL_NOT_VERIFIED" };
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return { success: false, error: "Invalid email or password." };
  }

  // Update last login timestamp
  await db.update(users).set({ lastLogin: new Date() }).where(eq(users.id, user.id));

  await createSessionWithLegacyCookie({
    userId: user.id,
    role: user.role,
    email: user.email,
    name: user.name,
  });

  return {
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      verificationStatus: user.verificationStatus,
    },
  };
}

// ── Logout ─────────────────────────────────────────────────────────────────────

export async function logoutAction() {
  clearSession();
  redirect("/login");
}

// ── Register ───────────────────────────────────────────────────────────────────

export type RegisterResult =
  | { success: true; email: string }
  | { success: false; error: string };

export async function registerAction(
  name: string,
  email: string,
  password: string,
  role: "SELLER" | "BUYER" = "SELLER",
  companyFields?: {
    companyName?: string;
    companyNameAmharic?: string;
    businessLicense?: string;
    tinNumber?: string;
    companyDescription?: string;
  }
): Promise<RegisterResult> {
  if (!name || !email || !password) {
    return { success: false, error: "All fields are required." };
  }

  const emailLower = email.toLowerCase().trim();

  if (password.length < 8) {
    return { success: false, error: "Password must be at least 8 characters." };
  }

  // Check for existing user
  const existing = await db.query.users.findFirst({
    where: eq(users.email, emailLower),
  });
  if (existing) {
    return { success: false, error: "An account with this email already exists." };
  }

  const hashed = await bcrypt.hash(password, 12);
  const userId = crypto.randomUUID();

  await db.insert(users).values({
    id: userId,
    name: name.trim(),
    email: emailLower,
    password: hashed,
    role,
    isActive: true,
    isEmailVerified: false,
    verificationStatus: "UNVERIFIED",
    ...(role === "SELLER" && companyFields ? {
      companyName: companyFields.companyName?.trim() || undefined,
      companyNameAmharic: companyFields.companyNameAmharic?.trim() || undefined,
      businessLicense: companyFields.businessLicense?.trim() || undefined,
      tinNumber: companyFields.tinNumber?.trim() || undefined,
      companyDescription: companyFields.companyDescription?.trim() || undefined,
    } : {}),
  });

  // Issue a verification token and send the email
  await issueAndSendVerificationEmail(userId, emailLower, name.trim());

  return { success: true, email: emailLower };
}

// ── Email verification ─────────────────────────────────────────────────────────

async function issueAndSendVerificationEmail(userId: string, email: string, name: string) {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 h

  await db.insert(emailVerifications).values({ userId, token, expiresAt });

  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/verify-email?token=${token}`;
  await sendEmail({
    to: email,
    subject: "Verify your Sabeh account",
    html: verifyEmailTemplate(name, verifyUrl),
  });
}

export async function verifyEmailAction(token: string): Promise<ActionResult> {
  if (!token) return { success: false, error: "Invalid token." };

  const record = await db.query.emailVerifications.findFirst({
    where: and(
      eq(emailVerifications.token, token),
      gt(emailVerifications.expiresAt, new Date()),
      isNull(emailVerifications.usedAt)
    ),
  });

  if (!record) {
    return { success: false, error: "This verification link is invalid or has expired." };
  }

  await db
    .update(users)
    .set({ isEmailVerified: true })
    .where(eq(users.id, record.userId));

  await db
    .update(emailVerifications)
    .set({ usedAt: new Date() })
    .where(eq(emailVerifications.id, record.id));

  return { success: true, message: "Email verified successfully. You can now sign in." };
}

export async function resendVerificationEmailAction(email: string): Promise<ActionResult> {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email.toLowerCase().trim()),
  });

  // Always return success to avoid email enumeration
  if (!user || user.isEmailVerified) {
    return { success: true, message: "If that email exists and is unverified, a link has been sent." };
  }

  await issueAndSendVerificationEmail(user.id, user.email, user.name);
  return { success: true, message: "Verification email sent. Please check your inbox." };
}

// ── Password reset ─────────────────────────────────────────────────────────────

export async function forgotPasswordAction(email: string): Promise<ActionResult> {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email.toLowerCase().trim()),
  });

  // Always success to prevent email enumeration
  if (!user || !user.isActive) {
    return { success: true, message: "If that email is registered, a reset link has been sent." };
  }

  const token = generateToken();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 h

  await db.insert(passwordResetTokens).values({ userId: user.id, token, expiresAt });

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${token}`;
  await sendEmail({
    to: user.email,
    subject: "Reset your Sabeh password",
    html: resetPasswordTemplate(user.name, resetUrl),
  });

  return { success: true, message: "If that email is registered, a reset link has been sent." };
}

export async function resetPasswordAction(token: string, newPassword: string): Promise<ActionResult> {
  if (!token || !newPassword) return { success: false, error: "Missing token or password." };

  if (newPassword.length < 8) {
    return { success: false, error: "Password must be at least 8 characters." };
  }

  const record = await db.query.passwordResetTokens.findFirst({
    where: and(
      eq(passwordResetTokens.token, token),
      gt(passwordResetTokens.expiresAt, new Date()),
      isNull(passwordResetTokens.usedAt)
    ),
  });

  if (!record) {
    return { success: false, error: "This reset link is invalid or has expired." };
  }

  const hashed = await bcrypt.hash(newPassword, 12);

  await db.update(users).set({ password: hashed }).where(eq(users.id, record.userId));
  await db
    .update(passwordResetTokens)
    .set({ usedAt: new Date() })
    .where(eq(passwordResetTokens.id, record.id));

  return { success: true, message: "Password updated. You can now sign in." };
}

// ── Seed helper ────────────────────────────────────────────────────────────────

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// ── Email sender (Resend-compatible, falls back to console in dev) ─────────────

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail({ to, subject, html }: EmailPayload) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // Dev fallback — log to console so you can copy-paste the link
    console.log("\n─── DEV EMAIL ────────────────────────────────────");
    console.log(`To:      ${to}`);
    console.log(`Subject: ${subject}`);
    // Extract the link from the HTML for quick access
    const match = html.match(/href="([^"]+)"/);
    if (match) console.log(`Link:    ${match[1]}`);
    console.log("──────────────────────────────────────────────────\n");
    return;
  }

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || "Sabeh <no-reply@sabeh.authority>",
      to,
      subject,
      html,
    }),
  });
}

// ── Email templates ────────────────────────────────────────────────────────────

function verifyEmailTemplate(name: string, url: string): string {
  return `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px">
      <h2 style="margin-bottom:8px">Welcome to Sabeh, ${name}!</h2>
      <p style="color:#555">Click the button below to verify your email address. This link expires in 24 hours.</p>
      <a href="${url}" style="display:inline-block;margin:20px 0;padding:12px 28px;background:#1a2744;color:#fff;text-decoration:none;border-radius:6px;font-weight:600">
        Verify my email
      </a>
      <p style="color:#888;font-size:12px">If you didn't create a Sabeh account, you can safely ignore this email.</p>
    </div>`;
}

function resetPasswordTemplate(name: string, url: string): string {
  return `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px">
      <h2 style="margin-bottom:8px">Reset your password, ${name}</h2>
      <p style="color:#555">Click the button below to choose a new password. This link expires in 1 hour.</p>
      <a href="${url}" style="display:inline-block;margin:20px 0;padding:12px 28px;background:#1a2744;color:#fff;text-decoration:none;border-radius:6px;font-weight:600">
        Reset password
      </a>
      <p style="color:#888;font-size:12px">If you didn't request this, you can safely ignore this email.</p>
    </div>`;
}
