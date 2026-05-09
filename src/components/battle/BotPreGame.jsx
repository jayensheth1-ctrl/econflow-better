import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BotPreGame({ bot, onReady }) {
  const [phase, setPhase] = useState("reveal"); // reveal | countdown
  const [count, setCount] = useState(3);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("countdown"), 2000);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (phase !== "countdown") return;
    if (count === 0) {
      const t = setTimeout(onReady, 700);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCount(c => c - 1), 800);
    return () => clearTimeout(t);
  }, [phase, count]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      {/* Grid bg */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        <svg width="100%" height="100%">
          <defs><pattern id="pgrid" width="36" height="36" patternUnits="userSpaceOnUse">
            <path d="M 36 0 L 0 0 0 36" fill="none" stroke="#C084FC" strokeWidth="0.5"/>
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#pgrid)"/>
        </svg>
      </div>

      <AnimatePresence mode="wait">
        {phase === "reveal" ? (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="flex flex-col items-center gap-5 text-center px-6"
          >
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              YOUR OPPONENT
            </p>
            <motion.div
              animate={{ y: [-8, 8, -8] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="text-8xl"
              style={{ filter: "drop-shadow(0 0 30px rgba(192,132,252,0.6))" }}
            >
              {bot.emoji}
            </motion.div>
            <div>
              <h2 className="text-3xl font-black text-foreground mb-2">{bot.name}</h2>
              <div className="flex justify-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.span
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.1, type: "spring" }}
                    className="text-2xl"
                    style={{ filter: i < bot.strength ? "none" : "grayscale(1) opacity(0.2)" }}
                  >
                    ⭐
                  </motion.span>
                ))}
              </div>
              <p className="text-xs font-bold mt-2 text-muted-foreground">
                Strength {bot.strength}/5
              </p>
              </div>
              {/* Stakes */}
              <div className="flex gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black"
                style={{ background: "rgba(46,204,113,0.12)", border: "1px solid rgba(46,204,113,0.3)", color: "#2ECC71" }}>
                Win: +15 💎
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black"
                style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444" }}>
                Lose: -10 💎
              </div>
              </div>
              <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-[10px] font-bold text-muted-foreground"
              >
              Get ready...
              </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key={count === 0 ? "battle" : count}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1.1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 20 }}
            className="font-black text-center"
            style={{
              fontSize: count === 0 ? 48 : 96,
              color: count === 0 ? "#C084FC" : "#F1C40F",
              textShadow: `0 0 40px ${count === 0 ? "#C084FC" : "#F1C40F"}`,
            }}
          >
            {count === 0 ? "BATTLE!" : count}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}