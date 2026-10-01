import { beforeEach, describe, expect, it, vi } from "vitest";

const mockDb = {
  delete: vi.fn(),
};

vi.mock("../server/db.js", () => ({
  getDb: () => mockDb,
  schema: {
    productLandings: {
      slug: "slug",
    },
  },
}));

import action from "./delete-product-landing";

describe("delete-product-landing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("permanently deletes a product landing", async () => {
    const returning = vi.fn().mockResolvedValue([{ slug: "obd2" }]);
    const where = vi.fn().mockReturnValue({ returning });
    mockDb.delete.mockReturnValue({ where });

    const result = await action.run({ slug: "obd2" });

    expect(mockDb.delete).toHaveBeenCalled();
    expect(where).toHaveBeenCalledWith(expect.anything());
    expect(result).toEqual({ slug: "obd2" });
  });

  it("returns null when the product does not exist", async () => {
    const returning = vi.fn().mockResolvedValue([]);
    const where = vi.fn().mockReturnValue({ returning });
    mockDb.delete.mockReturnValue({ where });

    const result = await action.run({ slug: "missing-product" });

    expect(result).toBeNull();
  });
});
