import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { updateProgress } from "../lib/progressUtils";

const DAY_REWARDS = [
  { emoji: "⚡", label: "+15 XP", type: "xp", amount: 15 },
  { emoji: "💎", label: "+3 Gems", type: "gems", amount: 3 },
  { emoji: "⚡", label: "+25 XP", type: "xp", amount: 25 },
  { emoji: "💎", label: "+5 Gems", type: "gems", amount: 5 },
  { emoji: "⚡", label: "+15 XP", type: "xp", amount: 15 },
  { emoji: "🚀", label: "+50 XP", type: "xp", amount: 50 },
  { emoji: "👑", label: "MEGA: +100 XP & +10 Gems!", type: "mega", amount: 100 },
];

function getMs(lastClaimed) {
  if (!lastClaimed) return 0;
  return Math.max(0, 24 * 3600 * 1000 - (Date.now() - new Date(lastClaimed).getTime()));
}

function fmt(ms) {
  if (ms <= 0) return "00:00:00";
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return [h, m, s].map(v => String(v).padStart(2, "0")).join(":");
}

export default function DailyReward({ progress, setProgress, onClose }) {
  const [timeLeft, setTimeLeft] = useState(() => getMs(progress.last_reward_claimed));
  const [reward, setReward] = useState(null);
  const [claiming, setClaiming] = useState(false);

  const missed48 = progress.last_reward_claimed &&
    Date.now() - new Date(progress.last_reward_claimed).getTime() > 48 * 3600 * 1000;
  const effectiveDay = missed48 ? 1 : (progress.daily_reward_day || 1);
  const canClaim = timeLeft <= 0;

  useEffect(() => {
    if (timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft(getMs(progress.last_reward_claimed)), 1000);
    return () => clearInterval(id);
  }, [progress.last_reward_claimed]);

  async function handleClaim() {
    if (!canClaim || claiming) return;
    setClaiming(true);
    const r = DAY_REWARDS[effectiveDay - 1];
    const nextDay = effectiveDay >= 7 ? 1 : effectiveDay + 1;
    const now = new Date().toISOString();
    const update = {
      last_reward_claimed: now,
      daily_reward_day: nextDay,
      xp: r.type === "mega" ? (progress.xp || 0) + r.amount : (progress.xp || 0),
      gems: r.type === "gems" ? (progress.gems || 0) + r.amount
        : r.type === "mega" ? (progress.gems || 0) + 10
        : (progress.gems || 0),
    };
    if (r.type === "xp") update.xp = (progress.xp || 0) + r.amount;
    const merged = await updateProgress(progress, update);
    setProgress(merged);
    setReward(r);
    setTimeLeft(24 * 3600 * 1000);
    setClaiming(false);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center" onClick={onClose}>
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full max-w-lg bg-card rounded-t-3xl p-6 pb-10 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-extrabold text-foreground">Daily Reward 🎁</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 7-day grid */}
        <div className="flex justify-between gap-1 mb-6">
          {DAY_REWARDS.map((dr, i) => {
            const dayNum = i + 1;
            const claimed = dayNum < effectiveDay;
            const active = dayNum === effectiveDay;
            return (
              <div key={dayNum} className={`flex-1 flex flex-col items-center gap-0.5 p-1.5 rounded-xl border-2 transition-all ${
                claimed ? "border-primary/30 bg-primary/5 opacity-60"
                : active ? "border-primary bg-primary/10 shadow-md"
                : "border-border bg-card opacity-35"
              }`}>
                <span className="text-lg">{claimed ? "✅" : dr.emoji}</span>
                <span className={`text-[8px] font-bold leading-tight ${active ? "text-primary" : "text-muted-foreground"}`}>
                  Day {dayNum}
                </span>
                {dayNum === 7 && <span className="text-[7px] font-extrabold text-accent">MEGA</span>}
              </div>
            );
          })}
        </div>

        {/* Reward reveal */}
        <AnimatePresence>
          {reward && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center mb-5 p-4 rounded-2xl bg-accent/10 border-2 border-accent/30"
            >
              <motion.span
                animate={{ scale: [1, 1.5, 1], rotate: [0, -15, 15, 0] }}
                transition={{ duration: 0.6 }}
                className="text-5xl mb-2"
              >
                {reward.emoji}
              </motion.span>
              <p className="text-xl font-extrabold text-accent">{reward.label}</p>
              <p className="text-sm text-muted-foreground">Added to your account!</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        {reward ? (
          <button
            onClick={onClose}
            className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-extrabold text-lg"
            style={{ boxShadow: "0 5px 0 hsl(145 63% 38%)" }}
          >
            Awesome! 🚀
          </button>
        ) : canClaim ? (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleClaim}
            disabled={claiming}
            className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-extrabold text-lg"
            style={{ boxShadow: "0 5px 0 hsl(145 63% 38%)" }}
          >
            🎁 Claim Reward!
          </motion.button>
        ) : (
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Next reward in</p>
            <p className="text-3xl font-extrabold font-mono text-foreground">{fmt(timeLeft)}</p>
            <p className="text-xs text-muted-foreground mt-1">Come back tomorrow!</p>
          </div>
        )}

        {/* Ready glow when canClaim */}
        {canClaim && !reward && (
          <motion.p
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-center text-sm font-bold text-primary mt-3"
          >
            ✨ READY TO CLAIM!
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}