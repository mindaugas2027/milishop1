import { asc } from "drizzle-orm";
import { defineAction } from "@agent-native/core/action";
import { z } from "zod";

import { getDb, schema } from "../server/db.js";

export default defineAction({
  description: "List all storefront categories for administrator management, including disabled categories.",
  schema: z.object({}),
  http: { method: "GET" },
  run: async () => {
    const db = getDb();
    return db.select().from(schema.storeCategories)
      .orderBy(asc(schema.storeCategories.sortOrder), asc(schema.storeCategories.name));
  },
});