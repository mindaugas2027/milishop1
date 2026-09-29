import { describe, expect, it } from "vitest";

import { getAdminTabConfig } from "./admin";

describe("admin tab config", () => {
  it("exposes product, order, and settings destinations", () => {
    expect(getAdminTabConfig()).toEqual(["Produktai", "Užsakymai", "Nustatymai"]);
  });
});
