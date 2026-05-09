import { motion } from "framer-motion";
import { useEffect } from "react";
import { Gem } from "lucide-react";
import { playLevelUp } from "../lib/sounds";

export default function XpChestOverlay({ onClose }) {
  useEffect(() => {
    playLevelUp?.();
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="bg-card rounded-3xl p-8 text-center shadow-2xl border-2 border-amber-400/40 max-w-xs w-full mx-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Shaking chest */}
        <motion.div
          animate={{ rotate: [-8, 8, -6, 6, -3, 3, 0], scale: [1, 1.12, 1] }}
          transition={{ duration: 0.7, repeat: 3, repeatDelay: 0.5 }}
          className="text-7xl mb-4 inline-block"
        >
          🎁
        </motion.div>

        <h2 className="text-2xl font-extrabold text-foreground mb-1">100 XP Chest!</h2>
        <p className="text-sm text-muted-foreground mb-5">You crossed 100 XP — here's your reward!</p>

        {/* Gem burst */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[0,1,2].map(i => (
            <motion.div key={i}
              initial={{ y: 0, opacity: 0, scale: 0 }}
              animate={{ y: [-20, -50, -30], opacity: [0, 1, 0], scale: [0, 1.4, 0] }}
              transition={{ delay: 0.3 + i * 0.15, duration: 1 }}
            >
              <Gem className="w-7 h-7 text-blue-400" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
          className="text-4xl font-extrabold text-amber-400 mb-6"
        >
          +50 💎
        </motion.div>

        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-extrabold text-base"
          style={{ boxShadow: "0 4px 0 hsl(145 63% 38%)" }}
        >
          Awesome! 🚀
        </button>
      </motion.div>
    </motion.div>
  );
}