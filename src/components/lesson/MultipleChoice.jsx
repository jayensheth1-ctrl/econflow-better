import { useState, useEffect, useCallback, useRef } from "react";
import { Volume2 } from "lucide-react";
import { motion } from "framer-motion";
import { announce } from "../../lib/a11y";
import { isReadAloudEnabled } from "../../lib/readAloudStore";

const LABELS = ["a", "b", "c", "d", "e"];

function speak(text, onStart, onEnd) {
  if (!window.speechSynthesis || !isReadAloudEnabled()) {
    if (onEnd) onEnd();
    return;
  }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.onstart = onStart;
  u.onend = onEnd;
  u.onerror = onEnd;
  window.speechSynthesis.speak(u);
}

export default function MultipleChoice({ question, questionNumber, onAnswer, eliminatedIndex = null }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [speaking, setSpeaking] = useState(null); // "question" | index | null
  const [shakeNoSelect, setShakeNoSelect] = useState(false);
  const focusedOptionRef = useRef(null);

  const questionText = questionNumber
    ? `Question ${questionNumber}: ${question.question}`
    : question.question;

  // Announce question on mount
  useEffect(() => {
    announce(questionText + `. Options: ${question.options.map((o, i) => `${LABELS[i]}) ${o}`).join(". ")}`);
  }, []);

  function replayQuestion() {
    setSpeaking("question");
    speak(questionText, () => setSpeaking("question"), () => setSpeaking(null));
  }

  function replayOption(i) {
    setSpeaking(i);
    speak(`${LABELS[i]}: ${question.options[i]}`, () => setSpeaking(i), () => setSpeaking(null));
  }

  function handleSelect(index) {
    if (submitted) return;
    setSelected(index);
    focusedOptionRef.current = index;
    announce(`Selected ${LABELS[index]}: ${question.options[index]}. Press Enter to confirm.`);
  }

  function handleSubmit() {
    if (selected === null || submitted) return;
    setSubmitted(true);
    const isCorrect = selected === question.correct;
    announce(isCorrect ? "Correct!" : `Incorrect. The correct answer was ${LABELS[question.correct]}: ${question.options[question.correct]}.`);
    setTimeout(() => onAnswer(isCorrect, question.explanation), 400);
  }

  const handleKeyDown = useCallback((e) => {
    if (submitted) return;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      setSelected(s => {
        const next = s === null ? 0 : Math.min(s + 1, question.options.length - 1);
        focusedOptionRef.current = next;
        announce(`${LABELS[next]}: ${question.options[next]}`);
        return next;
      });
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      setSelected(s => {
        const prev = s === null ? 0 : Math.max(s - 1, 0);
        focusedOptionRef.current = prev;
        announce(`${LABELS[prev]}: ${question.options[prev]}`);
        return prev;
      });
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (submitted) return; // parent handles advance after submit
      if (selected !== null) {
        handleSubmit();
      } else {
        // Shake to indicate need to pick an option
        setShakeNoSelect(true);
        setTimeout(() => setShakeNoSelect(false), 500);
      }
    } else if (e.key === "v" || e.key === "V") {
      e.preventDefault();
      if (focusedOptionRef.current !== null && focusedOptionRef.current === selected) {
        replayOption(focusedOptionRef.current);
      } else {
        replayQuestion();
      }
    }
  }, [submitted, selected, question]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <motion.div
      animate={shakeNoSelect ? { x: [-8, 8, -6, 6, -3, 3, 0] } : { x: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-3" role="group" aria-label={question.question}>
      {questionNumber && (
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Question {questionNumber}
        </p>
      )}

      {/* Question row with speaker */}
      <div className="flex items-start gap-2">
        <h2 className="text-lg font-bold text-foreground leading-snug flex-1">
          {question.question}
        </h2>
        <motion.button
          onClick={replayQuestion}
          animate={speaking === "question" ? { scale: [1, 1.2, 1] } : { scale: 1 }}
          transition={speaking === "question" ? { duration: 0.6, repeat: Infinity } : {}}
          aria-label="Replay audio for this question"
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors mt-0.5"
          style={{
            background: speaking === "question" ? "rgba(0,242,255,0.2)" : "rgba(0,0,0,0.06)",
            color: speaking === "question" ? "#00F2FF" : "hsl(var(--muted-foreground))",
            border: speaking === "question" ? "1.5px solid #00F2FF" : "1.5px solid transparent",
          }}
        >
          <Volume2 className="w-4 h-4" />
        </motion.button>
      </div>

      <p className="text-[10px] text-muted-foreground -mt-1">
        ⌨️ Arrow keys to navigate · Enter to select &amp; confirm · V to replay audio
      </p>

      <div className="flex flex-col gap-2.5 mt-1" role="radiogroup">
        {question.options.map((option, i) => {
          const isSelected = selected === i;
          const isCorrect = submitted && i === question.correct;
          const isWrong = submitted && isSelected && i !== question.correct;
          const isSpeakingThis = speaking === i;

          const isEliminated = eliminatedIndex === i && !submitted;
          return (
            <div key={i} className="flex items-center gap-2">
              <button
                onClick={() => !isEliminated && handleSelect(i)}
                disabled={isEliminated}
                role="radio"
                aria-checked={isSelected}
                aria-label={`Option ${LABELS[i]}: ${option}${isCorrect ? ". Correct answer." : isWrong ? ". Incorrect." : isEliminated ? ". Eliminated." : ""}`}
                className={`
                  flex-1 text-left px-4 py-3.5 rounded-xl border-2 font-medium text-sm
                  transition-all duration-200
                  ${isEliminated
                    ? "border-border bg-muted text-muted-foreground opacity-40 line-through cursor-not-allowed"
                    : isCorrect
                    ? "border-primary bg-primary/10 text-primary"
                    : isWrong
                      ? "border-destructive bg-destructive/10 text-destructive"
                      : isSelected
                        ? "border-primary bg-primary/5 text-foreground shadow-md"
                        : "border-border bg-card text-foreground hover:border-primary/40"
                  }
                `}
                style={isSelected && !submitted ? {
                  boxShadow: "0 0 0 3px hsl(var(--primary) / 0.35), 0 3px 0 hsl(var(--primary))"
                } : !submitted && !isSelected ? {
                  boxShadow: "0 3px 0 hsl(var(--border))"
                } : {}}
              >
                <span className="inline-flex items-center gap-3">
                  <span className={`
                    w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                    ${isSelected && !submitted ? "bg-primary text-primary-foreground" :
                      isCorrect ? "bg-primary text-primary-foreground" :
                      isWrong ? "bg-destructive text-destructive-foreground" :
                      "bg-muted text-muted-foreground"}
                  `}>
                    {LABELS[i]}
                  </span>
                  {option}
                </span>
              </button>

              {/* Per-option speaker */}
              <motion.button
                onClick={() => replayOption(i)}
                animate={isSpeakingThis ? { scale: [1, 1.25, 1] } : { scale: 1 }}
                transition={isSpeakingThis ? { duration: 0.5, repeat: Infinity } : {}}
                aria-label={`Replay audio for option ${LABELS[i]}: ${option}`}
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
                style={{
                  background: isSpeakingThis ? "rgba(0,242,255,0.2)" : "rgba(0,0,0,0.04)",
                  color: isSpeakingThis ? "#00F2FF" : "hsl(var(--muted-foreground))",
                  border: isSpeakingThis ? "1.5px solid #00F2FF" : "1.5px solid transparent",
                }}
              >
                <Volume2 className="w-3 h-3" />
              </motion.button>
            </div>
          );
        })}
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={selected === null}
          aria-label={selected !== null ? `Check answer: ${LABELS[selected]}: ${question.options[selected]}` : "Select an answer first"}
          className={`
            mt-3 w-full py-3.5 rounded-xl font-bold text-base transition-all duration-200
            ${selected !== null
              ? "bg-primary text-primary-foreground hover:brightness-110 active:scale-[0.98]"
              : "bg-muted text-muted-foreground cursor-not-allowed"
            }
          `}
          style={selected !== null ? { boxShadow: "0 4px 0 hsl(145 63% 38%)" } : {}}
        >
          Check
        </button>
      )}
    </motion.div>
  );
}