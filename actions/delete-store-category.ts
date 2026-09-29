import { and, count, eq } from "drizzle-orm";
import { z } from "zod";
import { defineAction } from "@agent-native/core/action";

import { getDb, schema } from "../server/db.js";

export default defineAction({
  description: "Delete a storefront category when no products are assigned to it.",
  schema: z.object({ id: z.string().uuid().describe("Category id to delete") }),
  run: async ({ id }) => {
    const db = getDb();
    const [category] = await db.select({ slug: schema.storeCategories.slug })
      .from(schema.storeCategories)
      .where(eq(schema.storeCategories.id, id))
      .limit(1);
    if (!category) return null;
    const [{ value: productCount }] = await db.select({ value: count() })
      .from(schema.productLandings)
      .where(and(eq(schema.productLandings.category, category.slug), eq(schema.productLandings.status, "active")));
    if (productCount > 0) throw new Error("Move or hide the products in this category before deleting it.");
    await db.delete(schema.storeCategories).where(eq(schema.storeCategories.id, id));
    return { id };
  },
});