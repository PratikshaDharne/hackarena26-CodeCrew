import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const SpendingTimeline = ({ receipts }) => {

  const data = receipts.reduce((acc, r) => {
    if (!r.purchase_date) return acc;

    const day = new Date(r.purchase_date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short"
    });

    const existing = acc.find((d) => d.day === day);

    if (existing) {
      existing.amount += r.total_amount || 0;
    } else {
      acc.push({ day, amount: r.total_amount || 0 });
    }

    return acc;
  }, []);

  return (
    <div className="glass-card p-6">
      <h3 className="font-heading text-sm font-semibold text-foreground mb-4">
        Spending Timeline
      </h3>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />

          <XAxis
            dataKey="day"
            tick={{ fontSize: 11, fill: "hsl(215, 12%, 52%)" }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fontSize: 11, fill: "hsl(215, 12%, 52%)" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₹${v / 1000}k`}
          />

          <Tooltip
            formatter={(value) => [`₹${value.toLocaleString()}`, "Spent"]}
          />

          <Area
            type="monotone"
            dataKey="amount"
            stroke="hsl(174, 72%, 56%)"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpendingTimeline;