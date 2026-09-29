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
      category: "category",
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

  it("returns an active product page with a next cursor", async () => {
    mockDb.select.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
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
            slug: "namu-akcentas",
            name: "Keraminė detalė",
            category: "namams",
            description: "Namams",
            price: "32,00 €",
            oldPrice: "",
            saving: "",
            heroImage: "https://example.com/2.jpg",
            status: "active",
          },
            ]),
          }),
        }),
      }),
    });

    const result = await action.run({ limit: 1 });

    expect(result).toEqual({
      items: [{
        slug: "obd2",
        name: "OBD2",
        category: "automobiliui",
        description: "OBD2 produktas",
        price: "39,90 €",
        oldPrice: "49,90 €",
        saving: "Sutaupai 10 €",
        heroImage: "https://example.com/1.jpg",
        status: "active",
      }],
      nextCursor: "obd2",
      categories: [],
    });
  });
});
