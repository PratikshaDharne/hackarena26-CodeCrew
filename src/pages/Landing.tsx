import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ScanLine, Zap, PieChart, Shield, ArrowRight } from "lucide-react";
import heroMockup from "@/assets/hero-mockup.png";

const features = [
  {
    icon: ScanLine,
    title: "Instant OCR Scan",
    desc: "Snap a receipt and extract store, items, tax, and total in seconds.",
  },
  {
    icon: Zap,
    title: "AI Categorization",
    desc: "Expenses auto-categorized into Food, Travel, Shopping, and more.",
  },
  {
    icon: PieChart,
    title: "Smart Dashboard",
    desc: "Visual breakdowns of your spending with charts and insights.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    desc: "Your financial data stays encrypted and private, always.",
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <span className="font-display text-2xl font-bold gradient-text">SnapBudget</span>
        <div className="flex gap-3">
          <Link
            to="/auth"
            className="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Log in
          </Link>
          <Link
            to="/auth"
            className="px-5 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Sign up free
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-24 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight mb-6">
            Scan receipts.
            <br />
            <span className="gradient-text">Track spending.</span>
            <br />
            No typing.
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-md">
            SnapBudget uses OCR and AI to instantly extract and categorize your
            expenses from any receipt photo.
          </p>
          <div className="flex gap-4">
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all scan-pulse"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-7 py-3.5 border border-border text-foreground font-medium rounded-xl hover:bg-muted transition-colors"
            >
              Learn more
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-3xl" />
          <img
            src={heroMockup}
            alt="SnapBudget app interface showing receipt scanning"
            className="relative w-full max-w-lg mx-auto rounded-2xl"
          />
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 pb-24">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-display text-3xl font-bold text-center mb-12"
        >
          Everything you need to{" "}
          <span className="gradient-text">track smarter</span>
        </motion.h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 text-center text-sm text-muted-foreground">
        © 2026 SnapBudget OCR. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;
