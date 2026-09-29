import { asc, eq } from "drizzle-orm";
import { defineAction } from "@agent-native/core/action";
import { z } from "zod";

import { getDb, schema } from "../server/db.js";

export default defineAction({
  description: "List enabled storefront categories in display order.",
  schema: z.object({}),
  http: { method: "GET" },
  requiresAuth: false,
  readOnly: true,
  run: async () => {
    const db = getDb();
    return db.select().from(schema.storeCategories)
      .where(eq(schema.storeCategories.enabled, "true"))
      .orderBy(asc(schema.storeCategories.sortOrder), asc(schema.storeCategories.name));
  },
});