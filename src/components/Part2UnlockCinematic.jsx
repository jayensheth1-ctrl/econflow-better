import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { updateProgress } from "../lib/progressUtils";
import EconBuddy from "./EconBuddy";
import { playChaChig, playLevelUp } from "../lib/sounds";

const DIAMOND_COUNT = 60;

export default function Part2UnlockCinematic({ progress, setProgress, onComplete }) {
  const [phase, setPhase] = useState("ribbon"); // ribbon | chest | portal
  const [diamonds, setDiamonds] = useState([]);
  const [chestExploded, setChestExploded] = useState(false);

  useEffect(() => { playLevelUp(); }, []);

  function generateDiamonds() {
    return Array.from({ length: DIAMOND_COUNT }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 80,
      vx: (Math.random() - 0.5) * 400,
      vy: -(200 + Math.random() * 300),
      size: 10 + Math.random() * 18,
      delay: Math.random() * 0.3,
    }));
  }

  function handleCutRibbon() {
    playChaChig();
    setPhase("chest");
    setTimeout(() => {
      // Chest explodes
      setChestExploded(true);
      setDiamonds(generateDiamonds());
      playChaChig();
      setTimeout(() => {
        setPhase("portal");
      }, 2200);
    }, 1200);
  }

  async function handleActivatePortal() {
    playLevelUp();
    const newOwned = [...(progress.owned_items || []), "part2-unlocked", "part2-portal"];
    const update = { owned_items: newOwned, gems: (progress.gems || 0) + 100 };
    setProgress(await updateProgress(progress, update));
    onComplete();
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "rgba(5, 0, 20, 0.96)", backdropFilter: "blur(8px)" }}
    >
      {/* Stars background */}
      {Array.from({ length: 40 }).map((_, i) => (
        <div key={i} className="absolute rounded-full bg-white"
          style={{ width: 1 + Math.random() * 2, height: 1 + Math.random() * 2, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: 0.3 + Math.random() * 0.5 }} />
      ))}

      {/* ── RIBBON PHASE ─────────────────────────────────── */}
      {phase === "ribbon" && (
        <div className="flex flex-col items-center gap-6 px-6 text-center">
          {/* Mascot with graduation cap (simulated via emoji overlay) */}
          <motion.div
            initial={{ scale: 0, y: 60 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="relative"
            style={{ filter: "drop-shadow(0 0 30px rgba(255, 215, 0, 0.6))" }}
          >
            <EconBuddy config={{ helmet: "ceo", eyes: "gold", outfit: "chrome", accessory: "diamond-hand" }} size={130} />
            {/* Gold aura ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{ boxShadow: ["0 0 0 0 rgba(255,215,0,0.5)", "0 0 0 40px rgba(255,215,0,0)"] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <h1 className="text-3xl font-black text-white mb-1" style={{ textShadow: "0 0 30px rgba(255,215,0,0.8)" }}>
              🎓 PART 1 COMPLETE!
            </h1>
            <p className="text-base font-bold" style={{ color: "#FFD700" }}>
              You've mastered the fundamentals.
            </p>
            <p className="text-sm text-gray-400 mt-1">Cut the ribbon to unlock Part 2: Global Tycoon</p>
          </motion.div>

          {/* Red ribbon */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="w-72 h-8 rounded-full flex items-center justify-center relative"
            style={{ background: "linear-gradient(90deg, #cc0000, #ff3333, #cc0000)", boxShadow: "0 0 20px rgba(255,0,0,0.5)" }}
          >
            <span className="text-white font-black text-xs tracking-widest uppercase">✦ Grand Opening ✦</span>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleCutRibbon}
            className="px-10 py-4 rounded-2xl font-black text-xl"
            style={{
              background: "linear-gradient(135deg, #FFD700, #FFA500)",
              color: "#0a0010",
              boxShadow: "0 0 30px rgba(255,215,0,0.6), 0 6px 0 rgba(180,120,0,0.8)",
            }}
          >
            ✂️ CUT THE RIBBON
          </motion.button>
        </div>
      )}

      {/* ── CHEST PHASE ──────────────────────────────────── */}
      {phase === "chest" && (
        <div className="flex flex-col items-center gap-4">
          {/* Floating diamonds */}
          <AnimatePresence>
            {chestExploded && diamonds.map(d => (
              <motion.div
                key={d.id}
                className="fixed pointer-events-none text-2xl"
                style={{ left: "50%", top: "50%", fontSize: d.size }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
                animate={{ x: d.vx, y: d.vy, opacity: 0, scale: 1.5, rotate: Math.random() * 720 }}
                transition={{ duration: 1.4, delay: d.delay, ease: "easeOut" }}
              >
                💎
              </motion.div>
            ))}
          </AnimatePresence>

          <motion.div
            animate={!chestExploded ? {
              x: [-6, 6, -5, 5, -3, 3, 0],
              y: [0, -4, 0],
              scale: [1, 1.05, 1],
            } : { scale: [1, 2.5], opacity: [1, 0] }}
            transition={!chestExploded ? { duration: 0.5, repeat: Infinity } : { duration: 0.3 }}
            className="text-9xl select-none"
            style={{ filter: "drop-shadow(0 0 30px rgba(255,215,0,0.8))" }}
          >
            {chestExploded ? "✨" : "📦"}
          </motion.div>

          {!chestExploded && (
            <motion.p
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-xl font-extrabold"
              style={{ color: "#FFD700" }}
            >
              TREASURE CHEST INCOMING...
            </motion.p>
          )}

          {chestExploded && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <p className="text-4xl font-black text-white">💎 × 100 GEMS!</p>
              <p className="text-lg font-bold text-yellow-400">Added to your vault!</p>
            </motion.div>
          )}
        </div>
      )}

      {/* ── PORTAL PHASE ─────────────────────────────────── */}
      {phase === "portal" && (
        <div className="flex flex-col items-center gap-6 px-6 text-center">
          {/* Purple glowing portal */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 150, damping: 15 }}
            className="relative flex items-center justify-center"
            style={{ width: 180, height: 180 }}
          >
            {/* Outer rings */}
            {[1, 0.85, 0.7].map((scale, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                animate={{ rotate: i % 2 === 0 ? 360 : -360, scale: [scale, scale * 1.05, scale] }}
                transition={{ rotate: { duration: 3 + i, repeat: Infinity, ease: "linear" }, scale: { duration: 2, repeat: Infinity } }}
                style={{
                  width: 180 * scale,
                  height: 180 * scale,
                  border: `2px solid rgba(160,60,255,${0.6 - i * 0.15})`,
                  boxShadow: `0 0 20px rgba(160,60,255,0.5)`,
                }}
              />
            ))}
            {/* Portal core */}
            <div className="w-28 h-28 rounded-full flex items-center justify-center"
              style={{
                background: "radial-gradient(circle, rgba(160,60,255,0.9) 0%, rgba(80,0,160,0.95) 60%, rgba(20,0,60,1) 100%)",
                boxShadow: "0 0 60px rgba(160,60,255,0.8), inset 0 0 30px rgba(255,255,255,0.15)",
              }}>
              <span className="text-4xl">🌀</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="text-2xl font-black" style={{ color: "#C084FC", textShadow: "0 0 20px rgba(192,132,252,0.8)" }}>
              PART 2 UNLOCKED
            </h2>
            <p className="text-base font-bold text-white mt-1">The Global Tycoon</p>
            <p className="text-sm text-gray-400 mt-1">Step through to transform your world</p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            whileTap={{ scale: 0.93 }}
            onClick={handleActivatePortal}
            className="px-10 py-4 rounded-2xl font-black text-lg"
            style={{
              background: "linear-gradient(135deg, #9333ea, #6d28d9)",
              color: "white",
              boxShadow: "0 0 40px rgba(147,51,234,0.7), 0 5px 0 rgba(80,0,160,0.8)",
            }}
          >
            🌀 ENTER PART 2
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}