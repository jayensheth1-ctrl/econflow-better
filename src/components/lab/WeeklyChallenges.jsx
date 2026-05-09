import { motion } from "framer-motion";

const CHALLENGES_P1 = [
  {
    id: "perfect-week",
    emoji: "🗓️",
    title: "The Perfect Week",
    desc: "Log in 7 days in a row",
    reward: "100 XP",
    color: "#00F2FF",
    getProgress: (p) => Math.min(7, p.streak || 0),
    total: 7,
  },
  {
    id: "analyst",
    emoji: "📊",
    title: "The Analyst",
    desc: "Earn 500+ XP total",
    reward: "Blue Glow Border",
    color: "#9B59B6",
    getProgress: (p) => Math.min(500, p.xp || 0),
    total: 500,
  },
  {
    id: "lesson-streak",
    emoji: "🎯",
    title: "Lesson Master",
    desc: "Complete 10 lessons",
    reward: "50 XP",
    color: "#F1C40F",
    getProgress: (p) => Math.min(10, (p.completed_lessons || []).length),
    total: 10,
  },
  {
    id: "gem-collector",
    emoji: "💎",
    title: "Gem Collector",
    desc: "Earn 100 Gems",
    reward: "Exclusive Avatar",
    color: "#2ECC71",
    getProgress: (p) => Math.min(100, p.gems || 0),
    total: 100,
  },
];

const CHALLENGES_P2 = [
  {
    id: "perfect-lessons",
    emoji: "🧠",
    title: "Zero Mistake Mastermind",
    desc: "Complete 3 Part 2 lessons without missing any answer",
    reward: "⚡ 200 XP + Legendary Badge",
    color: "#C084FC",
    legendary: true,
    getProgress: (p) => Math.min(3, Math.floor(((p.completed_lessons || []).filter(id => id.startsWith('5-') || id.startsWith('6-') || id.startsWith('7-') || id.startsWith('8-') || id.startsWith('9-')).length) / 1)),
    total: 3,
  },
  {
    id: "global-trader",
    emoji: "🌍",
    title: "Global Trader",
    desc: "Trade 5 different global stocks in the simulator",
    reward: "👑 50 Gems + Gold Border",
    color: "#FFD700",
    legendary: true,
    getProgress: (p) => Math.min(5, Object.keys(p.stock_positions || {}).length),
    total: 5,
  },
  {
    id: "tycoon-streak",
    emoji: "🏙️",
    title: "Tycoon Streak",
    desc: "Maintain a 5-day login streak in Part 2",
    reward: "🔮 Prestige Aura Item",
    color: "#9333EA",
    legendary: true,
    getProgress: (p) => Math.min(5, p.streak || 0),
    total: 5,
  },
  {
    id: "xp-mogul",
    emoji: "🛰️",
    title: "XP Mogul",
    desc: "Reach 1000 XP total",
    reward: "🌟 Legendary Frame",
    color: "#F59E0B",
    legendary: true,
    getProgress: (p) => Math.min(1000, p.xp || 0),
    total: 1000,
  },
];

export default function WeeklyChallenges({ progress }) {
  const part2Unlocked = (progress?.owned_items || []).includes('part2-unlocked');
  const CHALLENGES = part2Unlocked ? [...CHALLENGES_P1, ...CHALLENGES_P2] : CHALLENGES_P1;

  return (
    <div className="flex flex-col gap-4">
      <div className="text-center mb-2">
        <h3 className="text-lg font-extrabold text-white">⚔️ {part2Unlocked ? 'Legendary Challenges' : 'Weekly Challenges'}</h3>
        <p className="text-xs text-gray-400">{part2Unlocked ? 'High-stakes rewards for Global Tycoons' : 'Battle Pass — resets every 7 days'}</p>
      </div>

      {CHALLENGES.map((c) => {
        const current = c.getProgress(progress);
        const pct = Math.round((current / c.total) * 100);
        const done = pct >= 100;

        return (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-xl p-4"
            style={{
              background: done ? `${c.color}12` : c.legendary ? "rgba(147,51,234,0.06)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${done ? c.color : c.legendary ? "rgba(147,51,234,0.3)" : "rgba(255,255,255,0.08)"}`,
              boxShadow: done ? `0 0 16px ${c.color}30` : c.legendary ? "0 0 20px rgba(147,51,234,0.15)" : "none",
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{c.emoji}</span>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <p className="font-bold text-sm text-white">{c.title}</p>
                  {done && <span className="text-xs font-bold text-green-400">✅ DONE</span>}
                </div>
                <p className="text-xs text-gray-400">{c.desc}</p>
              </div>
            </div>

            {/* Glassmorphism liquid progress bar */}
            <div className="h-4 rounded-full overflow-hidden mb-2" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <motion.div
                className="h-full rounded-full relative overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                style={{
                  background: `linear-gradient(90deg, ${c.color}aa, ${c.color})`,
                  boxShadow: `0 0 12px ${c.color}80`,
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-white/20 rounded-full"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                  style={{ width: "40%" }}
                />
              </motion.div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">{current} / {c.total}</span>
              <span className="text-xs font-bold" style={{ color: c.color }}>🏆 {c.reward}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}