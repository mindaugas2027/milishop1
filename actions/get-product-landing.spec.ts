import { beforeEach, describe, expect, it, vi } from "vitest";

const mockDb = {
  select: vi.fn(),
};

vi.mock("../server/db.js", () => ({
  getDb: () => mockDb,
  schema: {
    productLandings: Object.fromEntries([
      "id", "slug", "status", "supplierUrl", "brandName", "footerText", "name",
      "category", "eyebrow", "description", "longDescription", "price", "oldPrice", "saving",
      "heroImage", "gallery", "features", "steps", "specs", "faq", "deliveryInfo",
      "returnsInfo", "ctaText", "finalCtaEyebrow", "finalCtaTitle", "finalCtaText",
      "createdAt", "updatedAt",
    ].map((key) => [key, key])),
  },
}));

import action from "./get-product-landing";

describe("get-product-landing public response", () => {
  beforeEach(() => vi.clearAllMocks());

  it("does not select or return the private supplier URL", async () => {
    const row = {
      id: "product-1",
      slug: "car-mount",
      status: "active",
      supplierUrl: "https://supplier.example.test/private-order-page",
      brandName: "Milishop",
      footerText: "",
      name: "Car mount",
      category: "automobiliui",
      eyebrow: "",
      description: "",
      longDescription: "",
      price: "10,00 €",
      oldPrice: "",
      saving: "",
      heroImage: "https://images.example.test/car.jpg",
      gallery: "[]",
      features: "[]",
      steps: "[]",
      specs: "[]",
      faq: "[]",
      deliveryInfo: "",
      returnsInfo: "",
      ctaText: "Buy",
      finalCtaEyebrow: "",
      finalCtaTitle: "Car mount",
      finalCtaText: "Buy",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    };
    mockDb.select.mockReturnValue({
      from: () => ({ where: () => ({ limit: async () => [row] }) }),
    });

    const result = await action.run({ slug: "car-mount" });

    expect(mockDb.select.mock.calls[0][0]).not.toHaveProperty("supplierUrl");
    expect(result).not.toHaveProperty("supplierUrl");
    expect(result).toMatchObject({ category: "automobiliui" });
  });
});
