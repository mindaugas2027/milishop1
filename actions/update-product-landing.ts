import { defineAction } from "@agent-native/core/action";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { getDb, schema } from "../server/db.js";

const landingSchema = z.object({
  slug: z.string().min(1).max(120).describe("Product slug, for example obd2"),
  brandName: z.string().min(1).max(80).describe("Store brand shown in the footer"),
  footerText: z.string().max(200).describe("Short footer sentence"),
  name: z.string().min(1).max(160).describe("Product title"),
  category: z.enum(["automobiliui", "kasdienai", "namams"]).describe("Product category: automobiliui, kasdienai, or namams"),
  eyebrow: z.string().max(120).describe("Small label above the product title"),
  description: z.string().max(500).describe("Short product description"),
  longDescription: z.string().max(4000).describe("Full product description"),
  price: z.string().min(1).max(40).describe("Current display price"),
  oldPrice: z.string().max(40).describe("Optional old display price"),
  saving: z.string().max(80).describe("Optional savings label"),
  heroImage: z.string().url().describe("Primary product image URL"),
  supplierUrl: z.string().trim().max(2048).refine((value) => {
    if (!value) return true;
    try {
      return new URL(value).protocol === "https:";
    } catch {
      return false;
    }
  }, "Supplier URL must use HTTPS.").describe("Private HTTPS link where the administrator orders this product"),
  gallery: z.array(z.string().url()).max(12).describe("Product gallery image URLs"),
  features: z.array(z.string().max(160)).max(20).describe("Feature highlights"),
  steps: z.array(z.string().max(240)).max(20).describe("Usage steps"),
  specs: z.array(z.object({ label: z.string().max(100), value: z.string().max(240) })).max(30).describe("Specification rows"),
  faq: z.array(z.object({ question: z.string().max(240), answer: z.string().max(2000) })).max(30).describe("Frequently asked questions"),
  deliveryInfo: z.string().max(200).describe("Delivery promise"),
  returnsInfo: z.string().max(200).describe("Returns promise"),
  ctaText: z.string().min(1).max(80).describe("Primary purchase button label"),
  finalCtaEyebrow: z.string().max(120).describe("Final CTA eyebrow"),
  finalCtaTitle: z.string().min(1).max(200).describe("Final CTA title"),
  finalCtaText: z.string().min(1).max(80).describe("Final CTA button label"),
});

function serialize(input: z.infer<typeof landingSchema>) {
  return {
    ...input,
    gallery: JSON.stringify(input.gallery),
    features: JSON.stringify(input.features),
    steps: JSON.stringify(input.steps),
    specs: JSON.stringify(input.specs),
    faq: JSON.stringify(input.faq),
    updatedAt: new Date().toISOString(),
  };
}

function deserialize(row: typeof schema.productLandings.$inferSelect) {
  return {
    ...row,
    gallery: JSON.parse(row.gallery) as string[],
    features: JSON.parse(row.features) as string[],
    steps: JSON.parse(row.steps) as string[],
    specs: JSON.parse(row.specs) as Array<{ label: string; value: string }>,
    faq: JSON.parse(row.faq) as Array<{ question: string; answer: string }>,
  };
}

export default defineAction({
  description: "Create or update all editable content for one product landing page.",
  schema: landingSchema,
  run: async (input) => {
    const db = getDb();
    const values = serialize(input);
    const [existing] = await db
      .select({ id: schema.productLandings.id })
      .from(schema.productLandings)
      .where(eq(schema.productLandings.slug, input.slug))
      .limit(1);

    const [row] = existing
      ? await db.update(schema.productLandings).set({ ...values, status: "active" }).where(eq(schema.productLandings.id, existing.id)).returning()
      : await db.insert(schema.productLandings).values(values).returning();

    return deserialize(row);
  },
});
