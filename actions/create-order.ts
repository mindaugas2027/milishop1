import { defineAction, fail } from "@agent-native/core/action";
import { getRequestContext } from "@agent-native/core/server";
import { inArray } from "drizzle-orm";
import { z } from "zod";

import { getDb, schema } from "../server/db.js";
import { getStripeClient } from "../server/lib/stripe.js";

const orderInput = z.object({
  customerName: z.string().trim().min(2).max(120).describe("Pirkėjo vardas ir pavardė"),
  customerEmail: z.string().trim().email().max(254).describe("Pirkėjo el. pašto adresas"),
  customerPhone: z.string().trim().min(6).max(30).describe("Pirkėjo telefono numeris"),
  shippingStreet: z.string().trim().min(2).max(120).describe("Gatvės pavadinimas"),
  shippingHouseNumber: z.string().trim().min(1).max(20).describe("Namo numeris"),
  shippingApartmentNumber: z.string().trim().max(20).optional().default("").describe("Buto numeris (neprivalomas)"),
  shippingCity: z.string().trim().min(2).max(100).describe("Miestas"),
  shippingPostalCode: z.string().trim().regex(/^\d{5}$/, "Pašto kodą turi sudaryti 5 skaitmenys.").describe("Lietuvos 5 skaitmenų pašto kodas"),
  items: z.array(z.object({
    slug: z.string().trim().min(1).max(120).describe("Produkto adresas"),
    quantity: z.number().int().min(1).max(99).describe("Prekės kiekis"),
  })).min(1).max(30).describe("Užsakomos prekės ir jų kiekiai"),
});

function parsePriceCents(price: string) {
  const normalized = price.replace(/[^\d,.-]/g, "").replace(/\s/g, "");
  const decimal = normalized.includes(",")
    ? normalized.replace(/\./g, "").replace(",", ".")
    : normalized.replace(/\.(?=\d{3}(?:\.|$))/g, "");
  if (!/^\d+(?:\.\d{1,2})?$/.test(decimal)) return null;
  const value = Number(decimal);
  return Number.isSafeInteger(Math.round(value * 100)) ? Math.round(value * 100) : null;
}

export default defineAction({
  description: "Create a guest storefront order and Stripe Checkout session using current server-side product prices; payment is confirmed by the Stripe webhook.",
  schema: orderInput,
  requiresAuth: false,
  agentTool: false,
  run: async ({ customerName, customerEmail, customerPhone, shippingStreet, shippingHouseNumber, shippingApartmentNumber, shippingCity, shippingPostalCode, items }) => {
    const quantities = new Map<string, number>();
    for (const item of items) {
      const nextQuantity = (quantities.get(item.slug) ?? 0) + item.quantity;
      if (nextQuantity > 99) fail("Vienos prekės kiekis negali viršyti 99.");
      quantities.set(item.slug, nextQuantity);
    }

    const db = getDb();
    const products = await db
      .select({
        slug: schema.productLandings.slug,
        name: schema.productLandings.name,
        price: schema.productLandings.price,
        costPrice: schema.productLandings.costPrice,
        heroImage: schema.productLandings.heroImage,
        status: schema.productLandings.status,
      })
      .from(schema.productLandings)
      .where(inArray(schema.productLandings.slug, [...quantities.keys()]));
    const productsBySlug = new Map(products.map((product) => [product.slug, product]));

    const orderItems = [...quantities.entries()].map(([slug, quantity]) => {
      const product = productsBySlug.get(slug);
      if (!product || product.status !== "active") fail(`Prekė „${slug}“ šiuo metu nepasiekiama.`);
      const priceCents = parsePriceCents(product.price);
      const costCents = product.costPrice ? parsePriceCents(product.costPrice) : null;
      if (priceCents === null || priceCents <= 0) fail(`Prekės „${product.name}“ pardavimo kaina neteisinga.`);
      if (product.costPrice && costCents === null) fail(`Prekės „${product.name}“ savikaina neteisinga.`);
      return {
        slug,
        name: product.name,
        image: product.heroImage,
        quantity,
        unitPriceCents: priceCents,
        unitCostCents: costCents,
      };
    });

    const totalCents = orderItems.reduce((sum, item) => sum + item.unitPriceCents * item.quantity, 0);
    if (!Number.isSafeInteger(totalCents)) fail("Užsakymo suma per didelė.");
    const costsComplete = orderItems.every((item) => item.unitCostCents !== null);
    const costCents = costsComplete
      ? orderItems.reduce((sum, item) => sum + item.unitCostCents! * item.quantity, 0)
      : null;
    if (costCents !== null && !Number.isSafeInteger(costCents)) fail("Užsakymo savikainos suma per didelė.");
    const requestOrigin = getRequestContext()?.requestOrigin;
    if (!requestOrigin) fail("Nepavyko nustatyti parduotuvės adreso. Atnaujinkite puslapį ir bandykite dar kartą.");
    let origin: URL;
    try {
      origin = new URL(requestOrigin);
    } catch {
      fail("Parduotuvės adresas neteisingas.");
    }
    if (origin.protocol !== "https:" && origin.hostname !== "localhost" && origin.hostname !== "127.0.0.1") {
      fail("Parduotuvės adresas nesaugus.");
    }
    const stripe = await getStripeClient();
    if (!stripe) {
      fail("Stripe dar nesukonfigūruotas. Parduotuvės administratorius turi įvesti Stripe raktus nustatymuose.");
    }
    const id = crypto.randomUUID();
    const orderNumber = `MS-${new Date().getFullYear()}-${id.slice(0, 8).toUpperCase()}`;
    const shippingAddress = [
      `${shippingStreet} ${shippingHouseNumber}${shippingApartmentNumber ? `-${shippingApartmentNumber}` : ""}`,
      `LT-${shippingPostalCode} ${shippingCity}`,
    ].join("\n");
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customerEmail,
      line_items: orderItems.map((item) => ({
        price_data: {
          currency: "eur",
          product_data: { name: item.name },
          unit_amount: item.unitPriceCents,
        },
        quantity: item.quantity,
      })),
      metadata: { orderId: id, orderNumber },
      success_url: `${origin.origin}/?checkout=success&order=${encodeURIComponent(orderNumber)}`,
      cancel_url: `${origin.origin}/?checkout=cancelled`,
    });
    if (!checkoutSession.url) fail("Stripe nepateikė apmokėjimo nuorodos. Bandykite dar kartą.");
    let order: { id: string; orderNumber: string } | undefined;
    try {
      [order] = await db.insert(schema.orders).values({
        id,
        orderNumber,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        paymentMethod: "stripe",
        paymentStatus: "unpaid",
        status: "received",
        items: JSON.stringify(orderItems),
        totalCents: String(totalCents),
        costCents: costCents === null ? "" : String(costCents),
        profitCents: costCents === null ? "" : String(totalCents - costCents),
      }).returning({ id: schema.orders.id, orderNumber: schema.orders.orderNumber });
    } catch (error) {
      await stripe.checkout.sessions.expire(checkoutSession.id).catch(() => undefined);
      throw error;
    }
    if (!order) {
      await stripe.checkout.sessions.expire(checkoutSession.id).catch(() => undefined);
      fail("Nepavyko išsaugoti užsakymo. Bandykite dar kartą.");
    }

    return {
      id: order.id,
      orderNumber: order.orderNumber,
      totalCents,
      status: "received",
      paymentStatus: "unpaid",
      paymentMethod: "stripe",
      checkoutUrl: checkoutSession.url,
    };
  },
});