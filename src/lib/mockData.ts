export type Category = "Food" | "Travel" | "Shopping" | "Medical" | "Education" | "Bills" | "Entertainment";

export interface ReceiptItem {
  id: string;
  name: string;
  price: number;
  category: Category;
}

export interface Receipt {
  id: string;
  storeName: string;
  date: string;
  items: ReceiptItem[];
  tax: number;
  total: number;
  category: Category;
  imageUrl?: string;
}

export const CATEGORY_COLORS: Record<Category, string> = {
  Food: "hsl(160, 84%, 39%)",
  Travel: "hsl(200, 80%, 50%)",
  Shopping: "hsl(280, 70%, 55%)",
  Medical: "hsl(340, 75%, 55%)",
  Education: "hsl(35, 90%, 55%)",
  Bills: "hsl(210, 60%, 50%)",
  Entertainment: "hsl(300, 60%, 55%)",
};

export const CATEGORY_ICONS: Record<Category, string> = {
  Food: "🍕",
  Travel: "✈️",
  Shopping: "🛍️",
  Medical: "💊",
  Education: "📚",
  Bills: "📄",
  Entertainment: "🎮",
};

export const mockReceipts: Receipt[] = [
  {
    id: "1",
    storeName: "Whole Foods Market",
    date: "2026-03-04",
    items: [
      { id: "1a", name: "Organic Bananas", price: 2.49, category: "Food" },
      { id: "1b", name: "Almond Milk", price: 4.99, category: "Food" },
      { id: "1c", name: "Avocado (3pk)", price: 5.99, category: "Food" },
    ],
    tax: 1.08,
    total: 14.55,
    category: "Food",
  },
  {
    id: "2",
    storeName: "Uber",
    date: "2026-03-03",
    items: [{ id: "2a", name: "Ride to Airport", price: 34.5, category: "Travel" }],
    tax: 2.76,
    total: 37.26,
    category: "Travel",
  },
  {
    id: "3",
    storeName: "Amazon",
    date: "2026-03-02",
    items: [
      { id: "3a", name: "USB-C Cable", price: 12.99, category: "Shopping" },
      { id: "3b", name: "Notebook Set", price: 8.49, category: "Education" },
    ],
    tax: 1.72,
    total: 23.2,
    category: "Shopping",
  },
  {
    id: "4",
    storeName: "CVS Pharmacy",
    date: "2026-03-01",
    items: [
      { id: "4a", name: "Ibuprofen", price: 9.99, category: "Medical" },
      { id: "4b", name: "Vitamins", price: 14.99, category: "Medical" },
    ],
    tax: 2.0,
    total: 26.98,
    category: "Medical",
  },
  {
    id: "5",
    storeName: "Netflix",
    date: "2026-02-28",
    items: [{ id: "5a", name: "Monthly Subscription", price: 15.49, category: "Entertainment" }],
    tax: 0,
    total: 15.49,
    category: "Entertainment",
  },
  {
    id: "6",
    storeName: "Electric Company",
    date: "2026-02-25",
    items: [{ id: "6a", name: "February Bill", price: 87.32, category: "Bills" }],
    tax: 0,
    total: 87.32,
    category: "Bills",
  },
  {
    id: "7",
    storeName: "Trader Joe's",
    date: "2026-02-22",
    items: [
      { id: "7a", name: "Pasta", price: 2.99, category: "Food" },
      { id: "7b", name: "Sauce", price: 3.49, category: "Food" },
      { id: "7c", name: "Bread", price: 3.99, category: "Food" },
    ],
    tax: 0.84,
    total: 11.31,
    category: "Food",
  },
];

export const monthlySpending = [
  { month: "Oct", amount: 420 },
  { month: "Nov", amount: 380 },
  { month: "Dec", amount: 510 },
  { month: "Jan", amount: 340 },
  { month: "Feb", amount: 290 },
  { month: "Mar", amount: 180 },
];

export function getCategoryTotals() {
  const totals: Record<string, number> = {};
  mockReceipts.forEach((r) => {
    totals[r.category] = (totals[r.category] || 0) + r.total;
  });
  return Object.entries(totals).map(([name, value]) => ({ name, value }));
}
