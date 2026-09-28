import { loadEnv } from "@agent-native/core/scripts";

loadEnv();

const email = "mindaugas2027@gmail.com";
const url = process.env.SUPABASE_URL?.replace(/\/$/, ""); // guard:allow-env-credential — one-time provisioning target is deploy-scoped Supabase config.
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // guard:allow-env-credential — one-time Supabase admin API key is supplied locally and never logged.
const password = process.env.SUPABASE_ADMIN_PASSWORD; // guard:allow-env-credential — initial admin password is supplied locally and never logged.

if (!url || !serviceRoleKey || !password) {
  throw new Error(
    "Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and SUPABASE_ADMIN_PASSWORD locally before creating the admin account.",
  );
}

if (password.length < 12) {
  throw new Error("SUPABASE_ADMIN_PASSWORD must be at least 12 characters long.");
}

const response = await fetch(`${url}/auth/v1/admin/users`, {
  method: "POST",
  headers: {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: "Mindaugas" },
  }),
});

if (!response.ok) {
  if (response.status === 422) {
    throw new Error(`Supabase account ${email} may already exist; check Supabase Auth users and reset its password there.`);
  }
  throw new Error(`Supabase admin user creation failed (HTTP ${response.status}).`);
}

console.log(`Created confirmed Supabase admin account: ${email}`);