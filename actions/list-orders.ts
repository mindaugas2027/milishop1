import { defineAction } from "@agent-native/core/action";
import { desc, inArray } from "drizzle-orm";
import { z } from "zod";

import { getDb, schema } from "../server/db.js";

export default defineAction({
  description: "List the 100 most recent customer orders with private contact details, supplier links, status, item snapshots, and gross profit for the authenticated store administrator.",
  schema: z.object({}),
  http: { method: "GET" },
  run: async () => {
    const db = getDb();
    const rows = await db
      .select()
      .from(schema.orders)
      .orderBy(desc(schema.orders.createdAt))
      .limit(100);
    const orders = rows.map((row) => ({
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
    const slugs = [...new Set(orders.flatMap((order) => order.items.map((item) => item.slug)))];
    const products = slugs.length > 0
      ? await db
          .select({ slug: schema.productLandings.slug, supplierUrl: schema.productLandings.supplierUrl })
          .from(schema.productLandings)
          .where(inArray(schema.productLandings.slug, slugs))
      : [];
    const supplierUrls = new Map(products.map((product) => {
      try {
        return [product.slug, new URL(product.supplierUrl).protocol === "https:" ? product.supplierUrl : ""] as const;
      } catch {
        return [product.slug, ""] as const;
      }
    }));

    return orders.map((order) => ({
      ...order,
      items: order.items.map((item) => ({ ...item, supplierUrl: supplierUrls.get(item.slug) ?? "" })),
    }));
  },
});