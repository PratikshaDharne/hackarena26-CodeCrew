import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useReceipts, CATEGORY_ICONS } from "@/hooks/useReceipts";

const CATEGORIES = ["Food", "Travel", "Shopping", "Medical", "Education", "Bills", "Entertainment"];

const Receipts = () => {
  const { data: receipts, isLoading } = useReceipts();
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<string>("All");

  const filtered = (receipts || []).filter((r) => {
    const matchSearch =
      (r.store_name || "").toLowerCase().includes(search.toLowerCase()) ||
      r.receipt_items.some((i) => i.item_name.toLowerCase().includes(search.toLowerCase()));
    const matchCat = catFilter === "All" || r.category === catFilter;
    return matchSearch && matchCat;
  });

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-6 py-8 pb-24 md:pb-8">
        <h1 className="font-display text-2xl font-bold mb-6">Receipt History</h1>

        <div className="glass-card p-4 mb-6">
          <div className="flex gap-3 mb-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search receipts..."
                className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setCatFilter("All")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                catFilter === "All" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCatFilter(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  catFilter === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {CATEGORY_ICONS[c] || "📦"} {c}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>
        ) : (
          <div className="space-y-3">
            {filtered.map((r) => (
              <div key={r.id} className="glass-card p-5 hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{CATEGORY_ICONS[r.category || "Food"] || "📦"}</span>
                    <div>
                      <h3 className="font-medium">{r.store_name || "Unknown"}</h3>
                      <p className="text-xs text-muted-foreground">{r.purchase_date} · {r.category}</p>
                      <div className="mt-2 space-y-0.5">
                        {r.receipt_items.map((item) => (
                          <p key={item.id} className="text-xs text-muted-foreground">
                            {item.item_name} — <span className="text-foreground">${item.price.toFixed(2)}</span>
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-display font-bold text-lg">${(r.total_amount || 0).toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Tax: ${(r.tax || 0).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="glass-card p-12 text-center text-muted-foreground">
                {receipts?.length === 0 ? "No receipts yet. Scan your first!" : "No receipts match your filters."}
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Receipts;
