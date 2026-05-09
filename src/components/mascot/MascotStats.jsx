import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";

const STATS = [
  { key: "iq",  label: "IQ",  icon: "🧠", color: "#00F2FF", masteryColor: "#F1C40F", desc: "Intelligence", formula: "Lessons × 10" },
  { key: "wlt", label: "WLT", icon: "💎", color: "#2ECC71", masteryColor: "#F1C40F", desc: "Wealth",       formula: "Gem balance ÷ 2" },
  { key: "inf", label: "INF", icon: "⚡", color: "#C084FC", masteryColor: "#F1C40F", desc: "Influence",    formula: "XP ÷ 5" },
];

const MILESTONES = [25, 50, 75, 100];

function CountUp({ target, color }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / 30);
    const id = setInterval(() => {
      start = Math.min(start + step, target);
      setDisplay(start);
      if (start >= target) clearInterval(id);
    }, 30);
    return () => clearInterval(id);
  }, [target]);

  return (
    <span className="text-sm font-black tabular-nums" style={{ color }}>
      {display}
    </span>
  );
}

function StatBar({ stat, value }) {
  // Color shifts cyan→gold at mastery (≥75)
  const barColor = value >= 75 ? stat.masteryColor : stat.color;
  const nextMilestone = MILESTONES.find(m => m > value) || 100;
  const prevMilestone = [...MILESTONES].reverse().find(m => m <= value) || 0;

  return (
    <div className="rounded-xl px-2.5 py-2"
      style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))" }}>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1">
          <span className="text-sm">{stat.icon}</span>
          <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: barColor }}>{stat.label}</span>
        </div>
        <CountUp target={value} color={barColor} />
      </div>

      {/* Bar track */}
      <div className="w-full h-2 rounded-full relative" style={{ background: "hsl(var(--border))" }}>
        <motion.div
          className="h-full rounded-full absolute top-0 left-0"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: `linear-gradient(90deg, ${barColor}66, ${barColor})`,
            boxShadow: `0 0 8px ${barColor}55`,
          }}
        />
        {/* Milestone ticks */}
        {MILESTONES.slice(0, -1).map(m => (
          <div key={m} className="absolute top-0 bottom-0 w-px"
            style={{ left: `${m}%`, background: "hsl(var(--card))" }} />
        ))}
      </div>

      {/* Mastery indicator */}
      {value >= 75 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[8px] font-black mt-1 text-center"
          style={{ color: stat.masteryColor }}>
          ★ MASTERY
        </motion.p>
      )}

      <p className="text-[7px] text-muted-foreground mt-0.5">{stat.formula}</p>
    </div>
  );
}

export default function MascotStats({ iq, wlt, inf, level, xp }) {
  const values = { iq, wlt, inf };
  const [milestoneHit, setMilestoneHit] = useState(null);

  // Detect milestone crossings
  useEffect(() => {
    const crossed = MILESTONES.find(m => iq === m || wlt === m || inf === m);
    if (crossed) {
      setMilestoneHit(crossed);
      setTimeout(() => setMilestoneHit(null), 2500);
    }
  }, [iq, wlt, inf]);

  return (
    <div className="w-28 flex flex-col gap-2 justify-center relative">
      {/* Level badge */}
      <div className="rounded-xl px-2 py-2 text-center"
        style={{ background: "rgba(0,242,255,0.06)", border: "1px solid rgba(0,242,255,0.18)" }}>
        <p className="text-[8px] font-bold uppercase tracking-widest" style={{ color: "rgba(0,242,255,0.45)" }}>LEVEL</p>
        <p className="text-2xl font-black" style={{ color: "#00F2FF", lineHeight: 1.1 }}>{level}</p>
        <p className="text-[8px] text-muted-foreground">{xp} XP</p>
      </div>

      {/* Stat bars */}
      {STATS.map(stat => (
        <StatBar key={stat.key} stat={stat} value={values[stat.key]} />
      ))}

      {/* Milestone popup */}
      {milestoneHit && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute -top-8 left-0 right-0 text-center px-2 py-1 rounded-lg text-[9px] font-black"
          style={{ background: "rgba(241,196,15,0.2)", border: "1px solid rgba(241,196,15,0.4)", color: "#F1C40F" }}>
          🏆 MILESTONE {milestoneHit}!
        </motion.div>
      )}
    </div>
  );
}