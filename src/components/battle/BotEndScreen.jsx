import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { getMotivationalLine } from "../../lib/botBattle";

export default function BotEndScreen({
  won, myScore, botScore, myName, bot,
  winGems = 15, lossGems = 10, forfeitMessage,
  onPlayAgain, onBack,
}) {
  const confettiFired = useRef(false);

  useEffect(() => {
    if (won && !confettiFired.current) {
      confettiFired.current = true;
      confetti({ particleCount: 160, spread: 90, origin: { y: 0.5 }, colors: ["#C084FC", "#F1C40F", "#2ECC71", "#00F2FF"] });
      setTimeout(() => confetti({ particleCount: 80, spread: 120, origin: { y: 0.3 } }), 400);
    }
  }, [won]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-background">
      <motion.div
        initial={{ scale: 0.7, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="w-full max-w-sm flex flex-col items-center gap-5 text-center"
      >
        {/* Result emoji */}
        <motion.div
          animate={{ y: [-6, 6, -6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-7xl"
          style={{ filter: `drop-shadow(0 0 24px ${won ? "rgba(241,196,15,0.7)" : "rgba(231,76,60,0.5)"})` }}
        >
          {won ? "🏆" : bot.emoji}
        </motion.div>

        {/* Title */}
        <div>
          {won ? (
            <>
              <h2 className="text-2xl font-black text-foreground mb-1">YOU BEAT {bot.name.toUpperCase()}!</h2>
              <div className="flex justify-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="text-lg" style={{ filter: i < bot.strength ? "none" : "grayscale(1) opacity(0.2)" }}>⭐</span>
                ))}
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-black text-sm"
                style={{ background: "rgba(46,204,113,0.12)", border: "1px solid rgba(46,204,113,0.35)", color: "#2ECC71" }}
              >
                💎 +{winGems} Gems Earned!
              </motion.div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-black text-foreground mb-1">
                {forfeitMessage ? "You Forfeited!" : `${bot.name} wins this round!`}
              </h2>
              {forfeitMessage ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-black text-sm mt-1"
                  style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.35)", color: "#ef4444" }}
                >
                  💎 -{lossGems} Gems
                </motion.div>
              ) : (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-black text-sm mt-1"
                    style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.35)", color: "#ef4444" }}
                  >
                    💎 -{lossGems} Gems Lost
                  </motion.div>
                  <p className="text-sm text-muted-foreground mt-2">{getMotivationalLine(myScore)}</p>
                </>
              )}
            </>
          )}
        </div>

        {/* Score */}
        <div
          className="w-full rounded-2xl p-4 flex items-center justify-around"
          style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))" }}
        >
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-wider text-purple-400 mb-1">{myName}</p>
            <p className="text-4xl font-black text-foreground">{myScore}</p>
          </div>
          <p className="text-xl font-black text-muted-foreground">—</p>
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-wider text-cyan-400 mb-1">{bot.name}</p>
            <p className="text-4xl font-black text-foreground">{botScore}</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2 w-full">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onPlayAgain}
            className="w-full py-3.5 rounded-xl font-black text-sm text-white"
            style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)", boxShadow: "0 0 20px rgba(124,58,237,0.4)" }}
          >
            {won ? "⚔️ Battle Again" : "🔄 Try Again"}
          </motion.button>
          <button
            onClick={onBack}
            className="w-full py-3 rounded-xl font-bold text-sm"
            style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}
          >
            Back to Learn
          </button>
        </div>
      </motion.div>
    </div>
  );
}