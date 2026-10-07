import Stripe from "stripe";
import { readAppSecret } from "@agent-native/core/secrets";

export const STRIPE_SECRET_KEY = "STRIPE_SECRET_KEY";
export const STRIPE_WEBHOOK_SECRET = "STRIPE_WEBHOOK_SECRET";

export async function readStripeSecret(key: string): Promise<string | null> {
  const scopeId = process.env.AGENT_VAULT_ORG_ID?.trim();
  if (!scopeId) return null;

  const stored = await readAppSecret({ key, scope: "workspace", scopeId });
  return stored?.value ?? null;
}

export async function getStripeClient(): Promise<Stripe | null> {
  const secretKey = await readStripeSecret(STRIPE_SECRET_KEY);
  return secretKey ? new Stripe(secretKey) : null;
}