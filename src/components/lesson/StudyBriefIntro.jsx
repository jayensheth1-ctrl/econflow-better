import { motion } from "framer-motion";
import { BookOpen, ArrowRight } from "lucide-react";

export default function StudyBriefIntro({ lesson, onStart }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-5 px-1 py-2"
    >
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "rgba(192,132,252,0.7)" }}>
          📖 Study Brief
        </p>
        <h2 className="text-xl font-extrabold text-foreground">{lesson.title}</h2>
        <p className="text-xs text-muted-foreground mt-1">Read this before answering questions</p>
      </div>

      {/* Glassmorphism brief box */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "linear-gradient(160deg, rgba(147,51,234,0.12) 0%, rgba(79,0,180,0.08) 100%)",
          border: "1.5px solid rgba(147,51,234,0.35)",
          boxShadow: "0 0 32px rgba(147,51,234,0.15), inset 0 1px 0 rgba(255,255,255,0.06)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Icon header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(147,51,234,0.25)", border: "1px solid rgba(147,51,234,0.4)" }}>
            <BookOpen className="w-4 h-4" style={{ color: "#C084FC" }} />
          </div>
          <p className="text-xs font-bold" style={{ color: "#C084FC" }}>Key Concepts</p>
        </div>

        <p className="text-sm leading-relaxed text-foreground/90">
          {lesson.studyBrief}
        </p>
      </div>

      <div className="rounded-xl px-4 py-2.5 text-center"
        style={{ background: "rgba(241,196,15,0.08)", border: "1px solid rgba(241,196,15,0.2)" }}>
        <p className="text-xs" style={{ color: "rgba(241,196,15,0.8)" }}>
          💡 <span className="font-bold">Tip:</span> You can review this brief at any time by tapping the 📖 button or pressing <kbd className="px-1 py-0.5 rounded text-[10px] font-bold" style={{ background: "rgba(241,196,15,0.15)", border: "1px solid rgba(241,196,15,0.3)" }}>R</kbd>
        </p>
      </div>

      <button
        onClick={onStart}
        className="w-full py-4 rounded-2xl font-extrabold text-base flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
        style={{
          background: "linear-gradient(135deg, hsl(var(--primary)), hsl(145 63% 38%))",
          color: "hsl(var(--primary-foreground))",
          boxShadow: "0 5px 0 hsl(145 63% 32%), 0 8px 20px rgba(0,0,0,0.2)",
        }}
      >
        Start Lesson <ArrowRight className="w-5 h-5" />
      </button>
    </motion.div>
  );
}