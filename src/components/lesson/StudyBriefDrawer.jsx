import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen } from "lucide-react";
import { announce } from "../../lib/a11y";

export default function StudyBriefDrawer({ brief, isOpen, onClose, isRevisit = false }) {
  // R key toggles the drawer
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Announce when opened
  useEffect(() => {
    if (isOpen && brief) {
      announce((isRevisit ? "Re-reading Study Brief. " : "Study Brief. ") + brief);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-black/50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed bottom-0 left-0 right-0 z-[75] rounded-t-3xl max-w-lg mx-auto"
            style={{
              background: "linear-gradient(160deg, rgba(18,10,35,0.98) 0%, rgba(12,8,28,0.99) 100%)",
              border: "1.5px solid rgba(147,51,234,0.4)",
              borderBottom: "none",
              boxShadow: "0 -8px 40px rgba(147,51,234,0.25), 0 0 0 1px rgba(147,51,234,0.1)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full" style={{ background: "rgba(147,51,234,0.4)" }} />
            </div>

            <div className="px-6 pb-6 pt-2">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(147,51,234,0.2)", border: "1px solid rgba(147,51,234,0.4)" }}>
                    <BookOpen className="w-4 h-4" style={{ color: "#C084FC" }} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(192,132,252,0.6)" }}>
                      📖 Study Brief
                    </p>
                    {isRevisit && (
                      <p className="text-[9px]" style={{ color: "rgba(192,132,252,0.4)" }}>Re-reading…</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close Study Brief (R)"
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                  style={{ background: "rgba(147,51,234,0.15)", border: "1px solid rgba(147,51,234,0.3)" }}
                >
                  <X className="w-4 h-4" style={{ color: "#C084FC" }} />
                </button>
              </div>

              {/* Brief text */}
              <div className="rounded-2xl p-4"
                style={{
                  background: "rgba(147,51,234,0.08)",
                  border: "1px solid rgba(147,51,234,0.25)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
                }}>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(240,220,255,0.9)", fontStyle: "normal" }}>
                  {brief}
                </p>
              </div>

              <button
                onClick={onClose}
                className="mt-4 w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, rgba(147,51,234,0.35), rgba(109,28,217,0.4))",
                  border: "1.5px solid rgba(147,51,234,0.5)",
                  color: "#C084FC",
                  boxShadow: "0 0 16px rgba(147,51,234,0.2)",
                }}
              >
                ← Back to Question
              </button>

              <p className="text-center text-[10px] mt-2" style={{ color: "rgba(192,132,252,0.35)" }}>
                Press R to toggle this brief
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}