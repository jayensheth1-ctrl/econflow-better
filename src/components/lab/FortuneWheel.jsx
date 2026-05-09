import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { updateProgress } from "../../lib/progressUtils";
import { playChaChig, playClick } from "../../lib/sounds";

const WEDGES = [
  { label: "5 XP", color: "#2ECC71", type: "xp", amount: 5 },
  { label: "2 💎", color: "#00F2FF", type: "gems", amount: 2 },
  { label: "10 XP", color: "#F1C40F", type: "xp", amount: 10 },
  { label: "10 💎", color: "#9B59B6", type: "gems", amount: 10 },
  { label: "5 XP", color: "#2ECC71", type: "xp", amount: 5 },
  { label: "JACKPOT", color: "#E74C3C", type: "gems", amount: 50, jackpot: true },
  { label: "10 XP", color: "#F1C40F", type: "xp", amount: 10 },
  { label: "2 💎", color: "#00F2FF", type: "gems", amount: 2 },
];

const WEDGE_ANGLE = 360 / WEDGES.length;

function getMs(lastSpin) {
  if (!lastSpin) return 0;
  return Math.max(0, 12 * 3600 * 1000 - (Date.now() - new Date(lastSpin).getTime()));
}
function fmt(ms) {
  if (ms <= 0) return "00:00:00";
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return [h, m, s].map(v => String(v).padStart(2, "0")).join(":");
}

export default function FortuneWheel({ progress, setProgress }) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(() => getMs(progress?.last_wheel_spin));

  useEffect(() => {
    if (timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft(getMs(progress?.last_wheel_spin)), 1000);
    return () => clearInterval(id);
  }, [progress?.last_wheel_spin]);

  const canSpin = timeLeft <= 0 && !spinning;

  async function handleSpin() {
    if (!canSpin) return;
    playClick();
    setSpinning(true);
    setResult(null);

    const winIdx = Math.floor(Math.random() * WEDGES.length);
    const extraSpins = 5 + Math.floor(Math.random() * 3);
    const targetAngle = rotation + extraSpins * 360 + (360 - winIdx * WEDGE_ANGLE - WEDGE_ANGLE / 2);

    setRotation(targetAngle);
    const prize = WEDGES[winIdx];

    setTimeout(async () => {
      setSpinning(false);
      setResult(prize);
      if (prize.jackpot) playChaChig();
      else playClick();

      const now = new Date().toISOString();
      const update = {
        last_wheel_spin: now,
        xp: prize.type === "xp" ? (progress.xp || 0) + prize.amount : (progress.xp || 0),
        gems: prize.type === "gems" ? (progress.gems || 0) + prize.amount : (progress.gems || 0),
      };
      const merged = await updateProgress(progress, update);
      setProgress(merged);
      setTimeLeft(12 * 3600 * 1000);
    }, 4500);
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <h3 className="text-lg font-extrabold text-white">Fortune Wheel 🎡</h3>
      <p className="text-xs text-gray-400">1 free spin every 12 hours</p>

      {/* Wheel */}
      <div className="relative" style={{ width: 240, height: 240 }}>
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10 text-2xl" style={{ filter: "drop-shadow(0 0 4px #00F2FF)" }}>▼</div>

        <motion.div
          className="relative rounded-full overflow-hidden shadow-2xl"
          style={{
            width: 240, height: 240,
            border: "3px solid rgba(0,242,255,0.4)",
            boxShadow: "0 0 30px rgba(0,242,255,0.3)",
          }}
          animate={{ rotate: rotation }}
          transition={spinning ? { duration: 4.5, ease: [0.16, 1, 0.3, 1] } : { duration: 0 }}
        >
          <svg viewBox="0 0 240 240" width="240" height="240">
            {WEDGES.map((w, i) => {
              const startAngle = (i * WEDGE_ANGLE - 90) * (Math.PI / 180);
              const endAngle = ((i + 1) * WEDGE_ANGLE - 90) * (Math.PI / 180);
              const x1 = 120 + 110 * Math.cos(startAngle);
              const y1 = 120 + 110 * Math.sin(startAngle);
              const x2 = 120 + 110 * Math.cos(endAngle);
              const y2 = 120 + 110 * Math.sin(endAngle);
              const midAngle = ((i + 0.5) * WEDGE_ANGLE - 90) * (Math.PI / 180);
              const tx = 120 + 70 * Math.cos(midAngle);
              const ty = 120 + 70 * Math.sin(midAngle);
              return (
                <g key={i}>
                  <path
                    d={`M 120 120 L ${x1} ${y1} A 110 110 0 0 1 ${x2} ${y2} Z`}
                    fill={w.color}
                    opacity={0.9}
                    stroke="rgba(0,0,0,0.3)"
                    strokeWidth="1"
                  />
                  <text
                    x={tx} y={ty}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize={w.jackpot ? "9" : "8"}
                    fontWeight="bold"
                    transform={`rotate(${(i + 0.5) * WEDGE_ANGLE}, ${tx}, ${ty})`}
                  >
                    {w.label}
                  </text>
                </g>
              );
            })}
            <circle cx="120" cy="120" r="12" fill="#0A0E17" stroke="rgba(0,242,255,0.5)" strokeWidth="2" />
          </svg>
        </motion.div>
      </div>

      {/* Result */}
      {result && !spinning && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center px-5 py-3 rounded-xl border"
          style={{ background: "rgba(0,242,255,0.08)", borderColor: "#00F2FF" }}
        >
          <p className="text-xl font-extrabold" style={{ color: result.jackpot ? "#F1C40F" : "#00F2FF" }}>
            {result.jackpot ? "🎉 JACKPOT! " : ""}+{result.amount} {result.type === "xp" ? "XP" : "💎"}
          </p>
          <p className="text-xs text-gray-400 mt-1">Added to your account!</p>
        </motion.div>
      )}

      {/* CTA */}
      {canSpin ? (
        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={handleSpin}
          disabled={spinning}
          className="px-8 py-3.5 rounded-xl font-extrabold text-base"
          style={{
            background: "linear-gradient(135deg, #00F2FF, #008080)",
            color: "#0A0E17",
            boxShadow: "0 0 20px rgba(0,242,255,0.5)",
          }}
        >
          🎡 SPIN!
        </motion.button>
      ) : (
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">Next spin in</p>
          <p className="text-2xl font-extrabold font-mono text-white">{fmt(timeLeft)}</p>
        </div>
      )}
    </div>
  );
}