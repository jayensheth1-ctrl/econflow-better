import { motion } from "framer-motion";
import { X, Download, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import EconBuddy from "../EconBuddy";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function ShareCard({ preview, level, xp, gems, iq, wlt, onClose }) {
  const cardRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    if (!cardRef.current || downloading) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#0a0e17",
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [canvas.width / 2, canvas.height / 2] });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`econbuddy-card-lvl${level}.pdf`);
      toast.success("Card downloaded! 📥");
    } catch {
      toast.error("Download failed. Try again.");
    } finally {
      setDownloading(false);
    }
  }

  const rank =
    level >= 15 ? "CRYPTO WHALE" :
    level >= 10 ? "HEDGE FUND PRO" :
    level >= 7  ? "MARKET ANALYST" :
    level >= 4  ? "JUNIOR TRADER" :
    "INTERN";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 30 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-xs"
      >
        {/* The "card" itself */}
        <div ref={cardRef} className="rounded-3xl overflow-hidden relative"
          style={{
            background: "linear-gradient(145deg, #0a0e17, #0d1728)",
            border: "1.5px solid rgba(0,242,255,0.25)",
            boxShadow: "0 0 60px rgba(0,242,255,0.15), 0 30px 60px rgba(0,0,0,0.6)",
          }}>

          {/* Grid bg */}
          <div className="absolute inset-0 opacity-[0.05]">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="sgrid" width="24" height="24" patternUnits="userSpaceOnUse">
                  <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#00F2FF" strokeWidth="0.4"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#sgrid)" />
            </svg>
          </div>

          {/* Top banner */}
          <div className="px-5 pt-5 pb-2 relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.25em]" style={{ color: "rgba(0,242,255,0.5)" }}>
                  ECONBUDDY
                </p>
                <p className="text-xl font-black" style={{ color: "#00F2FF", textShadow: "0 0 12px #00F2FF55" }}>
                  {rank}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-gray-600">LVL</p>
                <p className="text-3xl font-black" style={{ color: "#F1C40F", lineHeight: 1 }}>{level}</p>
              </div>
            </div>
          </div>

          {/* Mascot */}
          <div className="flex justify-center py-4 relative">
            <div style={{ filter: "drop-shadow(0 0 30px rgba(0,242,255,0.3))" }}>
              <EconBuddy config={preview} size={140} />
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 px-5 pb-5">
            {[
              { label: "XP",  value: xp,   color: "#00F2FF" },
              { label: "IQ",  value: iq,   color: "#C084FC" },
              { label: "WLT", value: wlt,  color: "#F1C40F" },
            ].map(s => (
              <div key={s.label} className="rounded-xl py-2 text-center"
                style={{ background: `${s.color}0A`, border: `1px solid ${s.color}22` }}>
                <p className="text-lg font-black" style={{ color: s.color }}>{s.value}</p>
                <p className="text-[8px] font-bold" style={{ color: `${s.color}66` }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Bottom strip */}
          <div className="px-5 pb-5">
            <div className="h-px w-full mb-3" style={{ background: "linear-gradient(90deg, transparent, rgba(0,242,255,0.2), transparent)" }} />
            <p className="text-[8px] font-bold text-center text-gray-700 tracking-widest">
              econbuddy.app · FINANCIAL INTELLIGENCE PROGRAM
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-3">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#555" }}>
            <X className="w-4 h-4" /> Close
          </button>
          <button onClick={handleDownload} disabled={downloading}
            className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 disabled:opacity-70"
            style={{ background: "linear-gradient(135deg, #00F2FF, #0088aa)", color: "#0a0e17" }}>
            {downloading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
              : <><Download className="w-4 h-4" /> Download PDF</>
            }
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}