import { useEffect } from "react";
import { motion } from "framer-motion";
import { playLevelUp } from "../lib/sounds";

export default function LevelUpOverlay({ level, onClose }) {
  useEffect(() => {
    playLevelUp();
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ background: "radial-gradient(ellipse at center, #001a2e 0%, #0A0E17 70%)" }}
      onClick={onClose}
    >
      {/* Glow rings */}
      {[1, 2, 3].map(i => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-cyan-400/30"
          animate={{ scale: [1, 2.5 + i * 0.5], opacity: [0.6, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.4, ease: "easeOut" }}
          style={{ width: 120, height: 120 }}
        />
      ))}

      {/* Rotating diamond */}
      <motion.div
        animate={{ rotateY: 360 }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        className="text-8xl mb-6 drop-shadow-2xl"
        style={{ filter: "drop-shadow(0 0 30px #00F2FF)" }}
      >
        💎
      </motion.div>

      {/* Level Up text */}
      <motion.h1
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.3 }}
        className="text-5xl font-black tracking-widest mb-2"
        style={{
          color: "#00F2FF",
          textShadow: "0 0 20px #00F2FF, 0 0 40px #00F2FF, 0 0 80px #00BFFF",
        }}
      >
        LEVEL UP!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-2xl font-bold text-white/80"
      >
        You reached Level {level}
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="text-sm text-white/40 mt-6"
      >
        Tap to continue
      </motion.p>
    </motion.div>
  );
}