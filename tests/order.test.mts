import { test } from "node:test";
import assert from "node:assert/strict";
import { extrasList, menuItems, saucesList } from "../src/lib/menu.ts";
import { buildWhatsAppMessage, totalsOf, type CartLine, type Customer } from "../src/lib/order.ts";

test("menu is carried over intact from the original site", () => {
  const prices = Object.fromEntries(menuItems.map((i) => [i.id, i.price]));
  assert.deepEqual(prices, {
    galxboy: 25, "true-relegion": 30, dagwood: 45, "king-kota": 100,
    "chips-small": 25, "chips-medium": 30, "chips-large": 50,
    "food-platter": 450, "fruit-platter": 350, "combo-special": 1400,
    "charcoal-5kg": 70, "briq-4kg": 80, "wood-4kg": 40,
  });
  assert.deepEqual(
    extrasList.map((e) => [e.name, e.price]),
    [["Extra Cheese", 5], ["Extra Vienna", 6], ["Extra Russian", 8], ["Extra Beef Patty", 15], ["Extra Polony", 5]],
  );
  assert.equal(saucesList.length, 7);
});

const lines: CartLine[] = [
  { key: "a", itemId: "dagwood", qty: 2, extras: ["extra-cheese", "extra-patty"], sauces: ["BBQ Sauce"] },
  { key: "b", itemId: "chips-large", qty: 1, extras: [], sauces: ["Salt", "Vinegar"] },
  { key: "c", itemId: "wood-4kg", qty: 1, extras: [], sauces: [] },
];

test("totals: extras per item, R8 delivery, tip", () => {
  // dagwood (45+5+15)*2 = 130, chips 50, wood 40 => 220
  assert.deepEqual(totalsOf(lines, { method: "Delivery", tip: 10 }), { subtotal: 220, discount: 0, deliveryFee: 8, tip: 10, total: 238 });
  assert.equal(totalsOf(lines, { method: "Collection", tip: 0 }).total, 220);
  assert.equal(totalsOf([], { method: "Delivery", tip: 0 }).deliveryFee, 0);
});

test("WhatsApp message matches the original format", () => {
  const customer: Customer = { name: "Thabo", phone: "0811234567", method: "Delivery", address: "12 Main Rd", tip: 10 };
  assert.equal(
    buildWhatsAppMessage(lines, customer, "TT-48213"),
    [
      "Order — Two Tone Café #TT-48213",
      "Name: Thabo",
      "Phone: 0811234567",
      "Method: Delivery",
      "Address: 12 Main Rd",
      "",
      "Items:",
      "- 2 x Dagwood (Extras: Extra Cheese, Extra Beef Patty) [Sauces: BBQ Sauce] => R130.00",
      "- 1 x Large Chips [Sauces: Salt, Vinegar] => R50.00",
      "- 1 x Wood 4kg => R40.00",
      "",
      "Subtotal: R220.00",
      "Delivery fee: R8.00",
      "Tip: R10.00",
      "TOTAL: R238.00",
      "",
      "--- Please confirm payment & estimated time. Thank you!",
    ].join("\n"),
  );
});
