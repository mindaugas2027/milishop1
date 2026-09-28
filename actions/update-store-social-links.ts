import { defineAction } from "@agent-native/core/action";
import { putSetting } from "@agent-native/core/settings";
import { z } from "zod";

const settingKey = "milishop:store-social-links";

function isAllowedUrl(value: string, hosts: string[]) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && hosts.includes(url.hostname.toLowerCase());
  } catch {
    return false;
  }
}

const instagramUrlSchema = z.string().trim().max(2048)
  .refine((value) => isAllowedUrl(value, ["instagram.com", "www.instagram.com"]), "Įveskite HTTPS Instagram nuorodą.");
const facebookUrlSchema = z.string().trim().max(2048)
  .refine((value) => isAllowedUrl(value, ["facebook.com", "www.facebook.com", "m.facebook.com", "fb.com", "www.fb.com"]), "Įveskite HTTPS Facebook nuorodą.");

export default defineAction({
  description: "Save the Instagram and Facebook links displayed in the Milishop storefront footer.",
  schema: z.object({
    instagramUrl: instagramUrlSchema.describe("HTTPS Instagram profile URL, or blank to hide the link"),
    facebookUrl: facebookUrlSchema.describe("HTTPS Facebook page URL, or blank to hide the link"),
  }),
  run: async ({ instagramUrl, facebookUrl }) => {
    const links = { instagramUrl, facebookUrl };
    await putSetting(settingKey, links);
    return links;
  },
});