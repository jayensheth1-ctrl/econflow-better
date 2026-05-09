import { motion, AnimatePresence } from "framer-motion";

// Usage: <FloatingGemPopup items={floatingGems} />
// items: [{ id, amount, label }]
export default function FloatingGemPopup({ items }) {
  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none">
      <AnimatePresence>
        {items.map(item => (
          <motion.div
            key={item.id}
            initial={{ y: 0, opacity: 1, scale: 0.8 }}
            animate={{ y: -80, opacity: 0, scale: 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="flex items-center gap-2 bg-card/90 border-2 border-amber-400/60 rounded-full px-4 py-2 shadow-lg backdrop-blur-sm"
          >
            <span className="text-2xl">💎</span>
            <span className="text-base font-extrabold text-amber-400">+{item.amount} Gems</span>
            {item.label && <span className="text-xs text-muted-foreground">{item.label}</span>}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}