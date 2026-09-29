import { defineAction } from "@agent-native/core/action";
import { desc } from "drizzle-orm";
import { z } from "zod";

import { getDb, schema } from "../server/db.js";

export default defineAction({
  description: "List product landing pages for the authenticated store administrator, including hidden products.",
  schema: z.object({}),
  http: { method: "GET" },
  run: async () => {
    const db = getDb();
    return db
      .select({
        slug: schema.productLandings.slug,
        name: schema.productLandings.name,
        price: schema.productLandings.price,
        heroImage: schema.productLandings.heroImage,
        supplierUrl: schema.productLandings.supplierUrl,
        status: schema.productLandings.status,
        updatedAt: schema.productLandings.updatedAt,
      })
      .from(schema.productLandings)
      .orderBy(desc(schema.productLandings.updatedAt));
  },
});
