"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { generateOrderNumber, lineKey, type CartLine, type Customer } from "@/lib/order";

type CartState = {
  lines: CartLine[];
  customer: Customer;
  /** Assigned when the customer first reviews the order; kept until the order is cleared. */
  orderNo: string;
  bump: number;
  add: (itemId: string, qty: number, extras?: string[], sauces?: string[]) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  reset: () => void;
  setCustomer: (patch: Partial<Customer>) => void;
  ensureOrderNo: () => string;
};

const emptyCustomer: Customer = { name: "", phone: "", method: "", address: "", tip: 0 };

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      customer: emptyCustomer,
      orderNo: "",
      bump: 0,
      add: (itemId, qty, extras = [], sauces = []) =>
        set((s) => {
          const key = lineKey(itemId, extras, sauces);
          const existing = s.lines.find((l) => l.key === key);
          const lines = existing
            ? s.lines.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l))
            : [...s.lines, { key, itemId, qty, extras, sauces }];
          return { lines, bump: s.bump + 1 };
        }),
      setQty: (key, qty) =>
        set((s) => ({
          lines: qty <= 0 ? s.lines.filter((l) => l.key !== key) : s.lines.map((l) => (l.key === key ? { ...l, qty } : l)),
        })),
      remove: (key) => set((s) => ({ lines: s.lines.filter((l) => l.key !== key) })),
      clear: () => set({ lines: [], orderNo: "" }),
      reset: () => set({ lines: [], customer: emptyCustomer, orderNo: "" }),
      setCustomer: (patch) => set((s) => ({ customer: { ...s.customer, ...patch } })),
      ensureOrderNo: () => {
        const existing = get().orderNo;
        if (existing) return existing;
        const orderNo = generateOrderNumber();
        set({ orderNo });
        return orderNo;
      },
    }),
    {
      name: "two-tone-cafe-cart",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ lines: s.lines, customer: s.customer, orderNo: s.orderNo }),
      skipHydration: true,
    },
  ),
);

type UiState = {
  activeItemId: string | null;
  cartOpen: boolean;
  reviewOpen: boolean;
  toast: { id: number; text: string } | null;
  openItem: (id: string | null) => void;
  setCartOpen: (open: boolean) => void;
  setReviewOpen: (open: boolean) => void;
  notify: (text: string) => void;
};

export const useUi = create<UiState>()((set) => ({
  activeItemId: null,
  cartOpen: false,
  reviewOpen: false,
  toast: null,
  openItem: (activeItemId) => set({ activeItemId }),
  setCartOpen: (cartOpen) => set({ cartOpen }),
  setReviewOpen: (reviewOpen) => set({ reviewOpen }),
  notify: (text) => {
    const id = Date.now();
    set({ toast: { id, text } });
    setTimeout(() => set((s) => (s.toast?.id === id ? { toast: null } : s)), 2200);
  },
}));
