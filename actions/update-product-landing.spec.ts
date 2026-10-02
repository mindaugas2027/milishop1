import { beforeEach, describe, expect, it, vi } from "vitest";

const mockDb = {
  select: vi.fn(),
  insert: vi.fn(),
};

vi.mock("../server/db.js", () => ({
  getDb: () => mockDb,
  schema: {
    productLandings: {
      id: "id",
      slug: "slug",
      status: "status",
    },
  },
}));

import action from "./update-product-landing";

const productInput = {
  slug: "car-mount",
  brandName: "Milishop",
  footerText: "Kasdienai",
  name: "Telefono laikiklis",
  category: "automobiliui",
  eyebrow: "Kelionei",
  description: "Patogesnė kelionė.",
  longDescription: "Laikyk telefoną saugiai.",
  price: "24,90 €",
  oldPrice: "29,90 €",
  saving: "Sutaupyk 5 €",
  heroImage: "https://images.example.test/car-mount.jpg",
  supplierUrl: "https://supplier.example.test/order/car-mount",
  gallery: ["https://images.example.test/car-mount.jpg"],
  features: [],
  steps: [],
  specs: [],
  showSpecs: false,
  faq: [],
  showFaq: true,
  deliveryInfo: "Pristatymas per 1–2 d. d.",
  returnsInfo: "14 dienų grąžinimas",
  ctaText: "Pirkti dabar",
  finalCtaEyebrow: "Kelionei",
  finalCtaTitle: "Telefono laikiklis",
  finalCtaText: "Pirkti dabar",
};

describe("update-product-landing", () => {
  beforeEach(() => vi.clearAllMocks());

  it("stores the supplier order URL with the product and returns decoded content", async () => {
    mockDb.select.mockReturnValue({
      from: () => ({ where: () => ({ limit: async () => [] }) }),
    });
    const savedRow = {
      id: "product-1",
      ...productInput,
      status: "active",
      gallery: JSON.stringify(productInput.gallery),
      features: "[]",
      steps: "[]",
      specs: "[]",
      faq: "[]",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    };
    const returning = vi.fn().mockResolvedValue([savedRow]);
    let insertedValues: Record<string, unknown> | undefined;
    mockDb.insert.mockReturnValue({
      values: (values: Record<string, unknown>) => {
        insertedValues = values;
        return { returning };
      },
    });

    const result = await action.run(productInput);

    expect(insertedValues?.supplierUrl).toBe(productInput.supplierUrl);
    expect(insertedValues?.category).toBe(productInput.category);
    expect(result.supplierUrl).toBe(productInput.supplierUrl);
    expect(result.category).toBe(productInput.category);
    expect(insertedValues?.showSpecs).toBe(false);
    expect(insertedValues?.showFaq).toBe(true);
    expect(result.gallery).toEqual(productInput.gallery);
  });
});
