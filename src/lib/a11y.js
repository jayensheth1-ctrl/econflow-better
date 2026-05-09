/**
 * Accessibility utilities: screen-reader announcer + keyboard tab navigation.
 */

// ── Live-region announcer ────────────────────────────────────────────────────
let liveRegion = null;

function getLiveRegion() {
  if (liveRegion) return liveRegion;
  liveRegion = document.createElement("div");
  liveRegion.setAttribute("role", "status");
  liveRegion.setAttribute("aria-live", "polite");
  liveRegion.setAttribute("aria-atomic", "true");
  Object.assign(liveRegion.style, {
    position: "absolute", left: "-9999px", top: "0",
    width: "1px", height: "1px", overflow: "hidden",
  });
  document.body.appendChild(liveRegion);
  return liveRegion;
}

/** Announce text to screen readers (and optionally speak via Web Speech API). */
export function announce(text, { speak = true } = {}) {
  const region = getLiveRegion();
  region.textContent = "";
  requestAnimationFrame(() => { region.textContent = text; });

  // Respect the global read-aloud toggle (default OFF)
  const readAloudOn = localStorage.getItem("econbuddy_read_aloud") === "true";
  if (speak && readAloudOn && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 1.1;
    window.speechSynthesis.speak(utt);
  } else if (!readAloudOn && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

// ── Stereo audio ping (for Portfolio Pilot) ──────────────────────────────────
let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

/**
 * Play an approach sound cue.
 * @param {"orb"|"storm"} kind
 * @param {number} pan  -1 = full left, 0 = center, 1 = full right
 */
export function playApproachCue(kind, pan = 0) {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const panner = ctx.createStereoPanner();

    panner.pan.value = Math.max(-1, Math.min(1, pan));

    if (kind === "orb") {
      // High-pitch friendly ping
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    } else {
      // Low growl warning
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.22, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    }

    osc.connect(gain);
    gain.connect(panner);
    panner.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
  } catch (_) {}
}