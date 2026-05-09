import { motion, AnimatePresence } from "framer-motion";

export default function ScanOverlay({ active }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Horizontal scan line sweeping top to bottom */}
          <motion.div
            className="absolute left-0 right-0 h-1"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(0,242,255,0.8), transparent)",
              boxShadow: "0 0 10px rgba(0,242,255,0.5)",
            }}
            initial={{ top: "0%" }}
            animate={{ top: "100%" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
          {/* Faint tint */}
          <div className="absolute inset-0 rounded-2xl" style={{ background: "rgba(0,242,255,0.04)" }} />
          {/* Corner brackets */}
          {[["top-2 left-2", "0 2px", "2px 0"], ["top-2 right-2", "0 -2px", "2px 0"],
            ["bottom-2 left-2", "0 2px", "-2px 0"], ["bottom-2 right-2", "0 -2px", "-2px 0"]].map(([pos, bx, by], i) => (
            <div key={i} className={`absolute ${pos} w-5 h-5`}
              style={{ borderTop: `2px solid rgba(0,242,255,0.8)`, borderLeft: `2px solid rgba(0,242,255,0.8)`, transform: `scaleX(${bx.includes("-") ? -1 : 1}) scaleY(${by.includes("-") ? -1 : 1})` }} />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}