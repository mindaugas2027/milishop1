import { defineAction } from "@agent-native/core/action";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { getDb, schema } from "../server/db.js";

export default defineAction({
  description: "Read the complete private admin record for one product, including its supplier order URL.",
  schema: z.object({
    slug: z.string().min(1).describe("Product slug to edit"),
  }),
  http: { method: "GET" },
  run: async ({ slug }) => {
    const db = getDb();
    const [row] = await db
      .select()
      .from(schema.productLandings)
      .where(eq(schema.productLandings.slug, slug))
      .limit(1);

    if (!row) return null;
    return {
      ...row,
      gallery: JSON.parse(row.gallery) as string[],
      features: JSON.parse(row.features) as string[],
      steps: JSON.parse(row.steps) as string[],
      specs: JSON.parse(row.specs) as Array<{ label: string; value: string }>,
      faq: JSON.parse(row.faq) as Array<{ question: string; answer: string }>,
    };
  },
});