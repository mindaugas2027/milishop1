import { defineAction } from "@agent-native/core/action";
import { getSetting } from "@agent-native/core/settings";
import { z } from "zod";

const settingKey = "milishop:store-social-links";

function readSafeUrl(value: unknown, hosts: string[]) {
  if (typeof value !== "string" || !value) return "";
  try {
    const url = new URL(value);
    return url.protocol === "https:" && hosts.includes(url.hostname.toLowerCase())
      ? url.toString()
      : "";
  } catch {
    return "";
  }
}

export default defineAction({
  description: "Read the public Instagram and Facebook links for the Milishop storefront.",
  schema: z.object({}),
  http: { method: "GET" },
  requiresAuth: false,
  readOnly: true,
  run: async () => {
    const setting = await getSetting(settingKey);
    return {
      instagramUrl: readSafeUrl(setting?.instagramUrl, ["instagram.com", "www.instagram.com"]),
      facebookUrl: readSafeUrl(setting?.facebookUrl, ["facebook.com", "www.facebook.com", "m.facebook.com", "fb.com", "www.fb.com"]),
    };
  },
});