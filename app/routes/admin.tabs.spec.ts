import { describe, expect, it } from "vitest";

import { getAdminTabConfig } from "./admin";

describe("admin tab config", () => {
  it("shows only the working product management destination", () => {
    expect(getAdminTabConfig()).toEqual(["Produktai"]);
  });
});
