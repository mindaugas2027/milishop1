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
      brandName: "brandName",
      footerText: "footerText",
      name: "name",
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
  }),
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
            gallery: '["https://example.com/1.jpg"]',
            features: '["A","B"]',
            steps: '["1","2"]',
            specs: '[{"label":"Jungtis","value":"OBD2"}]',
            faq: '[{"question":"Q","answer":"A"}]',
          },
        ]),
      }),
    });

    const result = await action.run({});

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      slug: "obd2",
      name: "OBD2",
      gallery: ["https://example.com/1.jpg"],
      features: ["A", "B"],
      steps: ["1", "2"],
      specs: [{ label: "Jungtis", value: "OBD2" }],
      faq: [{ question: "Q", answer: "A" }],
    });
  });
});
