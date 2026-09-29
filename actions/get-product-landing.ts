import { defineAction } from "@agent-native/core/action";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { getDb, schema } from "../server/db.js";

type PublicLanding = Omit<typeof schema.productLandings.$inferSelect, "supplierUrl">;

function deserialize(row: PublicLanding) {
  return {
    id: row.id,
    slug: row.slug,
    status: row.status,
    brandName: row.brandName,
    footerText: row.footerText,
    name: row.name,
    eyebrow: row.eyebrow,
    description: row.description,
    longDescription: row.longDescription,
    price: row.price,
    oldPrice: row.oldPrice,
    saving: row.saving,
    heroImage: row.heroImage,
    deliveryInfo: row.deliveryInfo,
    returnsInfo: row.returnsInfo,
    ctaText: row.ctaText,
    finalCtaEyebrow: row.finalCtaEyebrow,
    finalCtaTitle: row.finalCtaTitle,
    finalCtaText: row.finalCtaText,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    gallery: JSON.parse(row.gallery) as string[],
    features: JSON.parse(row.features) as string[],
    steps: JSON.parse(row.steps) as string[],
    specs: JSON.parse(row.specs) as Array<{ label: string; value: string }>,
    faq: JSON.parse(row.faq) as Array<{ question: string; answer: string }>,
  };
}

export default defineAction({
  description: "Read the editable one-product landing content for a product slug.",
  schema: z.object({
    slug: z.string().min(1).describe("Product slug, for example obd2"),
  }),
  http: { method: "GET" },
  requiresAuth: false,
  readOnly: true,
  run: async ({ slug }) => {
    const db = getDb();
    const [row] = await db
      .select({
        id: schema.productLandings.id,
        slug: schema.productLandings.slug,
        status: schema.productLandings.status,
        brandName: schema.productLandings.brandName,
        footerText: schema.productLandings.footerText,
        name: schema.productLandings.name,
        eyebrow: schema.productLandings.eyebrow,
        description: schema.productLandings.description,
        longDescription: schema.productLandings.longDescription,
        price: schema.productLandings.price,
        oldPrice: schema.productLandings.oldPrice,
        saving: schema.productLandings.saving,
        heroImage: schema.productLandings.heroImage,
        gallery: schema.productLandings.gallery,
        features: schema.productLandings.features,
        steps: schema.productLandings.steps,
        specs: schema.productLandings.specs,
        faq: schema.productLandings.faq,
        deliveryInfo: schema.productLandings.deliveryInfo,
        returnsInfo: schema.productLandings.returnsInfo,
        ctaText: schema.productLandings.ctaText,
        finalCtaEyebrow: schema.productLandings.finalCtaEyebrow,
        finalCtaTitle: schema.productLandings.finalCtaTitle,
        finalCtaText: schema.productLandings.finalCtaText,
        createdAt: schema.productLandings.createdAt,
        updatedAt: schema.productLandings.updatedAt,
      })
      .from(schema.productLandings)
      .where(eq(schema.productLandings.slug, slug))
      .limit(1);
    return row ? deserialize(row) : null;
  },
});
