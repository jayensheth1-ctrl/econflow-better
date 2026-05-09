const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { Outlet } from "react-router-dom";
import { useRef } from "react";
import { isGuestMode, getGuestProgress, saveGuestProgress, initGuest, clearGuest } from "../lib/guestProgress";
import { setActiveTheme } from "../lib/themeManager";
import GuestBanner from "./GuestBanner";
import HeaderBar from "./HeaderBar";
import BottomNav from "./BottomNav";
import LevelUpOverlay from "./LevelUpOverlay";
import XpChestOverlay from "./XpChestOverlay";
import FloatingGemPopup from "./FloatingGemPopup";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

import { PENDING_FORFEIT_KEY } from "../lib/botBattle";
import { toast } from "sonner";

export default function Layout({ isGuest = false }) {
  const guestMode = isGuest || isGuestMode();
  const [progress, setProgress] = useState(null);
  const [levelUpShow, setLevelUpShow] = useState(false);
  const [levelUpNum, setLevelUpNum] = useState(1);
  const [xpChestShow, setXpChestShow] = useState(false);
  const [floatingGems, setFloatingGems] = useState([]);
  const lastXpMilestoneRef = useRef(0);
  const [stocks, setStocks] = useState(() => ({
    STABL: Array.from({ length: 30 }, (_, i) => ({ t: i, price: 100 + (Math.random()-0.5)*4 })),
    GLOW:  Array.from({ length: 30 }, (_, i) => ({ t: i, price: 100 + (Math.random()-0.5)*10 })),
    CRPT:  Array.from({ length: 30 }, (_, i) => ({ t: i, price: 100 + (Math.random()-0.5)*22 })),
  }));
  const stockTickRef = useRef(30);

  // Global stock engine — runs even when on other pages
  useEffect(() => {
    const VOLS = { STABL: 1.2, GLOW: 3.5, CRPT: 8 };
    const id = setInterval(() => {
      const t = stockTickRef.current++;
      setStocks(prev => {
        const next = {};
        for (const key of Object.keys(prev)) {
          const h = prev[key];
          const last = h[h.length - 1].price;
          const change = (Math.random() - 0.48) * VOLS[key];
          next[key] = [...h.slice(-59), { t, price: Math.max(5, +(last + change).toFixed(2)) }];
        }
        return next;
      });
    }, 2000);
    return () => clearInterval(id);
  }, []);

  function spawnFloatingGem(amount, label) {
    const id = Date.now() + Math.random();
    setFloatingGems(g => [...g, { id, amount, label }]);
    setTimeout(() => setFloatingGems(g => g.filter(x => x.id !== id)), 2000);
  }

  function setProgressWithLevelCheck(newProgress, gemPopups) {
    // Guest: persist to localStorage instead of DB
    if (guestMode) {
      saveGuestProgress(newProgress);
      setProgress(newProgress);
      if (gemPopups) gemPopups.forEach(p => spawnFloatingGem(p.amount, p.label));
      return;
    }
    if (progress) {
      const oldLevel = Math.floor((progress.xp || 0) / 100) + 1;
      const newLevel = Math.floor((newProgress.xp || 0) / 100) + 1;
      if (newLevel > oldLevel) {
        setLevelUpNum(newLevel);
        setLevelUpShow(true);
      }
      const oldMilestone = Math.floor((progress.xp || 0) / 100);
      const newMilestone = Math.floor((newProgress.xp || 0) / 100);
      if (newMilestone > oldMilestone && newMilestone > lastXpMilestoneRef.current) {
        lastXpMilestoneRef.current = newMilestone;
        const withChest = { ...newProgress, gems: (newProgress.gems || 0) + 50 };
        db.entities.UserProgress.update(newProgress.id, { gems: withChest.gems });
        setProgress(withChest);
        setXpChestShow(true);
        if (gemPopups) gemPopups.forEach(p => spawnFloatingGem(p.amount, p.label));
        return;
      }
    }
    setProgress(newProgress);
    if (gemPopups) gemPopups.forEach(p => spawnFloatingGem(p.amount, p.label));
  }

  // Gold theme countdown check
  useEffect(() => {
    if (!progress?.gold_theme_until) return;
    const check = () => {
      if (new Date(progress.gold_theme_until) <= new Date()) {
        setProgress({ ...progress, gold_theme_until: null });
      }
    };
    check();
    const id = setInterval(check, 10000);
    return () => clearInterval(id);
  }, [progress?.gold_theme_until]);

  // Apply theme when owned
  useEffect(() => {
    if (!progress) return;
    const owned = progress.owned_items || [];
    const goldActive = progress.gold_theme_until && new Date(progress.gold_theme_until) > new Date();
    const root = document.documentElement;
    if (owned.includes('part2-unlocked') || owned.includes('part2-portal')) {
      root.style.setProperty('--primary', '271 76% 63%');
      root.style.setProperty('--primary-foreground', '0 0% 100%');
      root.style.setProperty('--background', '268 40% 6%');
      root.style.setProperty('--foreground', '0 0% 97%');
      root.style.setProperty('--card', '268 30% 10%');
      root.style.setProperty('--card-foreground', '0 0% 97%');
      root.style.setProperty('--secondary', '271 40% 20%');
      root.style.setProperty('--secondary-foreground', '0 0% 97%');
      root.style.setProperty('--muted', '268 25% 14%');
      root.style.setProperty('--muted-foreground', '270 20% 72%');
      root.style.setProperty('--accent', '45 88% 56%');
      root.style.setProperty('--accent-foreground', '0 0% 0%');
      root.style.setProperty('--border', '271 30% 22%');
      root.style.setProperty('--input', '271 30% 22%');
      root.style.setProperty('--ring', '271 76% 70%');
    } else if (goldActive) {
      root.style.setProperty('--primary', '45 95% 55%');
      root.style.setProperty('--primary-foreground', '0 0% 5%');
      root.style.setProperty('--background', '0 0% 3%');
      root.style.setProperty('--foreground', '0 0% 97%');
      root.style.setProperty('--card', '0 0% 8%');
      root.style.setProperty('--card-foreground', '0 0% 97%');
      root.style.setProperty('--secondary', '45 30% 15%');
      root.style.setProperty('--secondary-foreground', '0 0% 97%');
      root.style.setProperty('--muted', '0 0% 12%');
      root.style.setProperty('--muted-foreground', '45 15% 65%');
      root.style.setProperty('--accent', '38 95% 50%');
      root.style.setProperty('--accent-foreground', '0 0% 5%');
      root.style.setProperty('--border', '45 25% 20%');
      root.style.setProperty('--input', '45 25% 20%');
      root.style.setProperty('--ring', '45 95% 65%');
    } else {
      // Remove any inline overrides — CSS variables from index.css take over
      ['--primary','--primary-foreground','--background','--foreground','--card','--card-foreground',
       '--secondary','--secondary-foreground','--muted','--muted-foreground',
       '--accent','--accent-foreground','--border','--input','--ring'].forEach(v => root.style.removeProperty(v));
    }
  }, [progress?.owned_items, progress?.gold_theme_until]);

  useEffect(() => {
    loadProgress();
  }, [guestMode]);

  // Returns today's date in local timezone as YYYY-MM-DD
  function getLocalToday() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  // Computes new streak given current streak + last active date + freeze state
  function computeStreak(currentStreak, lastActiveDate, streakFreezeExpiry) {
    const today = getLocalToday();
    if (!lastActiveDate) return { streak: 1, last_active_date: today, changed: true, clearFreeze: false };
    if (lastActiveDate === today) return { streak: Math.max(1, currentStreak), last_active_date: today, changed: false, clearFreeze: false };

    const last = new Date(lastActiveDate + "T00:00:00");
    const todayDate = new Date(today + "T00:00:00");
    const diffDays = Math.round((todayDate - last) / 86400000);

    if (diffDays === 1) {
      return { streak: Math.min((currentStreak || 0) + 1, 999), last_active_date: today, changed: true, clearFreeze: false };
    }
    // Missed 2+ days — check streak freeze
    if (streakFreezeExpiry && Date.now() < new Date(streakFreezeExpiry).getTime()) {
      // Freeze is active — protect streak, clear freeze
      return { streak: Math.max(1, currentStreak), last_active_date: today, changed: true, clearFreeze: true };
    }
    // Reset
    return { streak: 1, last_active_date: today, changed: true, clearFreeze: false };
  }

  async function loadProgress() {
    if (guestMode) {
      const raw = getGuestProgress() || initGuest();
      const { streak, last_active_date, changed, clearFreeze } = computeStreak(raw.streak || 0, raw.last_active_date, raw.streak_freeze_expiry);
      let data = changed ? { ...raw, streak, last_active_date } : raw;
      if (clearFreeze) data = { ...data, streak_freeze_expiry: null };
      if (changed) saveGuestProgress(data);
      setProgress(data);
      return;
    }

    try {
    // Check for post-login guest merge
    const params = new URLSearchParams(window.location.search);
    const shouldMerge = params.get("merge_guest") === "1";
    const savedGuest = shouldMerge ? getGuestProgress() : null;

    const user = await db.auth.me();
    const records = await db.entities.UserProgress.filter({ created_by: user.email });

    if (records.length > 0) {
      let existing = records[0];
      if (savedGuest) {
        // Merge guest progress into existing account (take the higher values)
        const merged = {
          xp: Math.max(existing.xp || 0, savedGuest.xp || 0),
          gems: Math.max(existing.gems || 0, savedGuest.gems || 0),
          streak: Math.max(existing.streak || 0, savedGuest.streak || 0),
          completed_lessons: [...new Set([...(existing.completed_lessons || []), ...(savedGuest.completed_lessons || [])])],
          owned_items: [...new Set([...(existing.owned_items || []), ...(savedGuest.owned_items || [])])],
          hearts: Math.max(existing.hearts || 3, savedGuest.hearts || 3),
          avatar_config: savedGuest.avatar_config || existing.avatar_config,
        };
        await db.entities.UserProgress.update(existing.id, merged);
        existing = { ...existing, ...merged };
        clearGuest();
        const url = new URL(window.location.href);
        url.searchParams.delete("merge_guest");
        window.history.replaceState({}, "", url.toString());
      }

      // Streak check on open
      const { streak, last_active_date, changed, clearFreeze } = computeStreak(existing.streak || 0, existing.last_active_date, existing.streak_freeze_expiry);
      const streakUpdate = {};
      if (changed) {
        streakUpdate.streak = streak;
        streakUpdate.last_active_date = last_active_date;
        // Interest account: new day → +5 gems
        if (existing.interest_account_active) {
          streakUpdate.gems = (existing.gems || 0) + 5;
        }
        if (clearFreeze) streakUpdate.streak_freeze_expiry = null;
        await db.entities.UserProgress.update(existing.id, streakUpdate);
        existing = { ...existing, ...streakUpdate };
      }

      // Check for pending forfeit penalty from a closed battle
      if (localStorage.getItem(PENDING_FORFEIT_KEY)) {
        localStorage.removeItem(PENDING_FORFEIT_KEY);
        const deduct = 10;
        existing = { ...existing, gems: (existing.gems || 0) - deduct };
        await db.entities.UserProgress.update(existing.id, { gems: existing.gems });
        // Show toast after a short delay so layout renders first
        setTimeout(() => toast.error(`You left a battle. -${deduct} 💎`), 1500);
      }

      // Restore saved theme
      if (existing.active_theme) setActiveTheme(existing.active_theme);

      setProgress(existing);
    } else {
      const today = getLocalToday();
      const base = savedGuest ? {
        xp: savedGuest.xp || 0,
        hearts: savedGuest.hearts || 3,
        gems: savedGuest.gems || 50,
        streak: 1,
        last_active_date: today,
        completed_lessons: savedGuest.completed_lessons || [],
        current_unit: savedGuest.current_unit || 1,
        level: savedGuest.level || 1,
        daily_reward_day: savedGuest.daily_reward_day || 1,
        owned_items: savedGuest.owned_items || [],
        avatar_config: savedGuest.avatar_config,
        stock_positions: savedGuest.stock_positions || {},
      } : {
        xp: 0, hearts: 3, gems: 50, streak: 1,
        last_active_date: today,
        completed_lessons: [], current_unit: 1, level: 1, daily_reward_day: 1, owned_items: [],
      };
      const newProgress = await db.entities.UserProgress.create(base);
      if (savedGuest) {
        clearGuest();
        const url = new URL(window.location.href);
        url.searchParams.delete("merge_guest");
        window.history.replaceState({}, "", url.toString());
      }
      setProgress(newProgress);
    }
    } catch (err) {
      console.error("Failed to load progress:", err);
      setProgress({ xp: 0, hearts: 3, gems: 50, streak: 1, completed_lessons: [], owned_items: [], level: 1 });
    }
  }

  if (!progress) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {guestMode && progress?.guestName && <GuestBanner guestName={progress.guestName} />}
      <HeaderBar
        streak={progress.streak}
        hearts={progress.hearts}
        gems={progress.gems}
        xp={progress.xp}
        avatarConfig={progress.avatar_config || {}}
        goldThemeUntil={progress.gold_theme_until}
      />
      <main className="pb-24 pt-2">
        <Outlet context={{ progress, setProgress: setProgressWithLevelCheck, reloadProgress: loadProgress, stocks, spawnFloatingGem }} />
      </main>
      <BottomNav />
      <FloatingGemPopup items={floatingGems} />
      <AnimatePresence>
        {levelUpShow && (
          <LevelUpOverlay level={levelUpNum} onClose={() => setLevelUpShow(false)} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {xpChestShow && (
          <XpChestOverlay onClose={() => setXpChestShow(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}