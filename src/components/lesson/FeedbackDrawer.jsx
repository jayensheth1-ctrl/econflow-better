import { Check, X } from "lucide-react";
import { useEffect } from "react";
import { playCorrect, playWrong } from "../../lib/sounds";

export default function FeedbackDrawer({ isCorrect, explanation, onContinue }) {
  useEffect(() => {
    if (isCorrect) playCorrect();
    else playWrong();
  }, []);
  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 z-50 animate-slide-up
        border-t-2 ${isCorrect ? "border-primary" : "border-destructive"}
        px-5 py-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]
      `}
      style={{ background: isCorrect ? "hsl(var(--primary) / 0.08)" : "hsl(var(--destructive) / 0.08)", backdropFilter: "blur(8px)" }}
    >
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isCorrect ? "bg-primary" : "bg-destructive"
            }`}
          >
            {isCorrect ? (
              <Check className="w-5 h-5 text-white" strokeWidth={3} />
            ) : (
              <X className="w-5 h-5 text-white" strokeWidth={3} />
            )}
          </div>
          <h3
            className={`text-lg font-extrabold ${
              isCorrect ? "text-primary" : "text-destructive"
            }`}
          >
            {isCorrect ? "Correct!" : "Incorrect"}
          </h3>
        </div>
        <p className="text-sm mb-4 text-foreground/80">
          {explanation}
        </p>
        <button
          onClick={onContinue}
          className={`
            w-full py-3.5 rounded-xl font-bold text-base text-white transition-all
            active:scale-[0.98]
            ${isCorrect ? "bg-primary" : "bg-destructive"}
          `}
          style={{
            boxShadow: isCorrect
              ? "0 4px 0 hsl(145 63% 38%)"
              : "0 4px 0 hsl(0 84% 48%)",
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}