import { useEffect, useState } from "react";
import { Trophy, Flame, Zap, Star } from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

function useCountUp(target, delay = 400) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 40));
      const id = setInterval(() => {
        current = Math.min(current + step, target);
        setCount(current);
        if (current >= target) clearInterval(id);
      }, 30);
      return () => clearInterval(id);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, delay]);
  return count;
}

export default function CompletionScreen({ xpEarned = 10, bonusXp = 0, streak, onClose, prevXp = 0 }) {
  const totalEarned = xpEarned + bonusXp;
  const animatedXp = useCountUp(totalEarned, 500);
  const [saving, setSaving] = useState(false);

  function handleContinue() {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      onClose();
    }, 500);
  }

  useEffect(() => {
    const end = Date.now() + 2200;
    const colors = ["#2ECC71", "#F1C40F", "#2C3E50", "#E74C3C", "#3498DB"];
    const frame = () => {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  const xpForLevel = 100;
  const prevFill = Math.min(100, (prevXp % xpForLevel) / xpForLevel * 100);
  const newFill = Math.min(100, ((prevXp + totalEarned) % xpForLevel) / xpForLevel * 100);

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="flex flex-col items-center w-full max-w-xs"
      >
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-5">
          <Trophy className="w-14 h-14 text-primary" />
        </div>

        <h1 className="text-3xl font-extrabold text-foreground mb-1 text-center">
          {bonusXp > 0 ? "Section Mastered! 🎉" : "Lesson Complete! 🎉"}
        </h1>
        <p className="text-muted-foreground text-base mb-5 text-center">Outstanding work!</p>

        {/* Animated XP counter */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 mb-3"
        >
          <Zap className="w-8 h-8 text-accent" />
          <span className="text-6xl font-extrabold text-foreground">+{animatedXp}</span>
          <span className="text-2xl font-bold text-muted-foreground self-end mb-1">XP</span>
        </motion.div>

        {/* Section bonus badge */}
        {bonusXp > 0 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-2 bg-accent/10 border-2 border-accent/30 rounded-xl px-4 py-2 mb-4"
          >
            <Star className="w-5 h-5 text-accent fill-accent" />
            <span className="font-extrabold text-accent">+{bonusXp} Section Bonus!</span>
          </motion.div>
        )}

        {streak > 0 && (
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-2 mb-4"
          >
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="font-bold text-orange-500">{streak} Day Streak 🔥</span>
          </motion.div>
        )}

        {/* XP bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full mb-7"
        >
          <div className="flex justify-between text-xs font-semibold text-muted-foreground mb-1.5">
            <span>XP Progress</span>
            <span>{prevXp + totalEarned} XP</span>
          </div>
          <div className="w-full h-5 bg-muted rounded-full overflow-hidden border border-border/40">
            <motion.div
              initial={{ width: `${prevFill}%` }}
              animate={{ width: `${newFill}%` }}
              transition={{ delay: 0.8, duration: 1.2, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, #2ECC71, #F1C40F)",
                boxShadow: "0 0 12px rgba(241,196,15,0.6)",
              }}
            />
          </div>
        </motion.div>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleContinue}
          onKeyDown={e => e.key === "Enter" && handleContinue()}
          aria-label="Lesson Complete! Press Enter to continue and save your progress."
          disabled={saving}
          className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center gap-2"
          style={{ boxShadow: "0 5px 0 hsl(145 63% 38%)" }}
        >
          {saving ? (
            <>
              <span className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
              Saving…
            </>
          ) : "Continue"}
        </motion.button>
      </motion.div>
    </div>
  );
}