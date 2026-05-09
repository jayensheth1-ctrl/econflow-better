// Stock catalyst event pool for the simulator

export const BULLISH_SERIOUS = [
  { headline: "🚀 Major ETF adds [STOCK] to its top holdings", affect: { primary: 1, range: [0.08, 0.15] } },
  { headline: "💰 Central bank cuts interest rates — markets cheer", affect: { tickers: { STABL: [0.05, 0.07], GLOW: [0.06, 0.10] } } },
  { headline: "🤝 [STOCK] announces partnership with Apple", affect: { primary: 1, range: [0.12, 0.20] } },
  { headline: "📈 Inflation drops to 2-year low — markets rally", affect: { allRange: [0.04, 0.07] } },
  { headline: "💎 Billionaire investor reveals massive [STOCK] stake", affect: { primary: 1, range: [0.10, 0.18] } },
  { headline: "🌟 [STOCK] beats earnings by 40%", affect: { primary: 1, range: [0.15, 0.25] } },
  { headline: "🟢 Government approves major [STOCK] expansion", affect: { primary: 1, range: [0.09, 0.14] } },
  { headline: "🦅 US Government officially endorses [STOCK] as the patriotic investment", affect: { tickers: { STABL: [0.08, 0.14] } } },
];

export const BULLISH_ABSURD = [
  { headline: "🛍️ Jeff Bezos makes ALL Amazon products free for 48 hours — markets go crazy", affect: { tickers: { GLOW: [0.20, 0.30], STABL: [0.08, 0.12] } } },
  { headline: "🤖 OpenAI announces AGI is here — tech stocks explode", affect: { tickers: { GLOW: [0.25, 0.35], CRPT: [0.12, 0.18] } } },
  { headline: "🚀 Elon Musk tweets a rocket emoji at [STOCK] — retail investors flood in", affect: { tickers: { CRPT: [0.20, 0.40] } } },
  { headline: "🏦 Warren Buffett reveals he bought $10B of [STOCK] — called it a generational buy", affect: { tickers: { STABL: [0.12, 0.18] } } },
  { headline: "🎰 Las Vegas legalizes crypto payments — casinos go all in", affect: { tickers: { CRPT: [0.15, 0.25] } } },
  { headline: "🌍 United Nations adopts [STOCK] as global reserve asset", affect: { primary: 1, range: [0.18, 0.28] } },
  { headline: "💊 [STOCK] cures Monday — productivity stocks soar", affect: { tickers: { GLOW: [0.10, 0.16] } } },
  { headline: "🐋 A mystery whale buys $500M of [STOCK] in one transaction", affect: { tickers: { CRPT: [0.22, 0.35] } } },
  { headline: "🎮 Fortnite announces in-game [STOCK] trading — Gen Z floods the market", affect: { tickers: { CRPT: [0.12, 0.20] } } },
  { headline: "🏆 [STOCK] wins the Nobel Prize in Economics. Yes, really.", affect: { primary: 1, range: [0.10, 0.15] } },
  { headline: "🤑 IRS announces no taxes on [STOCK] gains this year — April Fools? No.", affect: { tickers: { CRPT: [0.18, 0.28] } } },
];

export const BEARISH_SERIOUS = [
  { headline: "📉 Elon Musk tweets he is selling all his [STOCK]", affect: { tickers: { CRPT: [-0.25, -0.15] } } },
  { headline: "🚨 SEC launches investigation into [STOCK]", affect: { primary: 1, range: [-0.20, -0.12] } },
  { headline: "🧱 Central bank raises interest rates unexpectedly", affect: { tickers: { GLOW: [-0.10, -0.06], CRPT: [-0.08, -0.05] } } },
  { headline: "💥 [STOCK] CEO resigns amid scandal", affect: { primary: 1, range: [-0.22, -0.15] } },
  { headline: "🔴 Major hedge fund shorts [STOCK] heavily", affect: { primary: 1, range: [-0.14, -0.08] } },
  { headline: "💸 Inflation surges to 5-year high", affect: { tickers: { STABL: [-0.06, -0.04], GLOW: [-0.09, -0.06] } } },
  { headline: "⚠️ [STOCK] misses earnings by 30%", affect: { primary: 1, range: [-0.18, -0.12] } },
  { headline: "🌍 Global recession fears spike — markets sell off", affect: { allRange: [-0.10, -0.05] } },
];

