// Bot Battle — all configuration and logic

export const BOT_ROSTER = [
  { name: "FinBot",      emoji: "🤖" },
  { name: "TradeMaster", emoji: "📈" },
  { name: "BullBot",     emoji: "🐂" },
  { name: "BearBot",     emoji: "🐻" },
  { name: "CryptoKid",   emoji: "₿"  },
  { name: "DivBot",      emoji: "💰" },
  { name: "HedgeFox",    emoji: "🦊" },
  { name: "AlgoAce",     emoji: "⚡" },
];

// Accuracy by strength (0–1)
const BASE_ACCURACY = { 1: 0.30, 2: 0.45, 3: 0.60, 4: 0.75, 5: 0.90 };

// Fixed interval in ms per question — per strength level (tight range for consistent feel)
const BASE_SPEED = {
  1: [3500,  4500],
  2: [2000,  3000],
  3: [1700,  2300],
  4: [1200,  1800],
  5: [800,   1200],
};

const LOSS_STREAK_KEY = "econbuddy_bot_loss_streak";
export const PENDING_FORFEIT_KEY = "econbuddy_pending_forfeit";

export function getLossStreak() {
  return parseInt(localStorage.getItem(LOSS_STREAK_KEY) || "0", 10);
}

export function setLossStreak(n) {
  localStorage.setItem(LOSS_STREAK_KEY, String(n));
}

export function generateBot(excludeName = null, excludeStrength = null) {
  // Pick a different strength from last time
  let strength;
  do {
    strength = Math.floor(Math.random() * 5) + 1;
  } while (excludeStrength !== null && strength === excludeStrength);

  // Pick a different bot name from last time
  const pool = excludeName
    ? BOT_ROSTER.filter(b => b.name !== excludeName)
    : BOT_ROSTER;
  const roster = pool[Math.floor(Math.random() * pool.length)];
  return { strength, name: roster.name, emoji: roster.emoji };
}

/** Random delay in ms for a single bot question attempt */
export function getBotDelay(speedRange) {
  const [min, max] = speedRange;
  return min + Math.random() * (max - min);
}

/**
 * Get effective accuracy and speed for a bot, applying rigging based on loss streak.
 */
export function getBotParams(bot) {
  const streak = getLossStreak();
  let accuracy = BASE_ACCURACY[bot.strength];
  let speedRange = [...BASE_SPEED[bot.strength]];

  if (streak >= 3) {
    // Guarantee win: bot is terrible
    accuracy = 0.10;
    speedRange = [12000, 15000];
  } else if (streak === 2) {
    // Force win: significantly hamper bot
    accuracy = Math.max(0.10, accuracy - 0.30);
    speedRange = [speedRange[0] * 1.4, speedRange[1] * 1.4];
  }

  return { accuracy, speedRange };
}

export function getMotivationalLine(userScore) {
  if (userScore >= 8) return "So close! You almost had it.";
  if (userScore >= 5) return "Keep practicing!";
  return "Study up and come back stronger.";
}