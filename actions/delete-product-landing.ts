import { defineAction } from "@agent-native/core/action";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { getDb, schema } from "../server/db.js";
import { builtInProductSlugs } from "../app/lib/store-products.js";

export default defineAction({
  description: "Hide a built-in storefront product or delete a custom product landing page by slug; restore a hidden built-in product when action is restore.",
  schema: z.object({
    slug: z.string().min(1).describe("Product slug to delete"),
    action: z.enum(["delete", "restore"]).default("delete").describe('Choose "delete" to hide or remove the product, or "restore" to show a hidden built-in product again.'),
  }),
  run: async ({ slug, action }) => {
    const db = getDb();
    const [existing] = await db
      .select({ id: schema.productLandings.id })
      .from(schema.productLandings)
      .where(eq(schema.productLandings.slug, slug))
      .limit(1);

    if ((builtInProductSlugs as readonly string[]).includes(slug)) {
      if (existing) {
        const [row] = await db
          .update(schema.productLandings)
          .set({ status: action === "restore" ? "active" : "hidden", updatedAt: new Date().toISOString() })
          .where(eq(schema.productLandings.id, existing.id))
          .returning();
        return row ?? null;
      }

      if (action === "restore") return null;

      const [row] = await db
        .insert(schema.productLandings)
        .values({ slug, status: "hidden" })
        .returning();
      return row ?? null;
    }

    const [row] = await db
      .delete(schema.productLandings)
      .where(eq(schema.productLandings.slug, slug))
      .returning();

    return row ?? null;
  },
});
