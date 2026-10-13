/**
 * Two Tone Café menu — carried over 1:1 from the original site
 * (github.com/DrMcGi/TwoToneCafe). Names, descriptions, prices, extras,
 * sauces and images are intentionally unchanged.
 */

export const CURRENCY = "R";
export const DELIVERY_FEE_BASE = 8;

export type CategoryId = "kota" | "chips" | "platters" | "other";

export type Category = {
  id: CategoryId;
  anchor: string;
  title: string;
  label: string;
  blurb: string;
  emoji: string;
};

export const categories: Category[] = [
  { id: "kota", anchor: "kotas", title: "Kotas", label: "Kotas", blurb: "Loaded quarter-loaves, built your way.", emoji: "🥪" },
  { id: "chips", anchor: "chips", title: "Chips", label: "Chips", blurb: "Crispy, golden, seasoned to order.", emoji: "🍟" },
  { id: "platters", anchor: "platters", title: "Platters", label: "Platters", blurb: "For celebrations, events & special occasions.", emoji: "🎉" },
  { id: "other", anchor: "other", title: "We also have:", label: "Other", blurb: "Fire-up essentials for the braai.", emoji: "🔥" },
];

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  desc: string;
  category: CategoryId;
  img: string;
};

export const menuItems: MenuItem[] = [
  /* Kotas */
  { id: "galxboy", name: "GalXBoy", price: 25, desc: "Polony, Chakalaka, Chips, Viana", category: "kota", img: "/images/GalXBoy.jpg" },
  { id: "true-relegion", name: "True Relegion", price: 30, desc: "Russian, Cheese, Polony, Chakalaka, Lettuce", category: "kota", img: "" },
  { id: "dagwood", name: "Dagwood", price: 45, desc: "Beef patty, Lettuce, Polony, Cheese, Russian, Chakalaka, Viana", category: "kota", img: "/images/Dagwood.jpg" },
  { id: "king-kota", name: "King Kota", price: 100, desc: "2x beef patties, 2x Russian, 2x Viana, 2x Polony, 2x Cheese, Lettuce & extra chips", category: "kota", img: "" },

  /* Chips */
  { id: "chips-small", name: "Small Chips", price: 25, desc: "Crispy and golden", category: "chips", img: "/images/chips.jpg" },
  { id: "chips-medium", name: "Medium Chips", price: 30, desc: "Perfect mid size", category: "chips", img: "/images/chips.jpg" },
  { id: "chips-large", name: "Large Chips", price: 50, desc: "Big serving to share", category: "chips", img: "/images/chips.jpg" },

  /* Platters (no extras / sauces) */
  { id: "food-platter", name: "Food Platter", price: 450, desc: "Sticky wings, fish nuggets, chicken nuggets, samoosas, sausage rolls, 2 sauces & dips", category: "platters", img: "/images/platter1.jpg" },
  { id: "fruit-platter", name: "Fruit Platter", price: 350, desc: "5 fruits 🍉🍇🍍🍓🥝, biltong, cheese, ham, peanuts & raisins", category: "platters", img: "/images/platter2.jpg" },
  { id: "combo-special", name: "Combo Special", price: 1400, desc: "#2 Food Platters + #2 Fruit Platters", category: "platters", img: "/images/platter3.jpg" },

  /* Other */
  { id: "charcoal-5kg", name: "Charcoal 5kg", price: 70, desc: "High heat cooking charcoal", category: "other", img: "/images/Charcoal.jpg" },
  { id: "briq-4kg", name: "CharKing Briquettes 4kg", price: 80, desc: "Long-burning briquettes", category: "other", img: "" },
  { id: "wood-4kg", name: "Wood 4kg", price: 40, desc: "Seasoned firewood", category: "other", img: "/images/wood.jpg" },
];

export type Extra = { id: string; name: string; price: number };

/** Paid extras — available on kotas only, charged per item. */
export const extrasList: Extra[] = [
  { id: "extra-cheese", name: "Extra Cheese", price: 5 },
  { id: "extra-vienna", name: "Extra Vienna", price: 6 },
  { id: "extra-russian", name: "Extra Russian", price: 8 },
  { id: "extra-patty", name: "Extra Beef Patty", price: 15 },
  { id: "extra-polony", name: "Extra Polony", price: 5 },
];

/** Free sauces & seasoning — available on kotas and chips. */
export const saucesList = [
  "Tomato Sauce",
  "BBQ Sauce",
  "Hot Sauce",
  "Salt",
  "Spice",
  "Vinegar",
  "Green Chillies with Secret Sauce",
] as const;

export const platterGallery = Array.from({ length: 10 }, (_, i) => ({
  src: `/images/platter${i + 1}.jpg`,
  alt: `Two Tone Café platter ${i + 1}`,
}));

export const PLATTERS_NOTE =
  "🌍 DELIVERY CAN BE ARRANGED. PLEASE PLACE AN ORDER AND COLLECT YOUR PLATTERS IN 3 DAYS OR CHOSEN DATE. WE CATER FOR SPECIAL OCCASIONS AND EVENTS AS WELL.";

export const PREMIUM_NOTE = "✨ Premium service — delivery available. Collection qualifies for future discounts.";

export const CONFIRM_NOTE = "We will message you to confirm time & payment — cash on delivery accepted.";

export const allowsExtras = (item: MenuItem) => item.category === "kota";
export const allowsSauces = (item: MenuItem) => item.category === "kota" || item.category === "chips";

export const getItem = (id: string) => menuItems.find((i) => i.id === id);
export const getExtra = (id: string) => extrasList.find((e) => e.id === id);
