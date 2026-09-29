export const storeCategories = [
  { value: "automobiliui", label: "Automobiliui" },
  { value: "kasdienai", label: "Kasdienai" },
  { value: "namams", label: "Namams" },
] as const;

export type StoreCategory = (typeof storeCategories)[number]["value"];

export function isStoreCategory(value: unknown): value is StoreCategory {
  return storeCategories.some((category) => category.value === value);
}
