import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ScanLine, TrendingUp, TrendingDown, DollarSign, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

import AppLayout from "@/components/AppLayout";
import SpendingTimeline from "@/components/SpendingTimeline";
import ChatbotWidget from "@/components/chatbot/ChatbotWidget";
// import BurnRateCard from "@/components/BurnRateCard";

import { useReceipts, CATEGORY_COLORS, CATEGORY_ICONS } from "@/hooks/useReceipts";
import BurnRateCard from "@/components/BurnRateCard";

const Dashboard = () => {

  const { data: receipts, isLoading } = useReceipts();

  const totalSpent = receipts?.reduce((s, r) => s + (r.total_amount || 0), 0) || 0;
  const receiptCount = receipts?.length || 0;

  // Category totals for pie chart
  const categoryTotals = receipts
    ? Object.entries(
        receipts.reduce((acc: any, r: any) => {
          const cat = r.category || "Other";
          acc[cat] = (acc[cat] || 0) + (r.total_amount || 0);
          return acc;
        }, {})
      ).map(([name, value]) => ({ name, value }))
    : [];

  // Monthly data for bar chart
  const monthlyData = receipts
    ? Object.entries(
        receipts.reduce((acc: any, r: any) => {
          const month = r.purchase_date
            ? new Date(r.purchase_date).toLocaleString("en", { month: "short" })
            : "Unknown";

          acc[month] = (acc[month] || 0) + (r.total_amount || 0);
          return acc;
        }, {})
      ).map(([month, amount]) => ({ month, amount }))
    : [];

  const stats = [
    { label: "Total Spent", value: `₹${totalSpent.toLocaleString("en-IN")}`, icon: DollarSign },
    { label: "Receipts", value: receiptCount.toString(), icon: TrendingUp },
    { label: "Categories", value: categoryTotals.length.toString(), icon: TrendingDown },
  ];

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>

      <div className="max-w-6xl mx-auto px-6 py-8 pb-24 md:pb-8">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Your spending overview
            </p>
          </div>

          <Link
            to="/scan"
            className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all scan-pulse"
          >
            <ScanLine className="w-4 h-4" />
            Scan Receipt
          </Link>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">

          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-5"
            >

              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">
                  {s.label}
                </span>

                <s.icon className="w-4 h-4 text-primary" />
              </div>

              <p className="font-display text-2xl font-bold">
                {s.value}
              </p>

            </motion.div>
          ))}

        </div>

        {receipts && receipts.length > 0 ? (

          <>
            {/* Charts */}
            <div className="grid lg:grid-cols-5 gap-6 mb-8">

              {monthlyData.length > 0 && (
                <div className="glass-card p-6 lg:col-span-3">

                  <h3 className="font-display font-semibold mb-4">
                    Spending by Month
                  </h3>

                  <ResponsiveContainer width="100%" height={220}>

                    <BarChart data={monthlyData}>

                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "hsl(215 14% 50%)", fontSize: 12 }}
                      />

                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "hsl(215 14% 50%)", fontSize: 12 }}
                      />

                      <Tooltip
                        contentStyle={{
                          background: "hsl(220 18% 8%)",
                          border: "1px solid hsl(220 14% 16%)",
                          borderRadius: 8
                        }}
                      />

                      <Bar
                        dataKey="amount"
                        fill="hsl(160, 84%, 39%)"
                        radius={[6, 6, 0, 0]}
                      />

                    </BarChart>

                  </ResponsiveContainer>

                </div>
              )}

              {categoryTotals.length > 0 && (

                <div className="glass-card p-6 lg:col-span-2">

                  <h3 className="font-display font-semibold mb-4">
                    By Category
                  </h3>

                  <ResponsiveContainer width="100%" height={180}>

                    <PieChart>

                      <Pie
                        data={categoryTotals}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        strokeWidth={0}
                      >

                        {categoryTotals.map((entry) => (
                          <Cell
                            key={entry.name}
                            fill={CATEGORY_COLORS[entry.name] || "hsl(215,14%,50%)"}
                          />
                        ))}

                      </Pie>

                      <Tooltip
                        contentStyle={{
                          background: "hsl(220 18% 8%)",
                          border: "1px solid hsl(220 14% 16%)",
                          borderRadius: 8
                        }}
                      />

                    </PieChart>

                  </ResponsiveContainer>

                  <div className="flex flex-wrap gap-2 mt-2">

                    {categoryTotals.map((c) => (
                      <span
                        key={c.name}
                        className="text-xs text-muted-foreground flex items-center gap-1"
                      >

                        <span
                          className="w-2 h-2 rounded-full"
                          style={{
                            background: CATEGORY_COLORS[c.name] || "#888"
                          }}
                        />

                        {c.name}

                      </span>
                    ))}

                  </div>

                </div>
              )}

            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <SpendingTimeline receipts={receipts || []} />
              <BurnRateCard receipts={receipts || []} />
            </div>

            {/* Recent Expenses */}
            <div className="glass-card p-6">

              <div className="flex items-center justify-between mb-4">

                <h3 className="font-display font-semibold">
                  Recent Expenses
                </h3>

                <Link
                  to="/receipts"
                  className="text-sm text-primary hover:underline"
                >
                  View all
                </Link>

              </div>

              <div className="space-y-3">

                {receipts.slice(0, 5).map((r: any) => (

                  <div
                    key={r.id}
                    className="flex items-center justify-between py-3 border-b border-border/30 last:border-0"
                  >

                    <div className="flex items-center gap-3">

                      <span className="text-xl">
                        {CATEGORY_ICONS[r.category || "Food"] || "📦"}
                      </span>

                      <div>
                        <p className="font-medium text-sm">
                          {r.store_name || "Unknown Store"}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {r.purchase_date} · {r.category}
                        </p>
                      </div>

                    </div>

                    <span className="font-display font-semibold">
                      ₹{(r.total_amount || 0).toFixed(2)}
                    </span>

                  </div>

                ))}

              </div>

            </div>

          </>

        ) : (

          <div className="glass-card p-12 text-center">

            <p className="text-muted-foreground mb-4">
              No receipts yet. Scan your first receipt!
            </p>

            <Link
              to="/scan"
              className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground font-semibold rounded-xl"
            >
              <ScanLine className="w-4 h-4" />
              Scan Receipt
            </Link>

          </div>

        )}

      </div>
      <ChatbotWidget />

    </AppLayout>
  );
};

export default Dashboard;