import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function BatteryDeadPopup({ powerCells, fullRecharges, onUsePowerCell, onUseFullRecharge, onRestart }) {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (countdown <= 0) {
      onRestart();
      return;
    }
    const id = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(id);
  }, [countdown]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-60 bg-black/70 flex items-center justify-center p-6"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
        className="bg-card rounded-2xl p-6 w-full max-w-xs text-center shadow-2xl"
        style={{ border: "1.5px solid rgba(239,68,68,0.4)" }}
      >
        {/* Drained battery animation */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [1, 0.6, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="text-5xl mb-3"
        >
          🪫
        </motion.div>

        <h2 className="text-xl font-extrabold text-foreground mb-1">Battery Dead!</h2>
        <p className="text-sm text-muted-foreground mb-5">You got 3 wrong! Your energy ran out.</p>

        <div className="flex flex-col gap-2 mb-4">
          {fullRecharges > 0 && (
            <button
              onClick={onUseFullRecharge}
              className="w-full py-3 rounded-xl font-bold text-sm active:scale-95 transition-transform"
              style={{ background: "rgba(34,197,94,0.15)", border: "1.5px solid rgba(34,197,94,0.4)", color: "#22c55e" }}
            >
              ⚡ Use Full Recharge (Full Battery) — {fullRecharges} left
            </button>
          )}
          {powerCells > 0 && (
            <button
              onClick={onUsePowerCell}
              className="w-full py-3 rounded-xl font-bold text-sm active:scale-95 transition-transform"
              style={{ background: "rgba(234,179,8,0.15)", border: "1.5px solid rgba(234,179,8,0.4)", color: "#eab308" }}
            >
              ⚡ Use Power Cell (+1 Charge) — {powerCells} left
            </button>
          )}
          <button
            onClick={onRestart}
            className="w-full py-3 rounded-xl font-bold text-sm active:scale-95 transition-transform"
            style={{ background: "rgba(239,68,68,0.12)", border: "1.5px solid rgba(239,68,68,0.3)", color: "#ef4444" }}
          >
            🔄 Restart Lesson
          </button>
        </div>

        <p className="text-xs text-muted-foreground">
          Restarting in <span className="font-black text-foreground">{countdown}</span>s...
        </p>
      </motion.div>
    </motion.div>
  );
}