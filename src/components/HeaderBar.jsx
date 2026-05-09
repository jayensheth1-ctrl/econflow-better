import { useState, useEffect } from "react";
import { Flame, Gem, Volume2, VolumeX, Sun, Moon } from "lucide-react";
import { isReadAloudEnabled, setReadAloud } from "../lib/readAloudStore";
import { getTheme, setTheme } from "../lib/themeStore";

function fmtCountdown(ms) {
  if (ms <= 0) return null;
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${m}:${String(s).padStart(2, '0')}`;
}
import { motion } from "framer-motion";
import EconBuddy from "./EconBuddy";
import { Link } from "react-router-dom";

export default function HeaderBar({ streak, hearts, gems, xp, avatarConfig = {}, goldThemeUntil, streakFreezeExpiry, xpBoostUntil, xpMagnetUntil }) {
  const xpInLevel = (xp || 0) % 100;
  const [goldCountdown, setGoldCountdown] = useState(null);
  const [streakFreezeCountdown, setStreakFreezeCountdown] = useState(null);
  const [xpBoostCountdown, setXpBoostCountdown] = useState(null);
  const [readAloud, setReadAloudState] = useState(() => isReadAloudEnabled());
  const [theme, setThemeState] = useState(() => getTheme());

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    setThemeState(next);
  }

  function toggleReadAloud() {
    const next = !readAloud;
    setReadAloud(next);
    setReadAloudState(next);
  }

  useEffect(() => {
    if (!goldThemeUntil) { setGoldCountdown(null); return; }
    const tick = () => {
      const ms = new Date(goldThemeUntil).getTime() - Date.now();
      setGoldCountdown(ms > 0 ? fmtCountdown(ms) : null);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [goldThemeUntil]);

  return (
    <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-md border-b border-border px-4 py-2 shadow-sm"
      style={goldCountdown ? { background: "rgba(0,0,0,0.92)", borderColor: "rgba(212,175,55,0.4)", boxShadow: "0 2px 20px rgba(212,175,55,0.2)" } : {}}>
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Link to="/mascot">
              <div style={{ width: 32, height: 42, overflow: "hidden" }}>
                <EconBuddy config={avatarConfig} size={32} />
              </div>
            </Link>
            <h1 className="text-lg font-extrabold tracking-tight">
              <span className="text-primary">Econ</span>
              <span className="text-foreground">Flow</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-bold text-foreground">{streak}</span>
            </div>
            {/* Battery segments — always full in header (per-lesson only) */}
            <div className="flex items-center gap-0.5 px-1.5 py-1 rounded-md"
              style={{ background: "rgba(0,0,0,0.25)", border: "1.5px solid rgba(255,255,255,0.15)" }}>
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-sm" style={{ width: 8, height: 14, background: "#22c55e" }} />
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <Gem className="w-5 h-5" style={{ color: (gems || 0) < 0 ? "#ef4444" : "#3b82f6" }} />
              <span className="text-sm font-bold" style={{ color: (gems || 0) < 0 ? "#ef4444" : "hsl(var(--foreground))" }}>{gems}</span>
            </div>
            {/* Read Aloud toggle */}
            <button
              onClick={toggleReadAloud}
              aria-label={readAloud ? "Disable read aloud" : "Enable read aloud"}
              className="flex items-center justify-center w-8 h-8 rounded-full transition-colors"
              style={{
                background: readAloud ? "rgba(46,204,113,0.15)" : "rgba(0,0,0,0.06)",
                border: readAloud ? "1.5px solid hsl(var(--primary))" : "1.5px solid transparent",
              }}
            >
              {readAloud
                ? <Volume2 className="w-4 h-4 text-primary" />
                : <VolumeX className="w-4 h-4 text-muted-foreground" />
              }
            </button>
            {/* Dark / Light toggle */}
            <button
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="flex items-center justify-center w-8 h-8 rounded-full transition-colors"
              style={{
                background: theme === "light" ? "rgba(241,196,15,0.15)" : "rgba(0,0,0,0.06)",
                border: theme === "light" ? "1.5px solid #F1C40F" : "1.5px solid transparent",
              }}
            >
              {theme === "light"
                ? <Sun className="w-4 h-4 text-yellow-400" />
                : <Moon className="w-4 h-4 text-muted-foreground" />
              }
            </button>
              {goldCountdown && (
              <motion.div animate={{ opacity: [0.8, 1, 0.8] }} transition={{ duration: 1.5, repeat: Infinity }}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-extrabold"
                style={{ background: "rgba(212,175,55,0.15)", border: "1px solid #D4AF37", color: "#F9F295" }}>
                👑 {goldCountdown}
              </motion.div>
              )}
              </div>
              </div>

        {/* XP bar */}
        <div className="relative h-4 bg-muted rounded-full overflow-visible shadow-inner border border-border">
          <motion.div
            className="h-full rounded-full relative"
            initial={{ width: "0%" }}
            animate={{ width: `${xpInLevel}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              background: "linear-gradient(90deg, #2ECC71, #F1C40F)",
              boxShadow: xpInLevel > 10 ? "0 0 10px rgba(241,196,15,0.6), 0 0 4px rgba(46,204,113,0.5)" : "none",
            }}
          >
            {xpInLevel > 5 && (
              <motion.div
                className="absolute inset-0 rounded-full bg-white/30"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </motion.div>
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-extrabold text-muted-foreground">
            {xpInLevel}/100
          </span>
        </div>
      </div>
    </header>
  );
}