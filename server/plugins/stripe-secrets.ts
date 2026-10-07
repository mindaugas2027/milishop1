import { defineNitroPlugin } from "@agent-native/core/server";
import { registerRequiredSecret } from "@agent-native/core/secrets";
import Stripe from "stripe";

export default defineNitroPlugin(() => {
  registerRequiredSecret({
    key: "STRIPE_SECRET_KEY",
    label: "Stripe slaptasis raktas",
    description: "Serverio raktas saugioms Stripe Checkout sesijoms kurti.",
    docsUrl: "https://dashboard.stripe.com/apikeys",
    scope: "workspace",
    kind: "api-key",
    validator: async (value) => {
      try {
        await new Stripe(value).balance.retrieve();
        return { ok: true };
      } catch {
        return { ok: false, error: "Stripe rejected this API key." };
      }
    },
  });

  registerRequiredSecret({
    key: "STRIPE_WEBHOOK_SECRET",
    label: "Stripe webhook pasirašymo raktas",
    description: "Patikrina iš Stripe gautus mokėjimo patvirtinimus.",
    docsUrl: "https://dashboard.stripe.com/webhooks",
    scope: "workspace",
    kind: "api-key",
    validator: (value) => value.startsWith("whsec_")
      ? { ok: true }
      : { ok: false, error: "Stripe webhook signing secrets start with whsec_." },
  });
});