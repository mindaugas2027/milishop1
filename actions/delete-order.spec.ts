import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  deletedOrder: { id: "5c967bb4-fb4c-4682-805f-adbb3e47b34f", orderNumber: "MS-2026-12345678" } as { id: string; orderNumber: string } | null,
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn(() => "order-id-filter"),
}));

vi.mock("../server/db.js", () => ({
  getDb: () => ({
    delete: () => ({
      where: () => ({ returning: async () => mocks.deletedOrder ? [mocks.deletedOrder] : [] }),
    }),
  }),
  schema: { orders: { id: "id", orderNumber: "orderNumber" } },
}));

import action from "./delete-order";

describe("delete-order", () => {
  beforeEach(() => {
    mocks.deletedOrder = { id: "5c967bb4-fb4c-4682-805f-adbb3e47b34f", orderNumber: "MS-2026-12345678" };
  });

  it("deletes and returns the selected order", async () => {
    await expect(action.run({ id: "5c967bb4-fb4c-4682-805f-adbb3e47b34f" })).resolves.toEqual(mocks.deletedOrder);
  });

  it("returns null when the order does not exist", async () => {
    mocks.deletedOrder = null;
    await expect(action.run({ id: "5c967bb4-fb4c-4682-805f-adbb3e47b34f" })).resolves.toBeNull();
  });
});