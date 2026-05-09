import { motion } from "framer-motion";
import { Swords, ScrollText } from "lucide-react";
import { Link } from "react-router-dom";

export default function BattleBanner({ onStartBattle }) {
  return (
    <div className="mb-5">
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onStartBattle}
        className="w-full rounded-2xl p-4 flex items-center gap-4"
        style={{
          background: "linear-gradient(135deg, rgba(220,38,38,0.15), rgba(147,51,234,0.15))",
          border: "2px solid rgba(220,38,38,0.4)",
          boxShadow: "0 0 20px rgba(220,38,38,0.15)",
        }}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #dc2626, #9333ea)" }}
        >
          <Swords className="w-6 h-6 text-white" />
        </div>
        <div className="text-left">
          <p className="text-sm font-extrabold text-foreground">⚔️ Battle Mode</p>
          <p className="text-xs text-muted-foreground">Win +15 💎 · Lose or forfeit −10 💎</p>
        </div>
        <motion.div
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="ml-auto text-lg"
        >
          →
        </motion.div>
      </motion.button>
      <Link
        to="/battle-logs"
        className="flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-xl text-xs font-bold w-fit"
        style={{ background: "rgba(192,132,252,0.08)", border: "1px solid rgba(192,132,252,0.2)", color: "#C084FC" }}
      >
        <ScrollText className="w-3 h-3" /> View Battle Logs
      </Link>
    </div>
  );
}