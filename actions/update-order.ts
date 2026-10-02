import { defineAction, fail } from "@agent-native/core/action";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { getDb, schema } from "../server/db.js";

const updateInput = z.object({
  id: z.string().uuid().describe("Užsakymo id"),
  status: z.enum(["received", "processing", "shipped", "completed", "cancelled"]).optional()
    .describe('Užsakymo būsena: "received", "processing", "shipped", "completed" arba "cancelled"'),
  paymentStatus: z.enum(["unpaid", "paid", "refunded"]).optional()
    .describe('Apmokėjimo būsena: "unpaid", "paid" arba "refunded"'),
}).refine(({ status, paymentStatus }) => status !== undefined || paymentStatus !== undefined, {
  message: "Nurodykite užsakymo arba apmokėjimo būseną.",
});

export default defineAction({
  description: "Update an order's fulfillment status and/or manually verified payment status for the authenticated store administrator.",
  schema: updateInput,
  run: async ({ id, status, paymentStatus }) => {
    const patch: { status?: string; paymentStatus?: string; updatedAt: string } = {
      updatedAt: new Date().toISOString(),
    };
    if (status !== undefined) patch.status = status;
    if (paymentStatus !== undefined) patch.paymentStatus = paymentStatus;

    const db = getDb();
    const [order] = await db
      .update(schema.orders)
      .set(patch)
      .where(eq(schema.orders.id, id))
      .returning({ id: schema.orders.id, status: schema.orders.status, paymentStatus: schema.orders.paymentStatus });
    if (!order) fail("Užsakymas nerastas.");
    return order;
  },
});