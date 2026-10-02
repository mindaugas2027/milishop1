import { defineAction, fail } from "@agent-native/core/action";
import { inArray } from "drizzle-orm";
import { z } from "zod";

import { getDb, schema } from "../server/db.js";

const orderInput = z.object({
  customerName: z.string().trim().min(2).max(120).describe("Pirkėjo vardas ir pavardė"),
  customerEmail: z.string().trim().email().max(254).describe("Pirkėjo el. pašto adresas"),
  customerPhone: z.string().trim().min(6).max(30).describe("Pirkėjo telefono numeris"),
  shippingAddress: z.string().trim().min(8).max(400).describe("Pristatymo adresas"),
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
  description: "Create a guest storefront order using current server-side product prices and cost snapshots; bank transfer is handled manually.",
  schema: orderInput,
  requiresAuth: false,
  run: async ({ customerName, customerEmail, customerPhone, shippingAddress, items }) => {
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
    const id = crypto.randomUUID();
    const orderNumber = `MS-${new Date().getFullYear()}-${id.slice(0, 8).toUpperCase()}`;
    const [order] = await db.insert(schema.orders).values({
      id,
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items: JSON.stringify(orderItems),
      totalCents: String(totalCents),
      costCents: costCents === null ? "" : String(costCents),
      profitCents: costCents === null ? "" : String(totalCents - costCents),
    }).returning({ id: schema.orders.id, orderNumber: schema.orders.orderNumber });

    return {
      id: order.id,
      orderNumber: order.orderNumber,
      totalCents,
      status: "received",
      paymentMethod: "bank_transfer",
    };
  },
});