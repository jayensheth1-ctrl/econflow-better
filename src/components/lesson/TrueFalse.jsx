import { useState } from "react";
import { Check, X } from "lucide-react";

export default function TrueFalse({ question, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  function handleSelect(value) {
    if (submitted) return;
    setSelected(value);
    setSubmitted(true);
    const isCorrect = value === question.correct;
    setTimeout(() => onAnswer(isCorrect, question.explanation), 500);
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-bold text-foreground leading-snug">
        {question.question}
      </h2>
      <div className="flex gap-4 mt-4">
        <button
          onClick={() => handleSelect(true)}
          className={`
            flex-1 py-6 rounded-xl font-bold text-lg flex flex-col items-center gap-2
            border-2 transition-all duration-200
            ${submitted && selected === true
              ? question.correct === true
                ? "border-primary bg-primary/10 text-primary"
                : "border-destructive bg-destructive/10 text-destructive"
              : !submitted
                ? "border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 hover:border-primary active:scale-95"
                : "border-border bg-card text-muted-foreground"
            }
          `}
          style={!submitted ? { boxShadow: "0 4px 0 hsl(145 63% 80%)" } : {}}
        >
          <Check className="w-8 h-8" strokeWidth={3} />
          True
        </button>
        <button
          onClick={() => handleSelect(false)}
          className={`
            flex-1 py-6 rounded-xl font-bold text-lg flex flex-col items-center gap-2
            border-2 transition-all duration-200
            ${submitted && selected === false
              ? question.correct === false
                ? "border-primary bg-primary/10 text-primary"
                : "border-destructive bg-destructive/10 text-destructive"
              : !submitted
                ? "border-destructive/30 bg-destructive/5 text-destructive hover:bg-destructive/10 hover:border-destructive active:scale-95"
                : "border-border bg-card text-muted-foreground"
            }
          `}
          style={!submitted ? { boxShadow: "0 4px 0 hsl(0 84% 85%)" } : {}}
        >
          <X className="w-8 h-8" strokeWidth={3} />
          False
        </button>
      </div>
    </div>
  );
}