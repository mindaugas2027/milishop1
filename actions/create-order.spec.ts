import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  products: [] as Array<Record<string, unknown>>,
  insertedValues: undefined as Record<string, unknown> | undefined,
  checkoutParams: undefined as Record<string, unknown> | undefined,
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

vi.mock("../server/lib/stripe.js", () => ({
  getStripeClient: async () => ({
    checkout: {
      sessions: {
        create: async (params: Record<string, unknown>) => {
          mocks.checkoutParams = params;
          return { id: "cs_test_example", url: "https://checkout.stripe.test/session" };
        },
        expire: async () => ({}),
      },
    },
  }),
}));

vi.mock("@agent-native/core/server", () => ({
  getRequestContext: () => ({ requestOrigin: "https://shop.example.test" }),
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
    mocks.checkoutParams = undefined;
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
    expect(result.paymentStatus).toBe("unpaid");
    expect(result.checkoutUrl).toBe("https://checkout.stripe.test/session");
    expect(mocks.insertedValues?.paymentMethod).toBe("stripe");
    expect(mocks.insertedValues?.paymentStatus).toBe("unpaid");
    expect(mocks.checkoutParams).toMatchObject({
      mode: "payment",
      customer_email: "buyer@example.test",
      line_items: [{ price_data: { currency: "eur", unit_amount: 2490 }, quantity: 2 }],
      success_url: expect.stringContaining("checkout=success"),
      cancel_url: "https://shop.example.test/?checkout=cancelled",
    });
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