import { motion } from "framer-motion";
import { useMemo } from "react";

const STICKERS_P1 = ["🪙", "🐷", "🚀", "💎", "📈", "💰", "⭐", "🏆", "💵", "🎯"];
const STICKERS_GOLD = ["🏆", "💍", "💹", "👑", "✨", "🥇", "💫", "🌟", "💛", "🔱"];
const STICKERS_P2 = ["🏙️", "🌍", "🏛️", "🛰️", "🏦", "📡", "🌐", "⚡", "🔮", "👑"];

function Sticker({ emoji, style, duration, delay, x1, x2, y1, y2, rotate1, rotate2 }) {
  return (
    <motion.div
      className="absolute select-none pointer-events-none text-2xl"
      style={style}
      initial={{ x: x1, y: y1, rotate: rotate1, opacity: 0.7 }}
      animate={{ x: x2, y: y2, rotate: rotate2, opacity: [0.5, 0.8, 0.5] }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
    >
      {emoji}
    </motion.div>
  );
}

export default function FloatingStickers({ part2Unlocked = false, goldActive = false }) {
  const STICKERS = goldActive ? STICKERS_GOLD : part2Unlocked ? [...STICKERS_P2, ...STICKERS_P1.slice(0, 4)] : STICKERS_P1;
  const stickers = useMemo(() => (
    Array.from({ length: 14 }, (_, i) => ({
      id: i,
      emoji: STICKERS[i % STICKERS.length],
      left: `${(i * 7.3 + 3) % 95}%`,
      top: `${(i * 11.7 + 5) % 90}%`,
      duration: 5 + (i % 5) * 1.2,
      delay: i * 0.4,
      x1: -8 + (i % 3) * 4,
      x2: 8 - (i % 3) * 4,
      y1: -10 + (i % 4) * 3,
      y2: 10 - (i % 4) * 3,
      rotate1: -15 + (i % 4) * 5,
      rotate2: 15 - (i % 4) * 5,
    }))
  ), []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {stickers.map((s) => (
        <Sticker
          key={s.id}
          emoji={s.emoji}
          style={{ left: s.left, top: s.top }}
          duration={s.duration}
          delay={s.delay}
          x1={s.x1} x2={s.x2}
          y1={s.y1} y2={s.y2}
          rotate1={s.rotate1} rotate2={s.rotate2}
        />
      ))}
    </div>
  );
}