import { motion } from "framer-motion";

interface Receipt {
  total_amount: number;
  purchase_date: string;
}

interface Props {
  receipts: Receipt[];
}

const BurnRateCard = ({ receipts }: Props) => {

  const budget = 50000;

  const spent = receipts.reduce(
    (sum, r) => sum + (r.total_amount || 0),
    0
  );

  const today = new Date();
  const daysPassed = today.getDate();
  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();

  const avgDaily = spent / daysPassed;

  const projected = Math.round(avgDaily * daysInMonth);

  const percentUsed = Math.round((spent / budget) * 100);
  const projectedPercent = Math.round((projected / budget) * 100);

  return (
    <div className="glass-card p-6">

      <h3 className="text-lg font-semibold text-foreground mb-1">
        Burn Rate
      </h3>

      <p className="text-sm text-muted-foreground mb-6">
        Monthly budget tracking
      </p>

      <div className="space-y-4">

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Monthly Budget
          </span>
          <span className="text-foreground font-medium">
            ₹{budget.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Spent So Far
          </span>
          <span className="text-primary font-medium">
            ₹{spent.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Projected EOM
          </span>
          <span className="text-secondary font-medium">
            ₹{projected.toLocaleString()}
          </span>
        </div>

        {/* Progress bar */}
        <div className="space-y-2 pt-2">

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{percentUsed}% used</span>
            <span>{projectedPercent}% projected</span>
          </div>

          <div className="h-3 bg-muted rounded-full overflow-hidden relative">

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentUsed}%` }}
              transition={{ duration: 1 }}
              className="h-full gradient-bg rounded-full"
            />

            <div
              className="absolute top-0 h-full border-r-2 border-secondary"
              style={{ left: `${projectedPercent}%` }}
            />

          </div>

        </div>

        <p className="text-xs text-muted-foreground">

          {projected <= budget
            ? "✅ On track to stay within budget"
            : "⚠️ Projected to exceed budget by ₹" +
              (projected - budget).toLocaleString()}

        </p>

      </div>

    </div>
  );
};

export default BurnRateCard;