import { motion } from "framer-motion";
import { Gem, Check, ShieldCheck, TrendingUp, Clock, Play } from "lucide-react";

function fmt(ms) {
  if (ms <= 0) return "00:00";
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function ShopItemCard({
  item, rarityMeta, owned, count, canAfford,
  isTimerActive, timerMs, isToggleActive,
  onBuy, onUse,
}) {
  const hasInInventory = item.behavior === "consumable_stack" && count > 0;

  // Bottom button state
  let bottomSlot;

  if (item.behavior === "consumable_stack") {
    if (hasInInventory) {
      bottomSlot = (
        <div className="flex gap-1">
          {/* USE button */}
          <button
            onClick={e => { e.stopPropagation(); onUse(); }}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl font-black text-[9px] transition-all"
            style={{ background: "rgba(46,204,113,0.15)", border: "1px solid rgba(46,204,113,0.4)", color: "#2ECC71" }}>
            <Play className="w-2.5 h-2.5" /> USE
          </button>
          {/* Buy more */}
          <button
            onClick={e => { e.stopPropagation(); onBuy(); }}
            className="flex items-center gap-0.5 px-2 py-1.5 rounded-xl font-black text-[9px]"
            style={{
              background: canAfford ? `${rarityMeta.color}12` : "hsl(var(--muted))",
              border: `1px solid ${canAfford ? `${rarityMeta.color}33` : "hsl(var(--border))"}`,
              color: canAfford ? rarityMeta.color : "hsl(var(--muted-foreground))",
            }}>
            <Gem className="w-2 h-2" />{item.price}
          </button>
        </div>
      );
    } else {
      bottomSlot = (
        <div className="flex items-center gap-1 py-1.5 rounded-xl justify-center"
          style={{
            background: canAfford ? `${rarityMeta.color}18` : "hsl(var(--muted))",
            border: `1px solid ${canAfford ? `${rarityMeta.color}44` : "hsl(var(--border))"}`,
            }}>
            <Gem className="w-3 h-3" style={{ color: canAfford ? rarityMeta.color : "hsl(var(--muted-foreground))" }} />
            <span className="text-[10px] font-black" style={{ color: canAfford ? rarityMeta.color : "hsl(var(--muted-foreground))" }}>
            {item.price}
            </span>
            </div>
            );
            }
            } else if (item.behavior === "timed") {
            if (isTimerActive) {
      bottomSlot = (
        <div className="flex items-center gap-1 py-1.5 rounded-xl justify-center"
          style={{ background: "rgba(241,196,15,0.1)", border: "1px solid rgba(241,196,15,0.3)" }}>
          <Clock className="w-3 h-3 text-yellow-400" />
          <span className="text-[10px] font-black text-yellow-400">{fmt(timerMs)}</span>
        </div>
      );
    } else {
      // Expired or never bought — can buy again to reactivate
      bottomSlot = (
        <div className="flex items-center gap-1 py-1.5 rounded-xl justify-center"
          style={{
            background: canAfford ? `${rarityMeta.color}18` : "hsl(var(--muted))",
            border: `1px solid ${canAfford ? `${rarityMeta.color}44` : "hsl(var(--border))"}`,
          }}>
          <Gem className="w-3 h-3" style={{ color: canAfford ? rarityMeta.color : "hsl(var(--muted-foreground))" }} />
          <span className="text-[10px] font-black" style={{ color: canAfford ? rarityMeta.color : "hsl(var(--muted-foreground))" }}>
            {item.price}
          </span>
        </div>
      );
    }
  } else if (item.behavior === "toggle") {
    if (isToggleActive) {
      bottomSlot = (
        <div className="flex items-center gap-1 py-1.5 rounded-xl justify-center"
          style={{ background: "rgba(0,242,255,0.08)", border: "1px solid rgba(0,242,255,0.25)" }}>
          <ShieldCheck className="w-3 h-3 text-cyan-400" />
          <span className="text-[9px] font-black text-cyan-400">ACTIVE</span>
        </div>
      );
    } else {
      bottomSlot = (
        <div className="flex items-center gap-1 py-1.5 rounded-xl justify-center"
          style={{
            background: canAfford ? `${rarityMeta.color}18` : "hsl(var(--muted))",
            border: `1px solid ${canAfford ? `${rarityMeta.color}44` : "hsl(var(--border))"}`,
          }}>
          <Gem className="w-3 h-3" style={{ color: canAfford ? rarityMeta.color : "hsl(var(--muted-foreground))" }} />
          <span className="text-[10px] font-black" style={{ color: canAfford ? rarityMeta.color : "hsl(var(--muted-foreground))" }}>
            {item.price}
          </span>
        </div>
      );
    }
  } else {
    // avatar / passive — one-time owned
    if (owned) {
      bottomSlot = (
        <div className="flex items-center gap-1 py-1.5 rounded-xl justify-center"
          style={{ background: "rgba(46,204,113,0.1)", border: "1px solid rgba(46,204,113,0.25)" }}>
          <Check className="w-3 h-3 text-green-400" />
          <span className="text-[9px] font-black text-green-400">
            {item.behavior === "avatar" ? "EQUIPPED" : "OWNED"}
          </span>
        </div>
      );
    } else {
      bottomSlot = (
        <div className="flex items-center gap-1 py-1.5 rounded-xl justify-center"
          style={{
            background: canAfford ? `${rarityMeta.color}18` : "hsl(var(--muted))",
            border: `1px solid ${canAfford ? `${rarityMeta.color}44` : "hsl(var(--border))"}`,
          }}>
          <Gem className="w-3 h-3" style={{ color: canAfford ? rarityMeta.color : "hsl(var(--muted-foreground))" }} />
          <span className="text-[10px] font-black" style={{ color: canAfford ? rarityMeta.color : "hsl(var(--muted-foreground))" }}>
            {item.price}
          </span>
        </div>
      );
    }
  }

  // Cards are clickable to buy unless already owned (avatar/passive) or active (toggle)
  const isLocked = (item.behavior === "avatar" || item.behavior === "passive") && owned;
  const isActiveToggle = item.behavior === "toggle" && isToggleActive;
  const clickable = !isLocked && !isActiveToggle && !hasInInventory && item.behavior !== "consumable_stack";

  return (
    <motion.div
      whileHover={{ scale: 1.03, rotateY: 4, rotateX: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative flex flex-col gap-2 p-3 rounded-2xl overflow-hidden"
      style={{
        background: (owned || isToggleActive)
          ? "rgba(46,204,113,0.07)"
          : `linear-gradient(135deg, ${rarityMeta.color}10, hsl(var(--card)))`,
        border: `1px solid ${(owned || isToggleActive) ? "rgba(46,204,113,0.3)" : `${rarityMeta.color}30`}`,
        transformStyle: "preserve-3d",
        perspective: 800,
        cursor: clickable ? "pointer" : "default",
      }}
      onClick={() => clickable && onBuy()}
    >
      {/* Rarity top strip */}
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
        style={{ background: `linear-gradient(90deg, transparent, ${rarityMeta.color}, transparent)` }} />

      {/* Rarity badge + prestige */}
      <div className="flex items-center justify-between">
        <span className="text-[8px] font-black px-1.5 py-0.5 rounded"
          style={{ background: `${rarityMeta.color}18`, color: rarityMeta.color, border: `1px solid ${rarityMeta.color}33` }}>
          {rarityMeta.label}
        </span>
        <div className="flex items-center gap-1">
          {hasInInventory && (
            <span className="text-[8px] font-black px-1.5 py-0.5 rounded"
              style={{ background: "rgba(46,204,113,0.15)", color: "#2ECC71", border: "1px solid rgba(46,204,113,0.3)" }}>
              ×{count}
            </span>
          )}
          {item.prestige > 0 && (
            <span className="text-[8px] font-bold text-yellow-600 flex items-center gap-0.5">
              <TrendingUp className="w-2.5 h-2.5" />+{item.prestige}
            </span>
          )}
        </div>
      </div>

      {/* Emoji */}
      <motion.span
        className="text-3xl"
        whileHover={{ filter: `drop-shadow(0 0 10px ${rarityMeta.color})`, scale: 1.15 }}
        transition={{ duration: 0.2 }}
        style={{ display: "block" }}
      >
        {item.emoji}
      </motion.span>

      <h3 className="font-black text-[11px] text-foreground leading-tight">{item.title}</h3>
      <p className="text-[9px] leading-snug flex-1 text-muted-foreground">{item.desc}</p>

      {bottomSlot}
    </motion.div>
  );
}