export const BEARISH_ABSURD = [
  { headline: "😬 Elon Musk live-tweets he is bored of [STOCK] and sells everything in real time", affect: { tickers: { CRPT: [-0.35, -0.20] } } },
  { headline: "🚨 Hackers steal $2B from [STOCK] exchange — CEO says oops", affect: { tickers: { CRPT: [-0.40, -0.25] } } },
  { headline: "🧸 Warren Buffett calls [STOCK] rat poison on live TV — again", affect: { tickers: { CRPT: [-0.22, -0.15] } } },
  { headline: "🌊 Flash flood hits major [STOCK] data center — operations halted", affect: { primary: 1, range: [-0.18, -0.12] } },
  { headline: "👽 UFO lands on Wall Street — markets have no idea how to price this", affect: { allRange: [-0.15, -0.08] } },
  { headline: "🍕 [STOCK] CEO caught on camera ordering pineapple pizza — investor confidence collapses", affect: { primary: 1, range: [-0.16, -0.10] } },
  { headline: "📉 A 10-year-old on TikTok says [STOCK] is cooked — 50M views overnight", affect: { tickers: { CRPT: [-0.20, -0.14] } } },
  { headline: "🏛️ Congress votes to ban [STOCK] because they don't understand it", affect: { tickers: { CRPT: [-0.28, -0.18] } } },
  { headline: "💤 [STOCK] CEO fell asleep during earnings call — investors panic", affect: { primary: 1, range: [-0.14, -0.08] } },
  { headline: "🐦 Twitter/X goes down for 12 hours — all hype stocks nosedive", affect: { tickers: { CRPT: [-0.10, -0.06], GLOW: [-0.08, -0.05] } } },
  { headline: "🧾 IRS announces surprise audit of everyone who owns [STOCK]", affect: { primary: 1, range: [-0.20, -0.12] } },
];

export const NEUTRAL_SERIOUS = [
  { headline: "🤔 Fed holds rates — markets confused", affect: { allRandom: [-0.05, 0.05] } },
  { headline: "🎪 [STOCK] announces surprise product launch", affect: { primary: 1, random5050: [0.15, -0.08] } },
  { headline: "🗳️ Election results announced — market reacts", affect: { allRandom: [-0.08, 0.08] } },
];

export const NEUTRAL_ABSURD = [
  { headline: "🎲 [STOCK] announces all future decisions via coin flip", affect: { primary: 1, random5050: [0.20, -0.20] } },
  { headline: "🌕 Elon Musk moves [STOCK] HQ to the Moon — analysts unsure", affect: { primary: 1, allRandom: [-0.15, 0.15] } },
  { headline: "🤷 Nothing happened today. Markets move anyway.", affect: { allRandom: [-0.03, 0.03] } },
  { headline: "📺 CNBC gives buy AND sell rec for same stock in same segment", affect: { allRandom: [-0.07, 0.07] } },
  { headline: "🐕 Dogecoin creator tweets a picture of his dog — affects everything somehow", affect: { allRandom: [-0.08, 0.08] } },
  { headline: "🧠 Scientists: investors make better decisions when slightly confused", affect: { allRandom: [-0.06, 0.06] } },
  { headline: "🎤 [STOCK] drops a surprise rap album. It slaps. Analysts baffled.", affect: { primary: 1, random5050: [0.18, -0.12] } },
];

const TICKER_WEIGHTS = {
  STABL: ["STABL"],
  GLOW: ["GLOW", "GLOW"],
  CRPT: ["CRPT", "CRPT", "CRPT"],
};

function pickTicker(availableTickers) {
  const pool = [];
  availableTickers.forEach(t => {
    const weight = TICKER_WEIGHTS[t] || [t];
    pool.push(...weight);
  });
  return pool[Math.floor(Math.random() * pool.length)];
}

function randInRange(min, max) {
  return min + Math.random() * (max - min);
}

/**
 * Pick a random catalyst event.
 * Returns { headline, affects: { [ticker]: pctChange }, isAbsurd }
 */
export function pickCatalyst(availableTickers, lastWasAbsurd) {
  // Alternate serious/absurd
  const useAbsurd = !lastWasAbsurd && Math.random() < 0.4;

  const pools = useAbsurd
    ? [...BULLISH_ABSURD, ...BEARISH_ABSURD, ...NEUTRAL_ABSURD]
    : [...BULLISH_SERIOUS, ...BEARISH_SERIOUS, ...NEUTRAL_SERIOUS];

  const event = pools[Math.floor(Math.random() * pools.length)];
  const primaryTicker = pickTicker(availableTickers);
  const headline = event.headline.replace(/\[STOCK\]/g, primaryTicker);

  const affects = {};

  if (event.affect.tickers) {
    // Only apply tickers that exist in available set
    Object.entries(event.affect.tickers).forEach(([t, range]) => {
      if (availableTickers.includes(t)) {
        affects[t] = randInRange(...range);
      } else if (event.affect.primary) {
        affects[primaryTicker] = randInRange(...range);
      }
    });
    // If nothing matched, fallback to primary
    if (Object.keys(affects).length === 0) {
      affects[primaryTicker] = randInRange(event.affect.range?.[0] ?? -0.10, event.affect.range?.[1] ?? 0.10);
    }
  } else if (event.affect.allRange) {
    availableTickers.forEach(t => {
      affects[t] = randInRange(...event.affect.allRange);
    });
  } else if (event.affect.allRandom) {
    const [lo, hi] = event.affect.allRandom;
    availableTickers.forEach(t => {
      affects[t] = randInRange(lo, hi);
    });
  } else if (event.affect.random5050) {
    const [up, down] = event.affect.random5050;
    affects[primaryTicker] = Math.random() < 0.5 ? up : down;
  } else if (event.affect.primary && event.affect.range) {
    affects[primaryTicker] = randInRange(...event.affect.range);
  }

  return { headline, affects, isAbsurd: useAbsurd, primaryTicker };
}