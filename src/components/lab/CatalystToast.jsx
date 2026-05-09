import { motion, AnimatePresence } from "framer-motion";

export default function CatalystToast({ event }) {
  if (!event) return null;

  const isAbsurd = event.isAbsurd;
  const isPositive = Object.values(event.affects || {}).some(v => v > 0);
  const isNegative = Object.values(event.affects || {}).every(v => v < 0);

  const borderColor = isAbsurd
    ? "#F1C40F"
    : isPositive ? "#2ECC71" : isNegative ? "#E74C3C" : "#00F2FF";

  const bg = isAbsurd
    ? "rgba(241,196,15,0.12)"
    : isPositive ? "rgba(46,204,113,0.10)" : isNegative ? "rgba(231,76,60,0.10)" : "rgba(0,242,255,0.08)";

  const tickers = Object.entries(event.affects || {}).map(([t, pct]) => ({
    ticker: t,
    pct: (pct * 100).toFixed(1),
    up: pct >= 0,
  }));

  return (
    <AnimatePresence>
      {event && (
        <motion.div
          key={event.headline}
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="flex justify-center px-0 pointer-events-none mb-1"
        >
          <div
            className="max-w-sm w-full rounded-2xl px-4 py-3 shadow-2xl"
            style={{ background: bg, border: `1.5px solid ${borderColor}`, boxShadow: `0 4px 24px ${borderColor}33` }}
          >
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest mb-1"
                  style={{ color: borderColor }}>
                  {isAbsurd ? "🎉 Wild Card Event" : "📰 Market News"}
                </p>
                <p className="text-xs font-bold text-white leading-snug">{event.headline}</p>
              </div>
            </div>
            {tickers.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {tickers.map(({ ticker, pct, up }) => (
                  <span key={ticker}
                    className="text-[10px] font-black px-2 py-0.5 rounded-full"
                    style={{
                      background: up ? "rgba(46,204,113,0.2)" : "rgba(231,76,60,0.2)",
                      color: up ? "#2ECC71" : "#E74C3C",
                      border: `1px solid ${up ? "#2ECC71" : "#E74C3C"}44`,
                    }}>
                    {ticker} {up ? "▲" : "▼"}{Math.abs(pct)}%
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}