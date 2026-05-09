import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const FEED_ITEMS = [
  "User_42 just mastered Inflation! 🏆",
  "CryptoKid earned 500 XP! 🎉",
  "WealthWizard completed Unit 2! 🚀",
  "MoneyMaven unlocked 'Supply & Demand'! 📈",
  "FinanceGuru is on a 7-day streak! 🔥",
  "EconEagle just answered 10 in a row! ⚡",
  "BudgetBoss mastered Compound Interest! 💰",
  "InvestIvy earned the Gold Star badge! ⭐",
  "MarketMike just hit Level 5! 🎯",
  "SavingsSam completed their first lesson! 💎",
];

export default function LiveFeed() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((i) => (i + 1) % FEED_ITEMS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mx-4 mb-4 bg-secondary/10 backdrop-blur-sm border border-secondary/20 rounded-xl px-4 py-2.5 overflow-hidden">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest flex-shrink-0">
          🔴 Live
        </span>
        <div className="flex-1 overflow-hidden h-5">
          <AnimatePresence mode="wait">
            <motion.p
              key={current}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="text-xs font-semibold text-foreground whitespace-nowrap"
            >
              {FEED_ITEMS[current]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}