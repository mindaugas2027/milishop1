import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  select: vi.fn(),
  orders: [] as Array<Record<string, unknown>>,
  products: [] as Array<{ slug: string; supplierUrl: string }>,
}));

vi.mock("drizzle-orm", () => ({
  desc: vi.fn((column) => `${String(column)}-desc`),
  inArray: vi.fn(() => "supplier-url-filter"),
}));

vi.mock("../server/db.js", () => ({
  getDb: () => ({ select: mocks.select }),
  schema: {
    orders: { createdAt: "createdAt" },
    productLandings: { slug: "slug", supplierUrl: "supplierUrl" },
  },
}));

import action from "./list-orders";

describe("list-orders supplier links", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.orders = [{
      id: "order-1",
      items: JSON.stringify([
        { slug: "phone-mount", name: "Laikiklis", image: "", quantity: 2, unitPriceCents: 2490, unitCostCents: 1050 },
        { slug: "cable", name: "Kabelis", image: "", quantity: 1, unitPriceCents: 990, unitCostCents: null },
      ]),
    }];
    mocks.products = [
      { slug: "phone-mount", supplierUrl: "https://supplier.example.test/phone-mount" },
      { slug: "cable", supplierUrl: "javascript:alert(1)" },
    ];
    mocks.select
      .mockReturnValueOnce({ from: () => ({ orderBy: () => ({ limit: async () => mocks.orders }) }) })
      .mockReturnValueOnce({ from: () => ({ where: async () => mocks.products }) });
  });

  it("adds a safe supplier URL to each matching order item", async () => {
    const [order] = await action.run({});

    expect(order.items).toMatchObject([
      { slug: "phone-mount", supplierUrl: "https://supplier.example.test/phone-mount" },
      { slug: "cable", supplierUrl: "" },
    ]);
  });

  it("skips the product lookup when there are no orders", async () => {
    mocks.orders = [];
    mocks.select.mockReset().mockReturnValueOnce({ from: () => ({ orderBy: () => ({ limit: async () => [] }) }) });

    await expect(action.run({})).resolves.toEqual([]);
    expect(mocks.select).toHaveBeenCalledTimes(1);
  });
});