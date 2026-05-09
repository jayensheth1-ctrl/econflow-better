import { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Gem, Check, Share2, Zap, Brain, TrendingUp, Award } from "lucide-react";
import { toast } from "sonner";
import { updateProgress } from "../lib/progressUtils";
import EconBuddy from "../components/EconBuddy";
import MascotStats from "../components/mascot/MascotStats";
import HexSlot from "../components/mascot/HexSlot";
import ShareCard from "../components/mascot/ShareCard";
import ScanOverlay from "../components/mascot/ScanOverlay";
import AvatarItemStore from "../components/mascot/AvatarItemStore";
import { playChaChig, playClick } from "../lib/sounds";

const CATEGORIES = [
  {
    key: "streetwear",
    label: "Streetwear",
    icon: "🧥",
    color: "#00F2FF",
    sections: ["outfit"],
  },
  {
    key: "executive",
    label: "Executive Gear",
    icon: "💼",
    color: "#F1C40F",
    sections: ["helmet"],
  },
  {
    key: "tech",
    label: "Tech Augments",
    icon: "⚡",
    color: "#C084FC",
    sections: ["eyes", "accessory"],
  },
];

const ITEMS = {
  outfit: [
    { id: "midnight",  label: "Midnight Hoodie",    price: 0,  emoji: "🌑", desc: "Streetwear classic", material: "matte" },
    { id: "stealth",   label: "Carbon Vest",         price: 0,  emoji: "🩶", desc: "Carbon fiber weave", material: "carbon" },
    { id: "chrome",    label: "Chrome Shell",        price: 4,  emoji: "🪞", desc: "Iridescent chrome",  material: "chrome" },
    { id: "camo",      label: "Digital Camo",        price: 5,  emoji: "🫥", desc: "Tactical pattern",   material: "camo" },
    { id: "obsidian",  label: "Obsidian Armor",      price: 8,  emoji: "🖤", desc: "Matte black finish",  material: "carbon" },
    { id: "gold-leaf", label: "Gold Leaf Suit",      price: 12, emoji: "✨", desc: "Gold leaf finish",    material: "gold" },
  ],
  helmet: [
    { id: "basic",     label: "Base Unit",           price: 0,  emoji: "🤖", desc: "Stock gear" },
    { id: "visor",     label: "Neon Visor",          price: 0,  emoji: "😎", desc: "Cyberpunk HUD" },
    { id: "ceo",       label: "Executive Cap",       price: 3,  emoji: "🧢", desc: "CEO energy" },
    { id: "astronaut", label: "Cosmo Helm",          price: 5,  emoji: "👨🚀", desc: "Space-grade shield" },
    { id: "crown-gold",label: "Mogul Crown",         price: 0,  emoji: "👑", desc: "Royal prestige" },
    { id: "mech-helm", label: "Mech Skull",          price: 10, emoji: "💀", desc: "Full mech face" },
  ],
  eyes: [
    { id: "cyan",      label: "Cyan Laser",          price: 0,  emoji: "🔵", desc: "Default glow" },
    { id: "teal",      label: "Teal Matrix",         price: 0,  emoji: "🟢", desc: "Calm pulse" },
    { id: "gold",      label: "Gold Scan",           price: 2,  emoji: "🌟", desc: "Wealth vision" },
    { id: "red",       label: "Threat Mode",         price: 2,  emoji: "🔴", desc: "Danger sensor" },
    { id: "purple",    label: "Void Eye",            price: 6,  emoji: "🔮", desc: "Purple haze" },
    { id: "white",     label: "Ghost Mode",          price: 8,  emoji: "🌫️", desc: "Pure white iris" },
  ],
  accessory: [
    { id: "none",         label: "None",             price: 0,  emoji: "—",  desc: "Clean look" },
    { id: "watch",        label: "Smartwatch",       price: 2,  emoji: "⌚", desc: "Time is money" },
    { id: "gauntlet",     label: "Holo Gauntlet",    price: 3,  emoji: "🧤", desc: "Tech power" },
    { id: "diamond-hand", label: "Diamond Hand",     price: 5,  emoji: "💎", desc: "HODL forever" },
    { id: "drone",        label: "Hover Drone",      price: 10, emoji: "🚁", desc: "AI companion" },
    { id: "mech-arm",     label: "Mech Arm",         price: 12, emoji: "🦾", desc: "Bionic upgrade" },
  ],
};

