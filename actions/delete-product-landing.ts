import { defineAction } from "@agent-native/core/action";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { getDb, schema } from "../server/db.js";

export default defineAction({
  description: "Hide or restore a product landing page by slug without deleting its database record.",
  schema: z.object({
    slug: z.string().min(1).describe("Product slug to hide or restore"),
    action: z.enum(["delete", "restore"]).default("delete").describe('Choose "delete" to hide or "restore" to show the product.'),
  }),
  run: async ({ slug, action }) => {
    const db = getDb();
    const [existing] = await db
      .select({ id: schema.productLandings.id })
      .from(schema.productLandings)
      .where(eq(schema.productLandings.slug, slug))
      .limit(1);

    if (!existing) return null;

    const [row] = await db
      .update(schema.productLandings)
      .set({ status: action === "restore" ? "active" : "hidden", updatedAt: new Date().toISOString() })
      .where(eq(schema.productLandings.id, existing.id))
      .returning();
    return row ?? null;
  },
});
