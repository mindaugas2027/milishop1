import { defineAction } from "@agent-native/core/action";
import { desc } from "drizzle-orm";
import { z } from "zod";

import { getDb, schema } from "../server/db.js";

export default defineAction({
  description: "List the 100 most recent customer orders with private contact details, status, item snapshots, and gross profit for the authenticated store administrator.",
  schema: z.object({}),
  http: { method: "GET" },
  run: async () => {
    const db = getDb();
    const rows = await db
      .select()
      .from(schema.orders)
      .orderBy(desc(schema.orders.createdAt))
      .limit(100);
    return rows.map((row) => ({
      ...row,
      items: JSON.parse(row.items) as Array<{
        slug: string;
        name: string;
        image: string;
        quantity: number;
        unitPriceCents: number;
        unitCostCents: number | null;
      }>,
    }));
  },
});