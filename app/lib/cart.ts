export type CartLine = {
  slug: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
};

export const CART_STORAGE_KEY = "milishop-cart";

export function readCart(): CartLine[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartLine[]) : [];
  } catch {
    return [];
  }
}

export function writeCart(cart: CartLine[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

export function addCartItem(current: CartLine[], item: Omit<CartLine, "quantity">) {
  const existing = current.find((entry) => entry.slug === item.slug);

  if (existing) {
    return current.map((entry) =>
      entry.slug === item.slug ? { ...entry, quantity: entry.quantity + 1 } : entry,
    );
  }

  return [...current, { ...item, quantity: 1 }];
}
