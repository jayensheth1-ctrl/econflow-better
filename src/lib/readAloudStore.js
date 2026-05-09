const KEY = "econbuddy_read_aloud";

export function isReadAloudEnabled() {
  return localStorage.getItem(KEY) === "true";
}

export function setReadAloud(enabled) {
  localStorage.setItem(KEY, enabled ? "true" : "false");
  // Cancel any ongoing speech immediately when turning off
  if (!enabled && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}