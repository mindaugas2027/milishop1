import { eq } from "drizzle-orm";
import { z } from "zod";
import { defineAction } from "@agent-native/core/action";

import { getDb, schema } from "../server/db.js";

const categorySchema = z.object({
  id: z.string().uuid().optional().describe("Existing category id when editing; omit to create"),
  slug: z.string().trim().min(1).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must use lowercase letters, numbers, and hyphens").describe("Stable category slug"),
  name: z.string().trim().min(1).max(80).describe("Category display name"),
  caption: z.string().trim().max(160).describe("Short category caption"),
  image: z.string().url().or(z.literal("")).describe("Optional category image URL"),
  enabled: z.boolean().describe("Whether the category is visible in the storefront"),
  sortOrder: z.number().int().min(0).max(9999).describe("Display order; lower values appear first"),
});

export default defineAction({
  description: "Create or update one storefront category, including its image, visibility, and display order.",
  schema: categorySchema,
  run: async (input) => {
    const db = getDb();
    const values = {
      slug: input.slug,
      name: input.name,
      caption: input.caption,
      image: input.image,
      enabled: input.enabled ? "true" : "false",
      sortOrder: String(input.sortOrder),
      updatedAt: new Date().toISOString(),
    };
    if (input.id) {
      const [row] = await db.update(schema.storeCategories)
        .set(values)
        .where(eq(schema.storeCategories.id, input.id))
        .returning();
      if (!row) throw new Error("Category not found.");
      return row;
    }
    const [row] = await db.insert(schema.storeCategories).values(values).returning();
    return row;
  },
});