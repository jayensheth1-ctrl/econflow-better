let ctx = null;
function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  return ctx;
}

function tone(freq, duration, type = "sine", gain = 0.3, delay = 0) {
  const c = getCtx();
  const o = c.createOscillator();
  const g = c.createGain();
  o.connect(g);
  g.connect(c.destination);
  o.type = type;
  o.frequency.setValueAtTime(freq, c.currentTime + delay);
  g.gain.setValueAtTime(gain, c.currentTime + delay);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + duration);
  o.start(c.currentTime + delay);
  o.stop(c.currentTime + delay + duration);
}

export function playCorrect() {
  tone(523, 0.12); // C5
  tone(659, 0.12, "sine", 0.3, 0.1); // E5
  tone(784, 0.18, "sine", 0.3, 0.2); // G5
}

export function playWrong() {
  tone(200, 0.3, "sawtooth", 0.2);
}

export function playChaChig() {
  tone(440, 0.08);
  tone(660, 0.08, "sine", 0.3, 0.09);
  tone(880, 0.08, "sine", 0.3, 0.17);
  tone(1100, 0.15, "sine", 0.35, 0.25);
}

export function playClick() {
  tone(800, 0.06, "square", 0.1);
}

export function playLevelUp() {
  [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.18, "sine", 0.35, i * 0.12));
}