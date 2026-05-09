import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import EconBuddy from "./EconBuddy";
import { Link } from "react-router-dom";

const MESSAGES = [
  "Ready to become a Billionaire? 🤑",
  "Keep going, future CFO! 🚀",
  "Money doesn't sleep — and neither do learners! 💪",
  "You're doing amazing! ⭐",
  "Every lesson = closer to financial freedom! 💎",
  "Smart money moves start here! 📈",
];

export default function Mascot({ streak, avatarConfig = {} }) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [showBubble, setShowBubble] = useState(true);

  useEffect(() => {
    const msg = streak > 0
      ? [`You're on a ${streak}-day streak! 🔥`, ...MESSAGES]
      : MESSAGES;

    const interval = setInterval(() => {
      setShowBubble(false);
      setTimeout(() => {
        setMsgIndex((i) => (i + 1) % MESSAGES.length);
        setShowBubble(true);
      }, 400);
    }, 5000);
    return () => clearInterval(interval);
  }, [streak]);

  const messages = streak > 0 ? [`You're on a ${streak}-day streak! 🔥`, ...MESSAGES] : MESSAGES;

  return (
    <div className="fixed bottom-24 right-4 z-30 flex flex-col items-end gap-2 pointer-events-none">
      {/* Speech bubble */}
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 8 }}
            className="bg-card border-2 border-primary/20 rounded-2xl rounded-br-sm px-3 py-2 shadow-lg max-w-[160px]"
          >
            <p className="text-[11px] font-bold text-foreground leading-tight">
              {messages[msgIndex % messages.length]}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EconBuddy mascot */}
      <Link to="/mascot">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ filter: "drop-shadow(0 0 10px rgba(0,242,255,0.4))" }}
        >
          <EconBuddy config={avatarConfig} size={52} />
        </motion.div>
      </Link>
    </div>
  );
}