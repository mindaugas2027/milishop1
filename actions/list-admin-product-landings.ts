import { defineAction } from "@agent-native/core/action";
import { and, asc, gt, ilike, or } from "drizzle-orm";
import { z } from "zod";

import { getDb, schema } from "../server/db.js";

export default defineAction({
  description: "List a cursor-paginated page of products for the authenticated store administrator, including hidden products.",
  schema: z.object({
    cursor: z.string().min(1).max(120).optional().describe("Return products after this slug"),
    search: z.string().trim().max(160).default("").describe("Optional product name or slug search"),
    limit: z.coerce.number().int().min(1).max(48).default(24).describe("Products per page; defaults to 24"),
  }),
  http: { method: "GET" },
  run: async ({ cursor, search, limit }) => {
    const db = getDb();
    const rows = await db
      .select({
        slug: schema.productLandings.slug,
        name: schema.productLandings.name,
        price: schema.productLandings.price,
        costPrice: schema.productLandings.costPrice,
        heroImage: schema.productLandings.heroImage,
        supplierUrl: schema.productLandings.supplierUrl,
        status: schema.productLandings.status,
        updatedAt: schema.productLandings.updatedAt,
      })
      .from(schema.productLandings)
      .where(and(
        cursor ? gt(schema.productLandings.slug, cursor) : undefined,
        search
          ? or(
              ilike(schema.productLandings.name, `%${search}%`),
              ilike(schema.productLandings.slug, `%${search}%`),
            )
          : undefined,
      ))
      .orderBy(asc(schema.productLandings.slug))
      .limit(limit + 1);

    const hasMore = rows.length > limit;
    const items = hasMore ? rows.slice(0, limit) : rows;
    return {
      items,
      nextCursor: hasMore ? items[items.length - 1]?.slug ?? null : null,
    };
  },
});
