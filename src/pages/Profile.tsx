import { User, Bell, Shield, CreditCard, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import { useReceipts, CATEGORY_COLORS } from "@/hooks/useReceipts";

const budgetDefaults: Record<string, number> = {
  Food: 300,
  Travel: 200,
  Shopping: 150,
  Bills: 100,
  Entertainment: 50,
  Medical: 100,
  Education: 100,
};

const Profile = () => {
  const { user, signOut } = useAuth();
  const { data: receipts } = useReceipts();
  const navigate = useNavigate();

  // Calculate spent per category
  const categorySpent = (receipts || []).reduce<Record<string, number>>((acc, r) => {
    const cat = r.category || "Other";
    acc[cat] = (acc[cat] || 0) + (r.total_amount || 0);
    return acc;
  }, {});

  const budgetLimits = Object.entries(budgetDefaults).map(([category, limit]) => ({
    category,
    limit,
    spent: categorySpent[category] || 0,
  }));

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-6 py-8 pb-24 md:pb-8">
        <h1 className="font-display text-2xl font-bold mb-8">Profile & Settings</h1>

        <div className="glass-card p-6 mb-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-semibold">{user?.user_metadata?.full_name || "User"}</h3>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <div className="glass-card p-6 mb-6">
          <h3 className="font-display font-semibold mb-4">Budget Limits</h3>
          <div className="space-y-4">
            {budgetLimits.map((b) => {
              const pct = Math.min((b.spent / b.limit) * 100, 100);
              return (
                <div key={b.category}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span>{b.category}</span>
                    <span className="text-muted-foreground">${b.spent.toFixed(0)} / ${b.limit}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: pct > 80 ? "hsl(0, 72%, 51%)" : CATEGORY_COLORS[b.category] || "hsl(160, 84%, 39%)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-card divide-y divide-border/30">
          {[
            { icon: Bell, label: "Notifications", desc: "Budget alerts & reminders" },
            { icon: Shield, label: "Privacy", desc: "Data & security settings" },
            { icon: CreditCard, label: "Payment Methods", desc: "Linked accounts" },
          ].map((item) => (
            <button key={item.label} className="w-full flex items-center gap-4 p-5 hover:bg-muted/50 transition-colors text-left">
              <item.icon className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </button>
          ))}
          <button onClick={handleLogout} className="w-full flex items-center gap-4 p-5 hover:bg-destructive/10 transition-colors text-left text-destructive">
            <LogOut className="w-5 h-5" />
            <p className="font-medium text-sm">Log out</p>
          </button>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
