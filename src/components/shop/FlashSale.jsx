import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Zap } from "lucide-react";
import { Gem, Check } from "lucide-react";

// Seeded daily flash items — rotates every 24h based on day-of-year
const FLASH_POOL = [
  { id: "flash-surge",    emoji: "⚡", title: "Turbo XP Surge",      desc: "3x XP for 10 minutes. Flash volatility, maximum return.",  price: 30,  rarity: "elite",     type: "consumable" },
  { id: "flash-shield",   emoji: "🔒", title: "Iron Streak Shield",   desc: "48-hour streak protection. Because weekends happen.",        price: 25,  rarity: "executive", type: "consumable" },
  { id: "flash-chrome",   emoji: "🪞", title: "Chrome Skin Drop",     desc: "Limited chrome finish for your avatar. Today only.",         price: 55,  rarity: "elite",     type: "owned", avatarKey: "outfit", avatarVal: "chrome" },
  { id: "flash-drone",    emoji: "🚁", title: "Recon Drone (Sale)",    desc: "AI companion unit. 40% off MSRP. No idea why.",              price: 90,  rarity: "elite",     type: "owned", avatarKey: "accessory", avatarVal: "drone" },
  { id: "flash-gold-eye", emoji: "🌟", title: "Gold Optics",          desc: "Wealth-vision enabled. All assets glow yellow.",            price: 20,  rarity: "executive", type: "owned", avatarKey: "eyes", avatarVal: "gold" },
  { id: "flash-mech",     emoji: "🦾", title: "Mech Arm (Flash)",     desc: "Bionic augment, limited drop. Flex on the leaderboard.",    price: 100, rarity: "legendary", type: "owned", avatarKey: "accessory", avatarVal: "mech-arm" },
];

const RARITY_COLOR = {
  standard:  "#2ECC71",
  executive: "#3B82F6",
  elite:     "#C084FC",
  legendary: "#F1C40F",
};

function getMsUntilNextDay() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setHours(24, 0, 0, 0);
  return tomorrow - now;
}

function fmt(ms) {
  if (ms <= 0) return "00:00:00";
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return [h, m, s].map(v => String(v).padStart(2, "0")).join(":");
}

function getDailyFlashItems() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const idx = dayOfYear % FLASH_POOL.length;
  // Return 2 rotating items
  return [FLASH_POOL[idx], FLASH_POOL[(idx + 1) % FLASH_POOL.length]];
}

export default function FlashSale({ onBuy, ownedItems, gems }) {
  const [timeLeft, setTimeLeft] = useState(getMsUntilNextDay());
  const flashItems = getDailyFlashItems();

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getMsUntilNextDay()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mb-4 rounded-2xl overflow-hidden"
      style={{ background: "rgba(231,76,60,0.06)", border: "1.5px solid rgba(231,76,60,0.25)" }}>

      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2"
        style={{ background: "rgba(231,76,60,0.12)", borderBottom: "1px solid rgba(231,76,60,0.2)" }}>
        <div className="flex items-center gap-1.5">
          <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
            <Zap className="w-3.5 h-3.5 text-red-400" />
          </motion.div>
          <span className="text-xs font-black text-red-400 uppercase tracking-widest">Flash Drop</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded font-bold" style={{ background: "rgba(231,76,60,0.2)", color: "#ff6b6b" }}>24H ONLY</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-muted-foreground" />
          <span className="text-[11px] font-black font-mono text-muted-foreground">{fmt(timeLeft)}</span>
        </div>
      </div>

      {/* Flash items */}
      <div className="flex gap-2 p-3">
        {flashItems.map(item => {
          const owned = item.type === "owned" && ownedItems.includes(item.id);
          const canAfford = gems >= item.price;
          const color = RARITY_COLOR[item.rarity] || "#00F2FF";
          return (
            <motion.div key={item.id}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => !owned && onBuy(item)}
              className="flex-1 rounded-xl p-2.5 flex flex-col gap-1.5 cursor-pointer relative overflow-hidden"
              style={{
                background: `${color}0A`,
                border: `1px solid ${color}33`,
              }}>
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${color}80, transparent)` }} />
              <div className="flex items-center justify-between">
                <span className="text-2xl">{item.emoji}</span>
                <span className="text-[8px] font-black px-1 py-0.5 rounded"
                  style={{ background: `${color}18`, color }}>
                  {item.rarity.toUpperCase()}
                </span>
              </div>
              <p className="text-[10px] font-black text-foreground leading-tight">{item.title}</p>
              <p className="text-[8px] leading-tight text-muted-foreground">{item.desc}</p>
              {owned ? (
                <div className="flex items-center gap-1 justify-center py-1 rounded-lg"
                  style={{ background: "rgba(46,204,113,0.1)" }}>
                  <Check className="w-3 h-3 text-green-400" />
                  <span className="text-[9px] font-black text-green-400">OWNED</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 justify-center py-1 rounded-lg"
                  style={{ background: canAfford ? `${color}18` : "hsl(var(--muted))", border: `1px solid ${canAfford ? `${color}44` : "hsl(var(--border))"}` }}>
                  <Gem className="w-2.5 h-2.5" style={{ color: canAfford ? color : "hsl(var(--muted-foreground))" }} />
                  <span className="text-[10px] font-black" style={{ color: canAfford ? color : "hsl(var(--muted-foreground))" }}>{item.price}</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}