import { CURRENCY, DELIVERY_FEE_BASE, getExtra, getItem } from "./menu.ts";

export type OrderMethod = "" | "Collection" | "Delivery";

export type CartLine = {
  key: string;
  itemId: string;
  qty: number;
  extras: string[];
  sauces: string[];
};

export type Customer = {
  name: string;
  phone: string;
  method: OrderMethod;
  address: string;
  tip: number;
};

export const formatR = (n: number) => CURRENCY + Number(n).toFixed(2);
export const formatShort = (n: number) => CURRENCY + (Number.isInteger(n) ? n : n.toFixed(2));

export const lineKey = (itemId: string, extras: string[], sauces: string[]) =>
  [itemId, [...extras].sort().join("+"), [...sauces].sort().join("+")].join("|");

export function unitPrice(itemId: string, extras: string[]) {
  const item = getItem(itemId);
  if (!item) return 0;
  return extras.reduce((sum, id) => sum + (getExtra(id)?.price ?? 0), item.price);
}

export const lineTotal = (line: CartLine) => unitPrice(line.itemId, line.extras) * line.qty;

export const cartCount = (lines: CartLine[]) => lines.reduce((n, l) => n + l.qty, 0);

export const subtotalOf = (lines: CartLine[]) => lines.reduce((sum, l) => sum + lineTotal(l), 0);

export const deliveryFeeOf = (method: OrderMethod, subtotal: number) =>
  method === "Delivery" && subtotal > 0 ? DELIVERY_FEE_BASE : 0;

export function totalsOf(lines: CartLine[], customer: Pick<Customer, "method" | "tip">) {
  const subtotal = subtotalOf(lines);
  const discount = 0;
  const deliveryFee = deliveryFeeOf(customer.method, subtotal);
  const tip = Math.max(0, Number(customer.tip) || 0);
  return { subtotal: subtotal - discount, discount, deliveryFee, tip, total: subtotal - discount + deliveryFee + tip };
}

export function missingFields(lines: CartLine[], c: Customer) {
  const missing: string[] = [];
  if (lines.length === 0) missing.push("Add at least one item");
  if (!c.name.trim()) missing.push("Your name");
  if (!c.phone.trim()) missing.push("Phone number");
  if (!c.method) missing.push("Collection or delivery");
  if (c.method === "Delivery" && !c.address.trim()) missing.push("Delivery address");
  return missing;
}

/** Short, human-friendly reference the café can quote back, e.g. "TT-48213". */
export function generateOrderNumber() {
  const n = new Uint32Array(1);
  crypto.getRandomValues(n);
  return `TT-${String(10000 + (n[0] % 90000))}`;
}

/** Same message format the café already receives from the original site, plus an order reference. */
export function buildWhatsAppMessage(lines: CartLine[], c: Customer, orderNo?: string) {
  const out: string[] = [];
  out.push(orderNo ? `Order — Two Tone Café #${orderNo}` : "Order — Two Tone Café");
  out.push(`Name: ${c.name.trim()}`);
  out.push(`Phone: ${c.phone.trim()}`);
  out.push(`Method: ${c.method}`);
  if (c.method === "Delivery") out.push(`Address: ${c.address.trim()}`);
  out.push("");
  out.push("Items:");

  for (const line of lines) {
    const item = getItem(line.itemId);
    if (!item) continue;
    let extrasText = "";
    if (line.extras.length) {
      extrasText = ` (Extras: ${line.extras.map((id) => getExtra(id)?.name ?? id).join(", ")})`;
    }
    if (line.sauces.length) {
      extrasText += ` [Sauces: ${line.sauces.join(", ")}]`;
    }
    out.push(`- ${line.qty} x ${item.name}${extrasText} => ${CURRENCY}${lineTotal(line).toFixed(2)}`);
  }

  const t = totalsOf(lines, c);
  out.push("");
  out.push(`Subtotal: ${CURRENCY}${t.subtotal.toFixed(2)}`);
  if (t.discount > 0) out.push(`Discount: -${CURRENCY}${t.discount.toFixed(2)}`);
  if (t.deliveryFee > 0) out.push(`Delivery fee: ${CURRENCY}${t.deliveryFee.toFixed(2)}`);
  if (t.tip > 0) out.push(`Tip: ${CURRENCY}${t.tip.toFixed(2)}`);
  out.push(`TOTAL: ${CURRENCY}${t.total.toFixed(2)}`);
  out.push("");
  out.push("--- Please confirm payment & estimated time. Thank you!");
  return out.join("\n");
}

export const whatsappUrl = (number: string, text: string) =>
  `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
