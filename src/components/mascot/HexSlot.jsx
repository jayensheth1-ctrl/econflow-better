import { motion } from "framer-motion";
import { Gem, Check } from "lucide-react";

export default function HexSlot({ item, owned, equipped, previewing, canAfford, accentColor, onSelect, onBuy, onEquip }) {
  const isLocked = !owned;

  return (
    <motion.div
      whileTap={{ scale: 0.93 }}
      onClick={owned ? onSelect : undefined}
      className="relative flex flex-col items-center gap-1 cursor-pointer"
      style={{ width: 76 }}
    >
      {/* Hexagonal frame via clip-path */}
      <div
        className="relative flex items-center justify-center"
        style={{
          width: 64,
          height: 72,
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          background: previewing
            ? `linear-gradient(135deg, ${accentColor}40, ${accentColor}18)`
            : equipped
            ? `linear-gradient(135deg, ${accentColor}20, ${accentColor}08)`
            : isLocked
            ? "hsl(var(--muted))"
            : "hsl(var(--secondary))",
          transition: "background 0.2s",
        }}
      >
        {/* Inner hex border */}
        <div
          className="absolute inset-[2px] flex items-center justify-center"
          style={{
            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            background: previewing
              ? `linear-gradient(135deg, ${accentColor}28, hsl(var(--card)))`
              : "hsl(var(--card))",
          }}
        >
          <span className="text-2xl select-none" style={{ filter: isLocked ? "grayscale(0.6) opacity(0.5)" : "none" }}>
            {item.emoji}
          </span>
        </div>

        {/* Equipped checkmark */}
        {equipped && (
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center z-10"
            style={{ background: accentColor }}>
            <Check className="w-3 h-3 text-black" strokeWidth={3} />
          </div>
        )}

        {/* Glow ring when previewing */}
        {previewing && (
          <motion.div
            className="absolute inset-0"
            style={{
              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              background: "transparent",
              boxShadow: `0 0 0 2px ${accentColor}`,
            }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </div>

      {/* Label */}
      <p className="text-[9px] font-bold text-center leading-tight" style={{ color: previewing ? accentColor : "hsl(var(--muted-foreground))", maxWidth: 72 }}>
        {item.label}
      </p>

      {/* Material tag */}
      {item.material && (
        <span className="text-[7px] font-bold px-1 py-0.5 rounded"
          style={{
            background: item.material === "carbon" ? "rgba(255,255,255,0.08)" :
                        item.material === "chrome" ? "rgba(200,220,255,0.1)" :
                        item.material === "gold"   ? "rgba(241,196,15,0.15)" :
                        "rgba(255,255,255,0.05)",
            color: item.material === "carbon" ? "#aaa" :
                   item.material === "chrome" ? "#c8d4ff" :
                   item.material === "gold"   ? "#F1C40F" :
                   "#666",
          }}>
          {item.material === "carbon" ? "CARBON" :
           item.material === "chrome" ? "CHROME" :
           item.material === "gold"   ? "GOLD LEAF" :
           item.material === "camo"   ? "TACTICAL" : ""}
        </span>
      )}

      {/* Action button */}
      <div className="w-full flex justify-center">
        {owned ? (
          equipped ? null : (
            <button
              onClick={e => { e.stopPropagation(); onEquip(); }}
              className="text-[8px] font-bold px-2 py-0.5 rounded"
              style={{ background: `${accentColor}18`, color: accentColor, border: `1px solid ${accentColor}33` }}>
              EQUIP
            </button>
          )
        ) : (
          <button
            onClick={e => { e.stopPropagation(); onBuy(); }}
            className="text-[8px] font-bold px-2 py-0.5 rounded flex items-center gap-0.5"
            style={{
              background: canAfford ? `${accentColor}15` : "hsl(var(--muted))",
              color: canAfford ? accentColor : "hsl(var(--muted-foreground))",
              border: `1px solid ${canAfford ? `${accentColor}33` : "hsl(var(--border))"}`,
            }}>
            <Gem className="w-2 h-2" />{item.price}
          </button>
        )}
      </div>
    </motion.div>
  );
}