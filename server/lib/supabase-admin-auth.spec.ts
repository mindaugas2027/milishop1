import { describe, expect, it } from "vitest";

import { ADMIN_EMAIL, isAdminEmail } from "./supabase-admin-auth";

describe("Supabase admin allowlist", () => {
  it("accepts only the configured admin email", () => {
    expect(isAdminEmail(ADMIN_EMAIL)).toBe(true);
    expect(isAdminEmail(` ${ADMIN_EMAIL.toUpperCase()} `)).toBe(true);
    expect(isAdminEmail("other@example.com")).toBe(false);
    expect(isAdminEmail(null)).toBe(false);
  });
});