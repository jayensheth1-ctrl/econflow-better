const KEY = "econbuddy_username";

export function getUsername() {
  return localStorage.getItem(KEY) || null;
}

export function setUsername(name) {
  localStorage.setItem(KEY, name);
  // Dispatch custom event so all listeners update simultaneously
  window.dispatchEvent(new CustomEvent("username-changed", { detail: name }));
}