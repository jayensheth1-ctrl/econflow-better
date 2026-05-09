const KEY = "econbuddy_theme";

export function getTheme() {
  return localStorage.getItem(KEY) || "dark";
}

export function setTheme(theme) {
  localStorage.setItem(KEY, theme);
  applyTheme(theme);
}

export function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "light") {
    root.classList.add("light-mode");
  } else {
    root.classList.remove("light-mode");
  }
}

export function initTheme() {
  applyTheme(getTheme());
}