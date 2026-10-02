import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  products: [] as Array<Record<string, unknown>>,
  insertedValues: undefined as Record<string, unknown> | undefined,
}));

vi.mock("drizzle-orm", () => ({
  inArray: vi.fn(() => "products-filter"),
}));

vi.mock("../server/db.js", () => ({
  getDb: () => ({
    select: () => ({ from: () => ({ where: async () => mocks.products }) }),
    insert: () => ({
      values: (values: Record<string, unknown>) => {
        mocks.insertedValues = values;
        return { returning: async () => [{ id: values.id, orderNumber: values.orderNumber }] };
      },
    }),
  }),
  schema: {
    productLandings: { slug: "slug", name: "name", price: "price", costPrice: "costPrice", heroImage: "heroImage", status: "status" },
    orders: { id: "id", orderNumber: "orderNumber" },
  },
}));

import action from "./create-order";

describe("create-order", () => {
  beforeEach(() => {
    mocks.products = [{
      slug: "phone-mount",
      name: "Telefono laikiklis",
      price: "24,90 €",
      costPrice: "10,50",
      heroImage: "https://images.example.test/product.jpg",
      status: "active",
    }];
    mocks.insertedValues = undefined;
  });

  it("uses current database prices and stores per-order cost and profit snapshots", async () => {
    const result = await action.run({
      customerName: "Test Pirkėjas",
      customerEmail: "buyer@example.test",
      customerPhone: "+37060000000",
      shippingAddress: "Testų g. 1, Vilnius",
      items: [{ slug: "phone-mount", quantity: 2 }],
    });

    const savedItems = JSON.parse(String(mocks.insertedValues?.items));
    expect(mocks.insertedValues?.totalCents).toBe("4980");
    expect(mocks.insertedValues?.costCents).toBe("2100");
    expect(mocks.insertedValues?.profitCents).toBe("2880");
    expect(savedItems[0]).toMatchObject({ unitPriceCents: 2490, unitCostCents: 1050, quantity: 2 });
    expect(result.totalCents).toBe(4980);
    expect(result.status).toBe("received");
  });

  it("leaves profit unknown when the product has no saved cost", async () => {
    mocks.products[0].costPrice = "";

    await action.run({
      customerName: "Test Pirkėjas",
      customerEmail: "buyer@example.test",
      customerPhone: "+37060000000",
      shippingAddress: "Testų g. 1, Vilnius",
      items: [{ slug: "phone-mount", quantity: 1 }],
    });

    expect(mocks.insertedValues?.costCents).toBe("");
    expect(mocks.insertedValues?.profitCents).toBe("");
  });
});