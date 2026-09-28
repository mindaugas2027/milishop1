import { createError, defineEventHandler, readBody } from "h3";
import { z } from "zod";

import { signInSupabaseAdmin } from "../../../lib/supabase-admin-auth";

const loginSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(1).max(256),
});

export default defineEventHandler(async (event) => {
  const parsed = loginSchema.safeParse(await readBody(event));
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: "Įveskite el. paštą ir slaptažodį." });
  }

  try {
    await signInSupabaseAdmin(event, parsed.data.email, parsed.data.password);
    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Prisijungti nepavyko.";
    const statusCode = message.includes("nesukonfigūruota") ? 503 : 401;
    throw createError({ statusCode, statusMessage: message });
  }
});