import { defineEventHandler } from "h3";

import { signOutSupabaseAdmin } from "../../../lib/supabase-admin-auth";

export default defineEventHandler(async (event) => {
  await signOutSupabaseAdmin(event);
  return { ok: true };
});