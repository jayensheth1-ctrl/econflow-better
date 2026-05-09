import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const TIME_LIMIT = 15;

export default function BotQuestion({
  question, questionNum, myScore, botScore, myName, botName,
  onAnswer, onForfeit,
}) {
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [flash, setFlash] = useState(null);
  const [showForfeitConfirm, setShowForfeitConfirm] = useState(false);
  const answered = useRef(false);

  // Reset on new question
  useEffect(() => {
    setSelected(null);
    setFlash(null);
    setTimeLeft(TIME_LIMIT);
    answered.current = false;
  }, [questionNum]);

  // Per-question countdown timer
  useEffect(() => {
    if (answered.current) return;
    if (timeLeft <= 0) { handleAnswer(null); return; }
    const t = setTimeout(() => setTimeLeft(n => n - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, questionNum]);

  function handleAnswer(idx) {
    if (answered.current) return;
    answered.current = true;
    const correct = idx !== null && idx === question.correct;
    setSelected(idx);
    setFlash(correct ? "correct" : "wrong");
    setTimeout(() => onAnswer(correct), 900);
  }

  const timerPct = (timeLeft / TIME_LIMIT) * 100;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Flash overlay */}
      <AnimatePresence>
        {flash && (
          <motion.div
            key={flash}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="fixed inset-0 z-40 pointer-events-none"
            style={{ background: flash === "correct" ? "rgba(46,204,113,0.25)" : "rgba(231,76,60,0.25)" }}
          />
        )}
      </AnimatePresence>

      {/* Forfeit confirmation popup */}
      <AnimatePresence>
        {showForfeitConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="bg-card rounded-2xl p-6 w-full max-w-xs text-center"
              style={{ border: "1.5px solid rgba(239,68,68,0.4)" }}
            >
              <div className="text-4xl mb-3">⚔️</div>
              <h3 className="text-lg font-black text-foreground mb-2">Forfeit Battle?</h3>
              <p className="text-sm text-muted-foreground mb-5">
                You will lose <span className="font-black text-red-400">10 gems</span> for forfeiting.
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => { setShowForfeitConfirm(false); onForfeit(); }}
                  className="w-full py-3 rounded-xl font-bold text-sm"
                  style={{ background: "rgba(239,68,68,0.15)", border: "1.5px solid rgba(239,68,68,0.4)", color: "#ef4444" }}
                >
                  Forfeit (-10 💎)
                </button>
                <button
                  onClick={() => setShowForfeitConfirm(false)}
                  className="w-full py-3 rounded-xl font-bold text-sm"
                  style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}
                >
                  Keep Fighting
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Score header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 flex-shrink-0 relative">
        {/* Exit button */}
        <button
          onClick={() => setShowForfeitConfirm(true)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center z-10"
          style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)" }}
        >
          <X className="w-4 h-4 text-red-400" />
        </button>

        {/* My score */}
        <div className="flex flex-col items-center min-w-[70px]">
          <p className="text-[10px] font-black uppercase tracking-wider text-purple-400">{myName}</p>
          <p className="text-3xl font-black text-foreground">{myScore}</p>
          <p className="text-[9px] text-muted-foreground font-bold">correct</p>
        </div>

        {/* Timer ring */}
        <div className="relative w-14 h-14">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4"/>
            <circle
              cx="28" cy="28" r="24" fill="none"
              stroke={timeLeft <= 5 ? "#E74C3C" : "#C084FC"}
              strokeWidth="4"
              strokeDasharray={`${2 * Math.PI * 24}`}
              strokeDashoffset={`${2 * Math.PI * 24 * (1 - timerPct / 100)}`}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.9s linear, stroke 0.3s" }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-foreground">
            {timeLeft}
          </span>
        </div>

        {/* Bot score */}
        <div className="flex flex-col items-center min-w-[70px]">
          <p className="text-[10px] font-black uppercase tracking-wider text-cyan-400">{botName}</p>
          <p className="text-3xl font-black text-foreground">{botScore}</p>
          <p className="text-[9px] text-muted-foreground font-bold">correct</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 mx-4 rounded-full overflow-hidden mb-3 flex-shrink-0 bg-muted">
        <motion.div
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg,#7c3aed,#C084FC)", width: `${Math.min(questionNum * 10, 100)}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Question */}
      <div className="flex-1 overflow-y-auto px-4 flex flex-col gap-3">
        <div className="rounded-2xl p-4" style={{ background: "rgba(192,132,252,0.07)", border: "1px solid rgba(192,132,252,0.2)" }}>
          <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-2">
            Question {questionNum}
          </p>
          <p className="text-base font-bold text-foreground leading-snug">{question.question}</p>
        </div>

        <div className="grid grid-cols-1 gap-2 pb-6">
          {question.options.map((opt, i) => {
            let borderColor = "hsl(var(--border))";
            let bg = "hsl(var(--muted))";
            let textColor = "hsl(var(--muted-foreground))";
            if (selected !== null) {
              if (i === question.correct) { borderColor = "#2ECC71"; bg = "rgba(46,204,113,0.15)"; textColor = "#2ECC71"; }
              else if (i === selected && selected !== question.correct) { borderColor = "#E74C3C"; bg = "rgba(231,76,60,0.15)"; textColor = "#E74C3C"; }
            }
            return (
              <motion.button
                key={i}
                whileTap={selected === null ? { scale: 0.97 } : {}}
                onClick={() => selected === null && handleAnswer(i)}
                disabled={selected !== null}
                className="w-full text-left px-4 py-3.5 rounded-xl font-semibold text-sm transition-all"
                style={{ background: bg, border: `1.5px solid ${borderColor}`, color: textColor }}
              >
                <span className="font-black text-xs mr-2" style={{ color: borderColor === "hsl(var(--border))" ? "hsl(var(--muted-foreground))" : borderColor }}>
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}