export default function MascotStudio() {
  const { progress, setProgress } = useOutletContext();
  const navigate = useNavigate();
  const avatarConfig = progress.avatar_config || {};
  const ownedItems = progress.owned_items || [];

  const [preview, setPreview] = useState(avatarConfig);
  const [activeCategory, setActiveCategory] = useState("streetwear");
  const [scanning, setScanning] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [mascotAction, setMascotAction] = useState("float"); // float | check | visor | ticker

  function isOwned(item) {
    return item.price === 0 || ownedItems.includes(`avatar_${item.id}`);
  }

  function triggerScan() {
    setScanning(true);
    setTimeout(() => setScanning(false), 900);
  }

  function handleMascotClick() {
    const actions = ["check", "visor", "ticker"];
    const next = actions[Math.floor(Math.random() * actions.length)];
    setMascotAction(next);
    setTimeout(() => setMascotAction("float"), 2000);
  }

  function handleSelect(sectionKey, item) {
    playClick();
    triggerScan();
    const isActive = preview[sectionKey] === item.id;
    if (isActive && sectionKey === "accessory") {
      setPreview(p => ({ ...p, [sectionKey]: "none" }));
    } else {
      setPreview(p => ({ ...p, [sectionKey]: item.id }));
    }
  }

  async function handleBuy(sectionKey, item) {
    if (progress.gems < item.price) {
      toast.error("Not enough Gems! 💎");
      return;
    }
    playChaChig();
    triggerScan();
    const newOwned = [...ownedItems, `avatar_${item.id}`];
    const newConfig = { ...avatarConfig, [sectionKey]: item.id };
    const update = { gems: progress.gems - item.price, owned_items: newOwned, avatar_config: newConfig };
    setProgress(await updateProgress(progress, update));
    setPreview(newConfig);
    toast.success("Installed! 🔧");
  }

  async function handleEquip(sectionKey, item) {
    playClick();
    triggerScan();
    const currentEquipped = (progress.avatar_config || {})[sectionKey];
    const newVal = sectionKey === "accessory" && currentEquipped === item.id ? "none" : item.id;
    const newConfig = { ...(progress.avatar_config || {}), [sectionKey]: newVal };
    setProgress(await updateProgress(progress, { avatar_config: newConfig }));
    setPreview(newConfig);
    toast.success(newVal === "none" ? "Unequipped" : "Equipped ✅");
  }

  const activeSections = CATEGORIES.find(c => c.key === activeCategory)?.sections || [];
  const activeCategoryColor = CATEGORIES.find(c => c.key === activeCategory)?.color || "#00F2FF";

  // Compute stats (live from real data)
  const completedCount = (progress.completed_lessons || []).length;
  const iq  = Math.min(100, completedCount * 10);           // IQ  = lessons × 10
  const wlt = Math.min(100, Math.floor((progress.gems || 0) / 2)); // WLT = gems ÷ 2
  const inf = Math.min(100, Math.floor((progress.xp || 0) / 5));   // INF = xp ÷ 5
  const level = Math.floor((progress.xp || 0) / 100) + 1;

  return (
    <div className="min-h-screen relative overflow-hidden pb-24 bg-background">

      {/* Cyber vault grid bg */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        {/* Grid lines */}
        <svg width="100%" height="100%" className="absolute inset-0 opacity-[0.04]">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00F2FF" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        {/* Neon scan lines */}
        {[0, 1, 2, 3].map(i => (
          <motion.div key={i}
            className="absolute w-full h-px"
            style={{ top: `${20 + i * 22}%`, background: `linear-gradient(90deg, transparent, rgba(0,242,255,0.06), transparent)` }}
            animate={{ opacity: [0, 0.6, 0], x: ["-10%", "10%", "-10%"] }}
            transition={{ duration: 6 + i * 1.5, repeat: Infinity, delay: i * 1.2 }}
          />
        ))}
        {/* Corner accent */}
        <div className="absolute top-0 left-0 w-32 h-32 opacity-20"
          style={{ background: "radial-gradient(circle at top left, rgba(0,242,255,0.3), transparent 70%)" }} />
        <div className="absolute top-0 right-0 w-32 h-32 opacity-20"
          style={{ background: "radial-gradient(circle at top right, rgba(192,132,252,0.3), transparent 70%)" }} />
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-4 pt-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-black tracking-tight"
              style={{ color: "#00F2FF", textShadow: "0 0 16px #00F2FF55", letterSpacing: "-0.02em" }}>
              CYBER VAULT
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Avatar Assembly Interface</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
              style={{ background: "rgba(0,242,255,0.08)", border: "1px solid rgba(0,242,255,0.2)" }}>
              <Gem className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-sm font-black text-cyan-400">{progress.gems}</span>
            </div>
            <button onClick={() => setShowShare(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs"
              style={{ background: "rgba(192,132,252,0.12)", border: "1px solid rgba(192,132,252,0.3)", color: "#C084FC" }}>
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>
          </div>
        </div>

        {/* Main layout: Avatar + Stats side by side */}
        <div className="flex gap-3 mb-5">

          {/* Avatar stage */}
          <div className="flex-1 flex flex-col items-center justify-center rounded-2xl relative overflow-hidden bg-card"
            style={{
              border: "1px solid rgba(0,242,255,0.15)",
              minHeight: 220,
            }}>

            {/* Glass lab reflections */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute bottom-0 left-0 right-0 h-1/3"
                style={{ background: "linear-gradient(0deg, rgba(0,242,255,0.04), transparent)" }} />
              <div className="absolute top-2 left-4 right-4 h-px opacity-20"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)" }} />
            </div>

            {/* Holographic floor ring */}
            <motion.div
              className="absolute bottom-6 w-24 h-6 rounded-full"
              animate={{ opacity: [0.3, 0.6, 0.3], scaleX: [1, 1.08, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ background: "radial-gradient(ellipse, rgba(0,242,255,0.25) 0%, transparent 70%)" }}
            />

            {/* Mascot */}
            <motion.div
              className="relative cursor-pointer"
              onClick={handleMascotClick}
              animate={
                mascotAction === "check" ? { rotate: [-5, 5, -3, 0], y: [0, -8, 0] } :
                mascotAction === "visor" ? { scaleX: [1, 1.05, 1], scaleY: [1, 0.95, 1] } :
                mascotAction === "ticker" ? { x: [-4, 4, -2, 0] } :
                { y: [0, -10, 0] }
              }
              transition={{ duration: mascotAction === "float" ? 3 : 0.6, repeat: mascotAction === "float" ? Infinity : 0, ease: "easeInOut" }}
              style={{ filter: "drop-shadow(0 0 24px rgba(0,242,255,0.35))" }}
            >
              <EconBuddy config={preview} size={160} />
              {/* Drone companion */}
              {preview.accessory === "drone" && (
                <motion.div
                  className="absolute text-xl pointer-events-none"
                  style={{ top: -16, right: -24 }}
                  animate={{ y: [-6, 6, -6], rotate: [-8, 8, -8] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  🚁
                </motion.div>
              )}
              {/* Action speech bubble */}
              <AnimatePresence>
                {mascotAction !== "float" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7, y: 6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1.5 rounded-xl text-[10px] font-bold whitespace-nowrap"
                    style={{ background: "rgba(0,242,255,0.15)", border: "1px solid rgba(0,242,255,0.35)", color: "#00F2FF" }}>
                    {mascotAction === "check" ? "📋 Checking report..." :
                     mascotAction === "visor" ? "🔍 Scanning market..." :
                     "📈 BTC up 3.2%!"}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Scan overlay */}
            <ScanOverlay active={scanning} />

            <p className="text-[9px] font-bold mt-3 mb-1" style={{ color: "rgba(0,242,255,0.4)" }}>
              TAP TO INTERACT
            </p>
          </div>

          {/* Stats panel */}
          <MascotStats iq={iq} wlt={wlt} inf={inf} level={level} completedCount={completedCount} gems={progress.gems} xp={progress.xp} />
        </div>

        {/* Category tabs */}
        <div className="flex gap-1.5 mb-4">
          {CATEGORIES.map(cat => (
            <button key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className="flex-1 py-2 rounded-xl text-[11px] font-black flex flex-col items-center gap-0.5 transition-all"
              style={{
                background: activeCategory === cat.key ? `${cat.color}18` : "hsl(var(--muted))",
                border: `1.5px solid ${activeCategory === cat.key ? cat.color : "hsl(var(--border))"}`,
                color: activeCategory === cat.key ? cat.color : "hsl(var(--muted-foreground))",
                boxShadow: activeCategory === cat.key ? `0 0 14px ${cat.color}30` : "none",
              }}>
              <span className="text-base">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Item sections for active category */}
        {activeSections.map(sectionKey => (
          <div key={sectionKey} className="mb-5">
            <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] mb-3"
              style={{ color: `${activeCategoryColor}80` }}>
              {sectionKey === "outfit" ? "BODY / MATERIAL" :
               sectionKey === "helmet" ? "HEAD / GEAR" :
               sectionKey === "eyes" ? "OPTICS / VISION" : "AUGMENTS"}
            </p>
            {/* Hex grid */}
            <div className="flex flex-wrap gap-2 justify-start">
              {ITEMS[sectionKey]?.map(item => {
                const owned = isOwned(item);
                const equipped = (progress.avatar_config || {})[sectionKey] === item.id;
                const previewing = preview[sectionKey] === item.id;
                const canAfford = progress.gems >= item.price;
                return (
                  <HexSlot
                    key={item.id}
                    item={item}
                    owned={owned}
                    equipped={equipped}
                    previewing={previewing}
                    canAfford={canAfford}
                    accentColor={activeCategoryColor}
                    onSelect={() => handleSelect(sectionKey, item)}
                    onBuy={() => handleBuy(sectionKey, item)}
                    onEquip={() => handleEquip(sectionKey, item)}
                  />
                );
              })}
            </div>
          </div>
        ))}
        {/* Avatar Item Store */}
        <AvatarItemStore
          progress={progress}
          onBuy={async (item) => {
            if (progress.gems < item.price) { toast.error("Not enough 💎"); return; }
            playChaChig();
            const newOwned = [...(progress.owned_items || []), item.id];
            const newConfig = { ...(progress.avatar_config || {}), [item.avatarKey]: item.avatarVal };
            setProgress(await updateProgress(progress, { gems: progress.gems - item.price, owned_items: newOwned, avatar_config: newConfig }));
            setPreview(newConfig);
            toast.success("Installed! 🔧");
          }}
          onEquip={async (item, unequip) => {
            playClick();
            triggerScan();
            const current = progress.avatar_config || {};
            const newConfig = { ...current, [item.avatarKey]: unequip ? "none" : item.avatarVal };
            setProgress(await updateProgress(progress, { avatar_config: newConfig }));
            setPreview(newConfig);
            toast.success(unequip ? "Unequipped" : "Equipped ✅");
          }}
        />
      </div>

      {/* Share card modal */}
      <AnimatePresence>
        {showShare && (
          <ShareCard
            preview={preview}
            level={level}
            xp={progress.xp}
            gems={progress.gems}
            iq={iq}
            wlt={wlt}
            onClose={() => setShowShare(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}