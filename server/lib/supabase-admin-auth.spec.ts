import { afterEach, describe, expect, it, vi } from "vitest";
import type { H3Event } from "h3";

import { ADMIN_EMAIL, getSupabaseAdminSession, isAdminEmail } from "./supabase-admin-auth";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("Supabase admin allowlist", () => {
  it("accepts only the configured admin email", () => {
    expect(isAdminEmail(ADMIN_EMAIL)).toBe(true);
    expect(isAdminEmail(` ${ADMIN_EMAIL.toUpperCase()} `)).toBe(true);
    expect(isAdminEmail("other@example.com")).toBe(false);
    expect(isAdminEmail(null)).toBe(false);
  });

  it("shares concurrent Supabase user verification for the same access token", async () => {
    vi.stubEnv("SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("SUPABASE_ANON_KEY", "test-anon-key");

    const token = `test-access-token-${Date.now()}-${Math.random()}`;
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        id: "test-admin-id",
        email: ADMIN_EMAIL,
        email_confirmed_at: "2026-01-01T00:00:00Z",
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const createEvent = () => ({
      context: {},
      req: new Request("http://localhost", {
        headers: { cookie: `milishop-supabase-access=${token}` },
      }),
    }) as unknown as H3Event;

    const sessions = await Promise.all([
      getSupabaseAdminSession(createEvent()),
      getSupabaseAdminSession(createEvent()),
      getSupabaseAdminSession(createEvent()),
    ]);

    expect(sessions).toHaveLength(3);
    expect(sessions.every((session) => session?.email === ADMIN_EMAIL)).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});