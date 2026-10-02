/**
 * See what the user is currently looking at on screen.
 *
 * Reads and returns the current navigation state from application state.
 *
 * Usage:
 *   pnpm action view-screen
 */

import { defineAction } from "@agent-native/core/action";
import { readAppState } from "@agent-native/core/application-state";
import { z } from "zod";

export default defineAction({
  description:
    "See what the user is currently looking at on screen. Returns the current navigation state for the app canvas plus agent rail. Always call this first before taking any action.",
  schema: z.object({}),
  http: false,
  readOnly: true,
  run: async () => {
    const navigation = await readAppState("navigation");
    const url = (await readAppState("__url__")) as {
      searchParams?: Record<string, string>;
    } | null;

    const screen: Record<string, unknown> = {};
    if (navigation) screen.navigation = navigation;
    const category = url?.searchParams?.category;
    if (category && ["automobiliui", "kasdienai", "namams"].includes(category)) {
      screen.activeFilters = { category };
    }
    if (navigation?.activeTab === "orders" && navigation?.path === "/admin") {
      screen.adminView = "orders";
    }

    if (Object.keys(screen).length === 0) {
      return "No application state found. Is the app running?";
    }
    return screen;
  },
});
