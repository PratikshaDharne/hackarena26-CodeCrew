import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Lightbulb, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import AppLayout from "@/components/AppLayout";
import { useReceipts, CATEGORY_COLORS } from "@/hooks/useReceipts";

const Insights = () => {
  const { data: receipts, isLoading } = useReceipts();

  const categoryTotals = receipts
    ? Object.entries(
        receipts.reduce<Record<string, number>>((acc, r) => {
          const cat = r.category || "Other";
          acc[cat] = (acc[cat] || 0) + (r.total_amount || 0);
          return acc;
        }, {})
      ).map(([name, value]) => ({ name, value }))
    : [];

  const totalSpent = receipts?.reduce((s, r) => s + (r.total_amount || 0), 0) || 0;
  const topCategory = categoryTotals.sort((a, b) => b.value - a.value)[0];

  const insights = receipts && receipts.length > 0
    ? [
        topCategory && {
          icon: TrendingUp,
          text: `Your biggest spending category is ${topCategory.name} at ₹${topCategory.value.toFixed(2)}.`,
          type: "warning" as const,
        },
        {
          icon: TrendingDown,
          text: `You've tracked ${receipts.length} receipt${receipts.length > 1 ? "s" : ""} totaling ₹${totalSpent.toFixed(2)}.`,
          type: "success" as const,
        },
        {
          icon: Lightbulb,
          text: "Keep scanning receipts regularly for better spending insights!",
          type: "tip" as const,
        },
      ].filter(Boolean)
    : [];

  const typeStyles = {
    warning: "border-chart-4/30 bg-chart-4/5",
    success: "border-primary/30 bg-primary/5",
    tip: "border-chart-2/30 bg-chart-2/5",
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-6 py-8 pb-24 md:pb-8">
        <h1 className="font-display text-2xl font-bold mb-2">Budget Insights</h1>
        <p className="text-sm text-muted-foreground mb-8">AI-powered analysis of your spending patterns</p>

        {insights.length > 0 ? (
          <>
            <div className="space-y-3 mb-8">
              {insights.map((ins, i) => ins && (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`glass-card p-5 border ${typeStyles[ins.type]} flex items-start gap-4`}
                >
                  <ins.icon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm">{ins.text}</p>
                </motion.div>
              ))}
            </div>

            {categoryTotals.length > 0 && (
              <div className="glass-card p-6">
                <h3 className="font-display font-semibold mb-6">Category Breakdown</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={categoryTotals} layout="vertical">
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "hsl(215 14% 50%)", fontSize: 12 }} />
                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "hsl(215 14% 50%)", fontSize: 12 }} width={100} />
                    <Tooltip contentStyle={{ background: "hsl(220 18% 8%)", border: "1px solid hsl(220 14% 16%)", borderRadius: 8 }} />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                      {categoryTotals.map((entry) => (
                        <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || "#888"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
        ) : (
          <div className="glass-card p-12 text-center text-muted-foreground">
            Scan some receipts to see spending insights!
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Insights;
