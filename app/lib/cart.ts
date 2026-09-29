export type CartLine = {
  slug: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
};

export const CART_STORAGE_KEY = "milishop-cart";

export type ProductDiscount = {
  amount: number;
  amountLabel: string;
  percent: number;
  percentLabel: string;
};

export function priceValue(price: string) {
  return Number(price.replace(/[^\d,.-]/g, "").replace(",", ".")) || 0;
}

export function formatPrice(price: number) {
  return `${price.toFixed(2).replace(".", ",")} €`;
}

export function calculateDiscount(price: string, oldPrice: string): ProductDiscount | null {
  const current = priceValue(price);
  const previous = priceValue(oldPrice);
  if (!current || previous <= current) return null;

  const amount = Math.round((previous - current) * 100) / 100;
  const percent = Math.round((amount / previous) * 100);
  return {
    amount,
    amountLabel: formatPrice(amount),
    percent,
    percentLabel: `-${percent}%`,
  };
}

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

export function addCartItem(current: CartLine[], item: Omit<CartLine, "quantity">, amount = 1) {
  const existing = current.find((entry) => entry.slug === item.slug);

  if (existing) {
    return current.map((entry) =>
      entry.slug === item.slug ? { ...entry, quantity: entry.quantity + amount } : entry,
    );
  }

  return [...current, { ...item, quantity: amount }];
}
