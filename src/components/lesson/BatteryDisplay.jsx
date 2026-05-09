import { motion } from "framer-motion";

export default function BatteryDisplay({ charges, maxCharges }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Battery: ${charges} of ${maxCharges} charges`}>
      {/* Battery body */}
      <div className="relative flex items-center gap-0.5 px-1.5 py-1 rounded-md"
        style={{ background: "rgba(0,0,0,0.25)", border: "1.5px solid rgba(255,255,255,0.15)" }}>
        {Array.from({ length: maxCharges }).map((_, i) => {
          const lit = i < charges;
          const isDanger = charges === 1 && lit;
          return (
            <motion.div
              key={i}
              className="rounded-sm"
              style={{ width: maxCharges > 3 ? 8 : 10, height: 16 }}
              animate={isDanger
                ? { backgroundColor: ["#ef4444", "#991b1b", "#ef4444"], opacity: [1, 0.6, 1] }
                : { backgroundColor: lit ? "#22c55e" : "rgba(255,255,255,0.1)", opacity: 1 }
              }
              transition={isDanger
                ? { duration: 0.8, repeat: Infinity }
                : { duration: 0.3 }
              }
            />
          );
        })}
      </div>
      {/* Battery tip */}
      <div className="w-1 h-2.5 rounded-r-sm" style={{ background: "rgba(255,255,255,0.2)" }} />
    </div>
  );
}