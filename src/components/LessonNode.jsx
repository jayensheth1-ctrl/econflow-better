import { Lock, Check } from "lucide-react";
import { announce } from "../lib/a11y";
import { motion } from "framer-motion";

export default function LessonNode({ lesson, index, status, onClick }) {
  const isLocked = status === "locked";
  const isCompleted = status === "completed";
  const isActive = status === "active";

  // Zigzag
  const offsetX = index % 2 === 0 ? -36 : 36;

  const nodeColors = [
    { bg: "from-emerald-400 to-emerald-600", shadow: "rgba(46,204,113,0.55)", border: "#27ae60" },
    { bg: "from-blue-400 to-blue-600", shadow: "rgba(52,152,219,0.5)", border: "#2980b9" },
    { bg: "from-purple-400 to-purple-600", shadow: "rgba(155,89,182,0.5)", border: "#8e44ad" },
    { bg: "from-amber-400 to-amber-600", shadow: "rgba(241,196,15,0.5)", border: "#f39c12" },
  ];
  const color = nodeColors[index % nodeColors.length];

  function handleFocus() {
    if (isLocked) {
      announce(`Locked: ${lesson.title}. Complete previous lessons to unlock.`);
    } else if (isCompleted) {
      announce(`Lesson complete: ${lesson.title}.`);
    } else {
      announce(`${lesson.title}. Press Enter to start.`);
    }
  }

  return (
    <div
      className="flex flex-col items-center"
      style={{ transform: `translateX(${offsetX}px)` }}
    >
      <motion.button
        onClick={(e) => !isLocked && onClick(lesson, e)}
        onFocus={handleFocus}
        onMouseEnter={handleFocus}
        onKeyDown={(e) => { if (e.key === "Enter" && !isLocked) onClick(lesson, e); }}
        disabled={isLocked}
        aria-label={isLocked ? `Locked: ${lesson.title}. Complete previous lessons to unlock.` : isCompleted ? `${lesson.title}. Lesson complete.` : `${lesson.title}. Press Enter to start.`}
        whileHover={!isLocked ? { scale: 1.15, y: -4 } : {}}
        whileTap={!isLocked ? { scale: 0.88, y: 2 } : {}}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className={`
          relative w-[78px] h-[78px] rounded-full flex items-center justify-center
          ${isLocked
            ? "bg-gray-300 cursor-not-allowed"
            : `bg-gradient-to-br ${color.bg} cursor-pointer`
          }
        `}
        style={!isLocked ? {
          boxShadow: `0 7px 0 ${color.border}, 0 10px 28px ${color.shadow}, 0 2px 0 rgba(255,255,255,0.3) inset`,
          border: "3px solid rgba(255,255,255,0.25)",
        } : {
          boxShadow: "0 4px 0 #aaa, 0 6px 12px rgba(0,0,0,0.1)",
          border: "3px solid rgba(255,255,255,0.15)",
          opacity: 0.55,
        }}
      >
        {/* Island texture top highlight */}
        {!isLocked && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-3 bg-white/20 rounded-full blur-sm" />
        )}

        {isLocked ? (
          <Lock className="w-7 h-7 text-gray-500" />
        ) : isCompleted ? (
          <Check className="w-8 h-8 text-white drop-shadow-md" strokeWidth={3} />
        ) : (
          <span className="text-3xl drop-shadow-md">⭐</span>
        )}

        {/* Active glow ring */}
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{ boxShadow: [`0 0 0 4px ${color.shadow}`, `0 0 0 12px transparent`] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        )}

        {/* Active badge */}
        {isActive && (
          <motion.div
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-md border-2 border-white"
          >
            <span className="text-[11px]">!</span>
          </motion.div>
        )}

        {/* Completed sparkle */}
        {isCompleted && (
          <div className="absolute -top-1 -right-1 text-sm">✨</div>
        )}
      </motion.button>

      <span
        className={`mt-2.5 text-xs font-bold text-center max-w-[110px] leading-tight drop-shadow-sm ${
          isLocked ? "text-gray-500" : "text-secondary"
        }`}
      >
        {lesson.title}
      </span>
    </div>
  );
}