export const defaultStoreCategories = [
  { value: "automobiliui", label: "Automobiliui" },
  { value: "kasdienai", label: "Kasdienai" },
  { value: "namams", label: "Namams" },
] as const;

export type StoreCategory = string;

export type StoreCategoryRecord = {
  id: string;
  slug: string;
  name: string;
  caption: string;
  image: string;
  enabled: string;
  sortOrder: string;
};

export const storeCategories = defaultStoreCategories;

export function isStoreCategory(value: unknown): value is StoreCategory {
  return typeof value === "string" && value.trim().length > 0;
}

export function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}
