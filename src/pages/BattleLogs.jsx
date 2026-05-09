import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Swords } from "lucide-react";
import { getBattleLogs } from "../lib/battleLogs";

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

const RESULT_META = {
  win:     { label: "WIN",     color: "#2ECC71", bg: "rgba(46,204,113,0.12)",  border: "rgba(46,204,113,0.3)",  emoji: "🏆" },
  loss:    { label: "LOSS",    color: "#ef4444", bg: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.3)",   emoji: "💀" },
  forfeit: { label: "FORFEIT", color: "#f59e0b", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.3)",  emoji: "🏳️" },
};

export default function BattleLogs() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    setLogs(getBattleLogs());
  }, []);

  const wins = logs.filter(l => l.result === "win").length;
  const losses = logs.filter(l => l.result === "loss").length;
  const forfeits = logs.filter(l => l.result === "forfeit").length;
  const totalGemChange = logs.reduce((sum, l) => sum + (l.gemChange || 0), 0);

  return (
    <div className="min-h-screen pb-24 bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card/90 backdrop-blur-md border-b border-border px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))" }}
          >
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </button>
          <div>
            <h1 className="text-base font-black text-foreground">Battle Logs</h1>
            <p className="text-[10px] text-muted-foreground">Last {Math.min(logs.length, 10)} battles</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-4">
        {/* Summary stats */}
        {logs.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mb-5">
            {[
              { label: "Wins",     value: wins,     color: "#2ECC71" },
              { label: "Losses",   value: losses,   color: "#ef4444" },
              { label: "Forfeits", value: forfeits, color: "#f59e0b" },
              { label: "Net 💎",   value: (totalGemChange >= 0 ? "+" : "") + totalGemChange, color: totalGemChange >= 0 ? "#2ECC71" : "#ef4444" },
            ].map(s => (
              <div key={s.label} className="rounded-xl p-2.5 text-center"
                style={{ background: `${s.color}0D`, border: `1px solid ${s.color}33` }}>
                <p className="text-lg font-black" style={{ color: s.color }}>{s.value}</p>
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Log entries */}
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-20 gap-4 text-center">
            <div className="text-6xl">⚔️</div>
            <p className="text-lg font-black text-foreground">No battles yet</p>
            <p className="text-sm text-muted-foreground">Complete a bot battle to see your history here.</p>
            <button
              onClick={() => navigate("/")}
              className="mt-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white"
              style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)" }}
            >
              Go Battle
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <AnimatePresence>
              {logs.map((log, i) => {
                const meta = RESULT_META[log.result] || RESULT_META.loss;
                const gemSign = log.gemChange >= 0 ? "+" : "";
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="rounded-2xl p-3.5 flex items-center gap-3"
                    style={{ background: meta.bg, border: `1.5px solid ${meta.border}` }}
                  >
                    {/* Bot emoji */}
                    <div className="text-3xl flex-shrink-0 w-10 text-center">{log.botEmoji}</div>

                    {/* Main info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-black text-foreground">{log.botName}</span>
                        <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full"
                          style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}>
                          {meta.label}
                        </span>
                      </div>
                      {/* Stars */}
                      <div className="flex items-center gap-0.5 mb-0.5">
                        {Array.from({ length: 5 }).map((_, si) => (
                          <span key={si} className="text-[10px]"
                            style={{ filter: si < (log.botStrength || 0) ? "none" : "grayscale(1) opacity(0.2)" }}>
                            ⭐
                          </span>
                        ))}
                        <span className="text-[9px] text-muted-foreground ml-1">Str {log.botStrength}/5</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">{log.date ? formatDate(log.date) : ""}</p>
                    </div>

                    {/* Score + gem change */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-black text-muted-foreground mb-1">
                        {log.myScore ?? "—"} – {log.botScore ?? "—"}
                      </p>
                      <span className="text-sm font-black"
                        style={{ color: log.gemChange >= 0 ? "#2ECC71" : "#ef4444" }}>
                        {gemSign}{log.gemChange} 💎
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}