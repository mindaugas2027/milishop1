import { defineAction } from "@agent-native/core/action";
import { desc } from "drizzle-orm";
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
  description: "List all product landing pages, newest first.",
  schema: z.object({}),
  http: { method: "GET" },
  run: async () => {
    const db = getDb();
    const rows = await db.select().from(schema.productLandings).orderBy(desc(schema.productLandings.updatedAt));

    return rows.map(deserialize);
  },
});
