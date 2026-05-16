import * as SecureStore from "expo-secure-store";

/**
 * API client for the Sabeh mobile app.
 *
 * Reads `EXPO_PUBLIC_API_BASE_URL` at build time (Expo public env vars are
 * inlined by Metro). Auth tokens live in `expo-secure-store` under
 * `AUTH_TOKEN_KEY` — written on login, cleared on sign-out. The backend
 * doesn't yet accept Bearer tokens (web uses session cookies); this client
 * is structured so the wiring is a one-line change once the API gains a
 * bearer-auth middleware.
 */

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? "";
const AUTH_TOKEN_KEY = "sabeh.auth.token.v1";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

export class NotConfiguredError extends ApiError {
  constructor() {
    super(
      0,
      "API base URL not configured. Set EXPO_PUBLIC_API_BASE_URL in your .env or app config.",
    );
    this.name = "NotConfiguredError";
  }
}

export class NotAuthenticatedError extends ApiError {
  constructor() {
    super(401, "Sign in required.");
    this.name = "NotAuthenticatedError";
  }
}

export function isApiConfigured(): boolean {
  return API_BASE_URL.length > 0;
}

async function readToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function hasAuthToken(): Promise<boolean> {
  return (await readToken()) !== null;
}

async function apiFetch<T>(path: string, init: RequestInit & { requireAuth?: boolean } = {}): Promise<T> {
  if (!isApiConfigured()) throw new NotConfiguredError();

  const headers = new Headers(init.headers ?? {});
  headers.set("Accept", "application/json");
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const token = await readToken();
  if (init.requireAuth && !token) throw new NotAuthenticatedError();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  } catch (e) {
    throw new ApiError(0, e instanceof Error ? e.message : "Network request failed.");
  }

  if (res.status === 401) throw new NotAuthenticatedError();

  if (!res.ok) {
    let detail = "";
    try {
      const body = await res.json();
      detail = typeof body?.error === "string" ? body.error : "";
    } catch {
      // body wasn't JSON
    }
    throw new ApiError(res.status, detail || `Request failed (${res.status}).`);
  }

  return (await res.json()) as T;
}

// ─── Listings ─────────────────────────────────────────────────────────────────

export type CreateListingPayload = {
  title: string;
  titleAmharic?: string;
  description?: string;
  price: number;
  currency: "ETB" | "USD";
  category: string;
  location: string;
  condition: string;
};

export async function createListing(
  payload: CreateListingPayload,
): Promise<{ success: true; listingId: string }> {
  return apiFetch("/api/listings", {
    method: "POST",
    body: JSON.stringify(payload),
    requireAuth: true,
  });
}
