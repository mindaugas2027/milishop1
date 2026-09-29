import { createHash } from "node:crypto";

import type { AuthSession } from "@agent-native/core/server";
import { deleteCookie, getCookie, setCookie, type H3Event } from "h3";

export const ADMIN_EMAIL = "mindaugas2027@gmail.com";

const ACCESS_COOKIE = "milishop-supabase-access";
const REFRESH_COOKIE = "milishop-supabase-refresh";
const REQUEST_SESSION_KEY = "__milishopSupabaseSession";
const VERIFIED_SESSION_TTL_MS = 5_000;

const verifiedSessions = new Map<string, { session: AuthSession; expiresAt: number }>();
const pendingUserVerifications = new Map<string, Promise<SupabaseUser | null>>();

type SupabaseUser = {
  id: string;
  email?: string;
  email_confirmed_at?: string | null;
  user_metadata?: { full_name?: string; name?: string };
};

type SupabaseTokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: SupabaseUser;
};

export function isAdminEmail(email: string | null | undefined) {
  return email?.trim().toLowerCase() === ADMIN_EMAIL;
}

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, ""); // guard:allow-env-credential — Supabase project URL is deploy-scoped auth configuration.
  const apiKey = process.env.SUPABASE_ANON_KEY ?? process.env.SUPABASE_PUBLISHABLE_KEY; // guard:allow-env-credential — public project key is required server-side to validate Supabase sessions.
  return url && apiKey ? { url, apiKey } : null;
}

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

function saveSessionCookies(event: H3Event, tokens: SupabaseTokenResponse) {
  setCookie(event, ACCESS_COOKIE, tokens.access_token, cookieOptions(tokens.expires_in));
  setCookie(event, REFRESH_COOKIE, tokens.refresh_token, cookieOptions(60 * 60 * 24 * 30));
}

function clearSessionCookies(event: H3Event) {
  deleteCookie(event, ACCESS_COOKIE, { path: "/" });
  deleteCookie(event, REFRESH_COOKIE, { path: "/" });
}

function toSession(user: SupabaseUser): AuthSession | null {
  const email = user.email?.trim().toLowerCase();
  if (!email || !isAdminEmail(email)) return null;

  return {
    email,
    userId: user.id,
    name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? email,
    emailVerified: Boolean(user.email_confirmed_at),
  };
}

async function fetchUser(url: string, apiKey: string, accessToken: string) {
  const response = await fetch(`${url}/auth/v1/user`, {
    headers: { apikey: apiKey, Authorization: `Bearer ${accessToken}` },
    signal: AbortSignal.timeout(5_000),
  });
  if (!response.ok) return null;
  return (await response.json()) as SupabaseUser;
}

export async function getSupabaseAdminSession(event: H3Event): Promise<AuthSession | null> {
  const context = event.context as typeof event.context & {
    [REQUEST_SESSION_KEY]?: Promise<AuthSession | null>;
  };
  if (context[REQUEST_SESSION_KEY]) return context[REQUEST_SESSION_KEY];

  const pending = resolveSupabaseAdminSession(event);
  context[REQUEST_SESSION_KEY] = pending;
  return pending;
}

function sessionCacheKey(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function fetchUserOnce(url: string, apiKey: string, accessToken: string) {
  const key = sessionCacheKey(accessToken);
  const pending = pendingUserVerifications.get(key);
  if (pending) return pending;

  const request = fetchUser(url, apiKey, accessToken);
  const sharedRequest = request.finally(() => {
    if (pendingUserVerifications.get(key) === sharedRequest) {
      pendingUserVerifications.delete(key);
    }
  });
  pendingUserVerifications.set(key, sharedRequest);
  return sharedRequest;
}

function cacheVerifiedSession(token: string, session: AuthSession) {
  const now = Date.now();
  for (const [key, value] of verifiedSessions) {
    if (value.expiresAt <= now) verifiedSessions.delete(key);
  }
  if (verifiedSessions.size >= 256) {
    const oldestKey = verifiedSessions.keys().next().value;
    if (oldestKey) verifiedSessions.delete(oldestKey);
  }
  verifiedSessions.set(sessionCacheKey(token), {
    session,
    expiresAt: now + VERIFIED_SESSION_TTL_MS,
  });
}

function getCachedSession(token: string) {
  const key = sessionCacheKey(token);
  const entry = verifiedSessions.get(key);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    verifiedSessions.delete(key);
    return null;
  }
  return entry.session;
}

async function resolveSupabaseAdminSession(event: H3Event): Promise<AuthSession | null> {
  const config = getSupabaseConfig();
  if (!config) return null;

  const accessToken = getCookie(event, ACCESS_COOKIE);
  const refreshToken = getCookie(event, REFRESH_COOKIE);
  if (!accessToken && !refreshToken) return null;

  try {
    if (accessToken) {
      const cachedSession = getCachedSession(accessToken);
      if (cachedSession) return cachedSession;

      const user = await fetchUserOnce(config.url, config.apiKey, accessToken);
      if (user) {
        const session = toSession(user);
        if (session) {
          cacheVerifiedSession(accessToken, session);
          return session;
        }
        clearSessionCookies(event);
        return null;
      }
    }

    if (!refreshToken) {
      clearSessionCookies(event);
      return null;
    }

    const response = await fetch(`${config.url}/auth/v1/token?grant_type=refresh_token`, {
      method: "POST",
      headers: { apikey: config.apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) {
      clearSessionCookies(event);
      return null;
    }

    const tokens = (await response.json()) as SupabaseTokenResponse;
    const session = toSession(tokens.user);
    if (!session) {
      clearSessionCookies(event);
      return null;
    }
    saveSessionCookies(event, tokens);
    cacheVerifiedSession(tokens.access_token, session);
    return session;
  } catch {
    return null;
  }
}

export async function signInSupabaseAdmin(event: H3Event, email: string, password: string) {
  const config = getSupabaseConfig();
  if (!config) {
    throw new Error("Supabase autentifikacija nesukonfigūruota.");
  }

  if (!isAdminEmail(email)) {
    throw new Error("Neteisingas el. paštas arba slaptažodis.");
  }

  const response = await fetch(`${config.url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: config.apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) {
    throw new Error("Neteisingas el. paštas arba slaptažodis.");
  }

  const tokens = (await response.json()) as SupabaseTokenResponse;
  const session = toSession(tokens.user);
  if (!session) {
    throw new Error("Neteisingas el. paštas arba slaptažodis.");
  }

  saveSessionCookies(event, tokens);
  cacheVerifiedSession(tokens.access_token, session);
}

export async function signOutSupabaseAdmin(event: H3Event) {
  const config = getSupabaseConfig();
  const accessToken = getCookie(event, ACCESS_COOKIE);
  if (accessToken) verifiedSessions.delete(sessionCacheKey(accessToken));

  if (config && accessToken) {
    try {
      await fetch(`${config.url}/auth/v1/logout?scope=local`, {
        method: "POST",
        headers: { apikey: config.apiKey, Authorization: `Bearer ${accessToken}` },
        signal: AbortSignal.timeout(3_000),
      });
    } catch {
      // Clear local cookies even if Supabase is temporarily unavailable.
    }
  }

  clearSessionCookies(event);
}