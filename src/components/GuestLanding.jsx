const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { motion } from "framer-motion";
import { LogIn, Zap } from "lucide-react";
import { initGuest } from "../lib/guestProgress";

import EconBuddy from "./EconBuddy";

export default function GuestLanding({ onGuestStart }) {
  function handleGuest() {
    initGuest();
    onGuestStart();
  }

  function handleLogin() {
    db.auth.redirectToLogin(window.location.href);
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center px-6"
      style={{ background: "linear-gradient(160deg, #0A0E17 0%, #0d1b2a 60%, #0a1628 100%)" }}>

      {/* Floating sticker bg */}
      {["💰","📈","💎","🪙","📊","💵","🚀","⭐"].map((e, i) => (
        <div key={i} className="fixed select-none pointer-events-none text-3xl"
          style={{ left: `${(i * 13 + 5) % 90}%`, top: `${(i * 11 + 8) % 85}%`, opacity: 0.06 }}>
          {e}
        </div>
      ))}

      <div className="w-full max-w-sm flex flex-col items-center gap-6 z-10">
        {/* Logo / mascot */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ filter: "drop-shadow(0 0 24px rgba(0,242,255,0.5))" }}
        >
          <EconBuddy config={{ helmet: "basic", eyes: "cyan", outfit: "midnight", accessory: "none" }} size={100} />
        </motion.div>

        <div className="text-center">
          <h1 className="text-3xl font-black" style={{ color: "#00F2FF", textShadow: "0 0 20px #00F2FF66" }}>
            EconBuddy
          </h1>
          <p className="text-sm mt-1" style={{ color: "rgba(0,242,255,0.6)" }}>
            Learn Finance. Level Up. Get Rich (in knowledge).
          </p>
        </div>

        <div className="w-full flex flex-col gap-3">
          {/* Play as Guest */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleGuest}
            className="w-full py-4 rounded-2xl font-extrabold text-lg flex items-center justify-center gap-3"
            style={{
              background: "linear-gradient(135deg, #00F2FF, #007799)",
              color: "#0A0E17",
              boxShadow: "0 0 28px rgba(0,242,255,0.45), 0 5px 0 #005566",
            }}
          >
            <Zap className="w-5 h-5" />
            Play as Guest
          </motion.button>

          <p className="text-center text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>
            No account needed · Progress saved in this browser
          </p>

          {/* Log In */}
          <button
            onClick={handleLogin}
            className="w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1.5px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            <LogIn className="w-4 h-4" />
            Log In / Create Account
          </button>
        </div>

        <p className="text-[10px] text-center" style={{ color: "rgba(255,255,255,0.2)" }}>
          Log in to sync progress across all your devices
        </p>
      </div>
    </div>
  );
}