import { defineAction } from "@agent-native/core/action";
import { and, asc, eq, gt } from "drizzle-orm";
import { z } from "zod";

import { getDb, schema } from "../server/db.js";

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
  description: "List a cursor-paginated page of active storefront products, optionally filtered by category.",
  schema: z.object({
    cursor: z.string().min(1).max(120).optional().describe("Return products after this slug"),
    category: z.string().trim().min(1).max(80).optional().describe("Optional storefront category slug filter"),
    limit: z.coerce.number().int().min(1).max(48).default(12).describe("Products per page; defaults to 12"),
  }),
  http: { method: "GET" },
  requiresAuth: false,
  readOnly: true,
  run: async ({ cursor, category, limit }) => {
    const db = getDb();
    const categoriesQuery = schema.storeCategories
      ? db.select({
        id: schema.storeCategories.id,
        slug: schema.storeCategories.slug,
        name: schema.storeCategories.name,
        caption: schema.storeCategories.caption,
        image: schema.storeCategories.image,
        enabled: schema.storeCategories.enabled,
        sortOrder: schema.storeCategories.sortOrder,
      })
        .from(schema.storeCategories)
        .where(eq(schema.storeCategories.enabled, "true"))
        .orderBy(asc(schema.storeCategories.sortOrder), asc(schema.storeCategories.name))
      : Promise.resolve([]);
    const [rows, categories] = await Promise.all([
      db
      .select({
        slug: schema.productLandings.slug,
        name: schema.productLandings.name,
        productBrand: schema.productLandings.productBrand,
        category: schema.productLandings.category,
        description: schema.productLandings.description,
        price: schema.productLandings.price,
        oldPrice: schema.productLandings.oldPrice,
        saving: schema.productLandings.saving,
        heroImage: schema.productLandings.heroImage,
        status: schema.productLandings.status,
      })
      .from(schema.productLandings)
      .where(and(
        eq(schema.productLandings.status, "active"),
        category ? eq(schema.productLandings.category, category) : undefined,
        cursor ? gt(schema.productLandings.slug, cursor) : undefined,
      ))
      .orderBy(asc(schema.productLandings.slug))
      .limit(limit + 1),
      categoriesQuery,
    ]);

    const hasMore = rows.length > limit;
    const items = hasMore ? rows.slice(0, limit) : rows;
    return {
      items,
      nextCursor: hasMore ? items[items.length - 1]?.slug ?? null : null,
      categories,
    };
  },
});
