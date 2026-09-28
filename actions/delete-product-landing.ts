import { defineAction } from "@agent-native/core/action";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { getDb, schema } from "../server/db.js";

export default defineAction({
  description: "Delete a product landing page by product slug.",
  schema: z.object({
    slug: z.string().min(1).describe("Product slug to delete"),
  }),
  run: async ({ slug }) => {
    const db = getDb();
    const [row] = await db
      .delete(schema.productLandings)
      .where(eq(schema.productLandings.slug, slug))
      .returning();

    return row ?? null;
  },
});
