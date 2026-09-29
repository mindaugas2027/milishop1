import { beforeEach, describe, expect, it, vi } from "vitest";

const mockDb = {
  select: vi.fn(),
  update: vi.fn(),
  insert: vi.fn(),
  delete: vi.fn(),
};

vi.mock("../server/db.js", () => ({
  getDb: () => mockDb,
  schema: {
    productLandings: {
      id: "id",
      slug: "slug",
      status: "status",
      updatedAt: "updatedAt",
    },
  },
}));

import action from "./delete-product-landing";

describe("delete-product-landing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("hides a built-in storefront product instead of leaving it visible", async () => {
    mockDb.select.mockReturnValue({
      from: () => ({ where: () => ({ limit: async () => [{ id: "obd2-row" }] }) }),
    });
    const returning = vi.fn().mockResolvedValue([{ slug: "obd2", status: "hidden" }]);
    const where = vi.fn().mockReturnValue({ returning });
    const set = vi.fn().mockReturnValue({ where });
    mockDb.update.mockReturnValue({ set });

    const result = await action.run({ slug: "obd2", action: "delete" });

    expect(set).toHaveBeenCalledWith({ status: "hidden", updatedAt: expect.any(String) });
    expect(result).toMatchObject({ slug: "obd2", status: "hidden" });
  });

  it("permanently deletes a custom product landing", async () => {
    mockDb.select.mockReturnValue({
      from: () => ({ where: () => ({ limit: async () => [{ id: "custom-row" }] }) }),
    });
    const returning = vi.fn().mockResolvedValue([{ slug: "custom-product" }]);
    const where = vi.fn().mockReturnValue({ returning });
    mockDb.delete.mockReturnValue({ where });

    const result = await action.run({ slug: "custom-product", action: "delete" });

    expect(mockDb.delete).toHaveBeenCalled();
    expect(result).toEqual({ slug: "custom-product" });
  });
});
