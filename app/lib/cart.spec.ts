import { describe, expect, it } from "vitest";

import { calculateDiscount, calculateGrossProfit, formatPrice, priceValue } from "./cart";

describe("store price helpers", () => {
  it("parses localized prices and formats savings in euros", () => {
    expect(priceValue("€120,00 EUR")).toBe(120);
    expect(formatPrice(20)).toBe("20,00 €");
  });

  it("calculates the discount amount and percentage from current and old prices", () => {
    expect(calculateDiscount("100,00 €", "120,00 €")).toEqual({
      amount: 20,
      amountLabel: "20,00 €",
      percent: 17,
      percentLabel: "-17%",
    });
  });

  it("does not show a discount without a higher old price", () => {
    expect(calculateDiscount("100,00 €", "100,00 €")).toBeNull();
    expect(calculateDiscount("120,00 €", "100,00 €")).toBeNull();
    expect(calculateDiscount("100,00 €", "")).toBeNull();
  });

  it("calculates gross profit from the selling price and cost", () => {
    expect(calculateGrossProfit("24,90 €", "10,50")).toBe(14.4);
    expect(calculateGrossProfit("10,00 €", "12,10")).toBe(-2.1);
    expect(calculateGrossProfit("24,90 €", "")).toBeNull();
    expect(calculateGrossProfit("24,90 €", "not a price")).toBeNull();
  });
});
