import { and, eq } from "drizzle-orm";
import { createError, defineEventHandler, getHeader, readRawBody } from "h3";
import Stripe from "stripe";

import { getDb, schema } from "../../db.js";
import { getStripeClient, readStripeSecret, STRIPE_WEBHOOK_SECRET } from "../../lib/stripe.js";

export default defineEventHandler(async (event) => {
  const stripe = await getStripeClient();
  const webhookSecret = await readStripeSecret(STRIPE_WEBHOOK_SECRET);
  if (!stripe || !webhookSecret) {
    throw createError({ statusCode: 503, statusMessage: "Stripe webhook is not configured." });
  }

  const signature = getHeader(event, "stripe-signature");
  const payload = await readRawBody(event);
  if (!signature || !payload) {
    throw createError({ statusCode: 400, statusMessage: "Missing Stripe signature or payload." });
  }

  let stripeEvent: Stripe.Event;
  try {
    stripeEvent = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch {
    throw createError({ statusCode: 400, statusMessage: "Invalid Stripe webhook signature." });
  }

  if (
    stripeEvent.type !== "checkout.session.completed" &&
    stripeEvent.type !== "checkout.session.async_payment_succeeded"
  ) {
    return { received: true };
  }

  const session = stripeEvent.data.object as Stripe.Checkout.Session;
  const orderId = session.metadata?.orderId;
  if (
    session.mode !== "payment" ||
    session.payment_status !== "paid" ||
    session.currency !== "eur" ||
    !Number.isSafeInteger(session.amount_total) ||
    !orderId
  ) {
    return { received: true };
  }

  const db = getDb();
  const [order] = await db
    .select({ totalCents: schema.orders.totalCents })
    .from(schema.orders)
    .where(eq(schema.orders.id, orderId));
  if (!order || Number(order.totalCents) !== session.amount_total) {
    return { received: true };
  }

  await db
    .update(schema.orders)
    .set({ paymentStatus: "paid", updatedAt: new Date().toISOString() })
    .where(and(eq(schema.orders.id, orderId), eq(schema.orders.paymentStatus, "unpaid")));

  return { received: true };
});