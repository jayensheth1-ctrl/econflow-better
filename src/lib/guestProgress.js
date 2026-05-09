const KEY = "econbuddy_guest";
const ACTIVE_KEY = "econbuddy_guest_active";

export function isGuestMode() {
  return localStorage.getItem(ACTIVE_KEY) === "true";
}

export function getGuestProgress() {
  try {
    const data = localStorage.getItem(KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function saveGuestProgress(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function initGuest() {
  const existing = getGuestProgress();
  localStorage.setItem(ACTIVE_KEY, "true");
  if (existing) return existing;
  const id = Math.floor(Math.random() * 9000) + 1000;
  const guestName = `Guest_${id}`;
  const fresh = {
    id: "guest",
    created_by: guestName,
    xp: 0,
    hearts: 3,
    gems: 50,
    streak: 0,
    last_active_date: new Date().toISOString().split("T")[0],
    completed_lessons: [],
    current_unit: 1,
    level: 1,
    daily_reward_day: 1,
    owned_items: [],
    avatar_config: { helmet: "basic", eyes: "cyan", outfit: "midnight", accessory: "none" },
    stock_positions: {},
    guestName,
  };
  localStorage.setItem(KEY, JSON.stringify(fresh));
  return fresh;
}

export function clearGuest() {
  localStorage.removeItem(KEY);
  localStorage.removeItem(ACTIVE_KEY);
  // Also clear any legacy cookie-style keys
  try {
    document.cookie.split(";").forEach(c => {
      const key = c.trim().split("=")[0];
      if (key.startsWith("econbuddy")) {
        document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
      }
    });
  } catch {}
}