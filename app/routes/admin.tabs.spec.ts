import { describe, expect, it } from "vitest";

import { getAdminTabConfig } from "./admin";

describe("admin tab config", () => {
  it("exposes the expected admin navigation tabs in order", () => {
    expect(getAdminTabConfig()).toEqual([
      "Apžvalga",
      "Produktai",
      "Užsakymai",
      "Nustatymai",
    ]);
  });
});
