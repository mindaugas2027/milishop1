import { createAuthPlugin } from "@agent-native/core/server";
import { getSupabaseAdminSession } from "../lib/supabase-admin-auth";


export default createAuthPlugin({
  getSession: getSupabaseAdminSession,
  trustCustomEmailVerification: true,
  publicPaths: [
    "/login",
    "/_agent-native/auth/session",
    "/api/admin-auth/login",
    "/api/admin-auth/logout",
  ],
  workspaceAppAudience: "public",
  workspaceAppPublicPaths: ["/"],
  workspaceAppProtectedPaths: ["/admin"],
});
