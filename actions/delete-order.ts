import { defineAction } from "@agent-native/core/action";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { getDb, schema } from "../server/db.js";

export default defineAction({
  description: "Permanently delete a customer order by id for the authenticated store administrator.",
  schema: z.object({
    id: z.string().uuid().describe("Order id to permanently delete"),
  }),
  run: async ({ id }) => {
    const db = getDb();
    const [row] = await db
      .delete(schema.orders)
      .where(eq(schema.orders.id, id))
      .returning({ id: schema.orders.id, orderNumber: schema.orders.orderNumber });
    return row ?? null;
  },
});