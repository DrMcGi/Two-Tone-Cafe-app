"use client";

import { useEffect } from "react";
import { useCart } from "@/store/cart";

/** Restores the saved cart from localStorage after hydration (avoids SSR mismatch). */
export function CartHydrator() {
  useEffect(() => {
    void useCart.persist.rehydrate();
  }, []);
  return null;
}
