// Theme manager — applies theme CSS classes to document root
// Works alongside dark/light mode toggle in themeStore.js

const THEME_KEY = "econflow_app_theme";
const THEME_PREFIX = "theme-";

export const THEMES = {
  "dark-galaxy": "theme-dark-galaxy",
  "neon-sunrise": "theme-neon-sunrise",
  "ocean-deep": "theme-ocean-deep",
  "forest-sage": "theme-forest-sage",
  "cyber-blood": "theme-cyber-blood",
  "arctic-void": "theme-arctic-void",
  "golden-hour": "theme-golden-hour",
};

export function getActiveTheme() {
  return localStorage.getItem(THEME_KEY) || "dark-galaxy";
}

export function setActiveTheme(themeKey) {
  localStorage.setItem(THEME_KEY, themeKey);
  applyTheme(themeKey);
}

export function applyTheme(themeKey) {
  const root = document.documentElement;
  // Remove all theme classes
  Object.values(THEMES).forEach(cls => root.classList.remove(cls));
  // Apply new theme (dark-galaxy is default, no class needed but we set it for reference)
  const cls = THEMES[themeKey];
  if (cls && themeKey !== "dark-galaxy") {
    root.classList.add(cls);
  }
}

// Call this on app boot
export function initTheme() {
  applyTheme(getActiveTheme());
}