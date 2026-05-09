// Battle log storage — persists last 10 battles in localStorage

const BATTLE_LOGS_KEY = "econbuddy_battle_logs";
const MAX_LOGS = 10;

export function getBattleLogs() {
  try {
    return JSON.parse(localStorage.getItem(BATTLE_LOGS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveBattleLog(entry) {
  // entry: { botName, botEmoji, botStrength, result: "win"|"loss"|"forfeit", myScore, botScore, gemChange, date }
  const logs = getBattleLogs();
  logs.unshift({ ...entry, date: new Date().toISOString() });
  localStorage.setItem(BATTLE_LOGS_KEY, JSON.stringify(logs.slice(0, MAX_LOGS)));
}