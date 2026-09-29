import { beforeEach, describe, expect, it, vi } from "vitest";

const mockDb = {
  select: vi.fn(),
};

vi.mock("../server/db.js", () => ({
  getDb: () => mockDb,
  schema: {
    productLandings: {
      id: "id",
      slug: "slug",
      status: "status",
      brandName: "brandName",
      footerText: "footerText",
      name: "name",
      category: "category",
      eyebrow: "eyebrow",
      description: "description",
      longDescription: "longDescription",
      price: "price",
      oldPrice: "oldPrice",
      saving: "saving",
      heroImage: "heroImage",
      gallery: "gallery",
      features: "features",
      steps: "steps",
      specs: "specs",
      faq: "faq",
      deliveryInfo: "deliveryInfo",
      returnsInfo: "returnsInfo",
      ctaText: "ctaText",
      finalCtaEyebrow: "finalCtaEyebrow",
      finalCtaTitle: "finalCtaTitle",
      finalCtaText: "finalCtaText",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  },
}));

import action from "./list-product-landings";

describe("list-product-landings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns parsed product landing rows in newest-first order", async () => {
    mockDb.select.mockReturnValue({
      from: vi.fn().mockReturnValue({
        orderBy: vi.fn().mockResolvedValue([
          {
            slug: "obd2",
            name: "OBD2",
            category: "automobiliui",
            description: "OBD2 produktas",
            price: "39,90 €",
            oldPrice: "49,90 €",
            saving: "Sutaupai 10 €",
            heroImage: "https://example.com/1.jpg",
            status: "active",
          },
          {
            slug: "hidden-product",
            name: "Paslėptas",
            description: "",
            price: "1,00 €",
            oldPrice: "",
            saving: "",
            heroImage: "https://example.com/hidden.jpg",
            status: "hidden",
          },
        ]),
      }),
    });

    const result = await action.run({});

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      slug: "obd2",
      name: "OBD2",
      category: "automobiliui",
      description: "OBD2 produktas",
      price: "39,90 €",
      oldPrice: "49,90 €",
      saving: "Sutaupai 10 €",
      heroImage: "https://example.com/1.jpg",
      status: "active",
    });
    expect(result[1]).toMatchObject({ slug: "hidden-product", status: "hidden" });
  });
});
