import { runAuthGuard } from "@agent-native/core/server";
import { getMethod, getRequestURL, setResponseStatus } from "h3";

import { getSupabaseAdminSession } from "../lib/supabase-admin-auth";
/**
 * Global auth middleware — runs for ALL requests (page routes, API routes,
 * framework routes). The auth plugin configures the guard; this middleware
 * enforces it on every request.
 *
 * Without this, auth only runs for /_agent-native/* routes because the
 * framework handler's middleware registry is scoped to that catch-all.
 * Page routes (/, /settings) and API routes (/api/*) would bypass auth.
 */
import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname;
  const method = getMethod(event);

  if (path === "/_agent-native/auth/session") {
    const session = await getSupabaseAdminSession(event);
    return session ?? { error: "Not authenticated" };
  }

  const isPublicAuthRoute =
    path === "/api/admin-auth/login" || path === "/api/admin-auth/logout";
  const isPublicCatalogRead =
    method === "GET" &&
    (path === "/_agent-native/actions/list-product-landings" ||
      path === "/_agent-native/actions/get-product-landing");
  const isPublicStoreCheckout =
    method === "POST" && path === "/_agent-native/actions/create-order";
  const isStripeWebhook = method === "POST" && path === "/api/stripe-webhook";
  const isFrameworkAuthRoute =
    path.startsWith("/_agent-native/auth/") || path === "/_agent-native/sign-in";

  if (isStripeWebhook) return;

  if (isPublicAuthRoute || isPublicCatalogRead || isPublicStoreCheckout || isFrameworkAuthRoute) {
    return runAuthGuard(event);
  }

  if (path.startsWith("/api/") || path.startsWith("/_agent-native/")) {
    if (!(await getSupabaseAdminSession(event))) {
      setResponseStatus(event, 401);
      return { error: "Unauthorized" };
    }
  }

  return runAuthGuard(event);
});
