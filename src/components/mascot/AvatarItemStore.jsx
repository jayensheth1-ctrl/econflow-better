import { motion } from "framer-motion";
import { Gem, Check } from "lucide-react";
import { AVATAR_ITEMS, RARITY_META } from "../../lib/shopItems";

export default function AvatarItemStore({ progress, onBuy, onEquip }) {
  const ownedItems = progress.owned_items || [];
  const avatarConfig = progress.avatar_config || {};
  const gems = progress.gems || 0;

  function isOwned(item) {
    return ownedItems.includes(item.id);
  }

  function isEquipped(item) {
    return avatarConfig[item.avatarKey] === item.avatarVal;
  }

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-px flex-1 bg-border" />
        <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground px-2">⚙️ EQUIP STORE</p>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="flex flex-col gap-2.5">
        {AVATAR_ITEMS.map(item => {
          const owned = isOwned(item);
          const equipped = isEquipped(item);
          const canAfford = gems >= item.price;
          const meta = RARITY_META[item.rarity];

          return (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.01 }}
              className="rounded-xl p-3 flex items-center gap-3 relative overflow-hidden"
              style={{ background: `${meta.color}08`, border: `1.5px solid ${equipped ? meta.color : meta.color + "33"}` }}
            >
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${meta.color}44, transparent)` }} />

              <span className="text-2xl flex-shrink-0">{item.emoji}</span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                  <span className="text-sm font-black text-foreground">{item.title}</span>
                  <span className="text-[8px] font-black px-1.5 py-0.5 rounded"
                    style={{ background: `${meta.color}18`, color: meta.color }}>
                    {meta.label}
                  </span>
                  {equipped && (
                    <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-primary/15 text-primary flex items-center gap-0.5">
                      <Check className="w-2.5 h-2.5" /> EQUIPPED
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground">{item.desc}</p>
              </div>

              <div className="flex-shrink-0 flex flex-col gap-1 items-end">
                {!owned ? (
                  <button
                    onClick={() => canAfford && onBuy(item)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold"
                    style={{
                      background: canAfford ? `${meta.color}18` : "hsl(var(--muted))",
                      color: canAfford ? meta.color : "hsl(var(--muted-foreground))",
                      border: `1px solid ${canAfford ? meta.color + "44" : "hsl(var(--border))"}`,
                      opacity: canAfford ? 1 : 0.6,
                    }}>
                    <Gem className="w-3 h-3" /> {item.price}
                  </button>
                ) : equipped ? (
                  <button
                    onClick={() => onEquip(item, true)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-muted-foreground bg-muted border border-border">
                    Unequip
                  </button>
                ) : (
                  <button
                    onClick={() => onEquip(item, false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold"
                    style={{ background: `${meta.color}18`, color: meta.color, border: `1px solid ${meta.color}44` }}>
                    Equip
                  </button>
                )}
                {!owned && !canAfford && (
                  <span className="text-[9px] text-red-400 font-bold">
                    Need {item.price - gems} more 💎
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}