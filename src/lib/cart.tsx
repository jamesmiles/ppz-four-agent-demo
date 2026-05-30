"use client";

/**
 * Client-side cart, persisted to localStorage. Payment/checkout are fully
 * stubbed (no real money) — this is demo state only.
 */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { products, type Grind } from "@/data/products";

export type CartItem = {
  slug: string;
  grind: Grind;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  add: (slug: string, grind: Grind, qty?: number) => void;
  setQty: (slug: string, grind: Grind, qty: number) => void;
  remove: (slug: string, grind: Grind) => void;
  clear: () => void;
  subtotalCents: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "northwind-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Hydrate from localStorage after mount (avoids SSR mismatch).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // Hydrate from localStorage post-mount to avoid an SSR/client mismatch.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore corrupt storage */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore quota errors */
    }
  }, [items]);

  const add = useCallback((slug: string, grind: Grind, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === slug && i.grind === grind);
      if (existing) {
        return prev.map((i) =>
          i === existing ? { ...i, qty: i.qty + qty } : i,
        );
      }
      return [...prev, { slug, grind, qty }];
    });
  }, []);

  const setQty = useCallback((slug: string, grind: Grind, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => !(i.slug === slug && i.grind === grind))
        : prev.map((i) =>
            i.slug === slug && i.grind === grind ? { ...i, qty } : i,
          ),
    );
  }, []);

  const remove = useCallback((slug: string, grind: Grind) => {
    setItems((prev) =>
      prev.filter((i) => !(i.slug === slug && i.grind === grind)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = items.reduce((n, i) => n + i.qty, 0);
  const subtotalCents = items.reduce((sum, i) => {
    const p = products.find((pr) => pr.slug === i.slug);
    return sum + (p ? p.priceCents * i.qty : 0);
  }, 0);

  return (
    <CartContext.Provider
      value={{ items, count, add, setQty, remove, clear, subtotalCents }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
