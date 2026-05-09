const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useState, useEffect } from "react";
import { Trophy, Medal, Flame, UserX, WifiOff } from "lucide-react";

import { isGuestMode, getGuestProgress } from "../lib/guestProgress";
import { getUsername } from "../lib/usernameStore";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myEmail, setMyEmail] = useState(null);
  const [networkError, setNetworkError] = useState(false);
  const guestMode = isGuestMode();
  const guestProgress = guestMode ? getGuestProgress() : null;

  useEffect(() => {
    loadLeaderboard();
  }, []);

  async function loadLeaderboard() {
    try {
      const me = guestMode ? null : await db.auth.me().catch(() => null);
      const records = await db.entities.UserProgress.list("-xp", 20);
      setUsers(records);
      setMyEmail(me?.email ?? null);
      setNetworkError(false);
    } catch {
      setNetworkError(true);
    } finally {
      setLoading(false);
    }
  }

  // ── Offline / error fallback ─────────────────────────────────────────────
  if (!loading && networkError) {
    const g = guestProgress;
    return (
      <div className="max-w-lg mx-auto px-4 py-8 flex flex-col items-center gap-5">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <WifiOff className="w-5 h-5" />
          <p className="text-sm font-semibold">Can't reach the server right now</p>
        </div>

        {g ? (
          <div
            className="w-full rounded-2xl p-6 text-center"
            style={{
              background: "linear-gradient(135deg, rgba(147,51,234,0.18), rgba(79,0,180,0.12))",
              border: "2px solid rgba(147,51,234,0.45)",
              boxShadow: "0 0 40px rgba(147,51,234,0.2)",
            }}
          >
            <div className="text-5xl mb-3">🏆</div>
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "rgba(192,132,252,0.7)" }}>
              Your Personal Best
            </p>
            <p className="text-2xl font-extrabold text-foreground mb-4">{g.guestName ?? "You (Guest)"}</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "XP", value: g.xp ?? 0, emoji: "⭐" },
                { label: "Gems", value: g.gems ?? 0, emoji: "💎" },
                { label: "Streak", value: g.streak ?? 0, emoji: "🔥" },
              ].map(s => (
                <div key={s.label} className="rounded-xl py-3"
                  style={{ background: "rgba(147,51,234,0.12)", border: "1px solid rgba(147,51,234,0.25)" }}>
                  <p className="text-xl font-black text-foreground">{s.emoji} {s.value}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4">Sign in to post your score to the global leaderboard!</p>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No local data available. Try again later.</p>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // Build the display list: top 10 global + guest row
  const myRank = myEmail ? users.findIndex(u => u.created_by === myEmail) + 1 : 0;

  // Compute where guest would rank globally
  const guestXp = guestProgress?.xp ?? 0;
  const guestLocalRank = guestMode && guestProgress
    ? users.filter(u => (u.xp ?? 0) > guestXp).length + 1
    : null;

  // Guest row to append at the bottom
  const guestRow = guestMode && guestProgress ? {
    id: "guest-local",
    created_by: guestProgress.guestName ?? "You (Guest)",
    xp: guestXp,
    streak: guestProgress.streak ?? 0,
    isGuest: true,
    localRank: guestLocalRank,
  } : null;

  const displayList = guestRow ? [...users, guestRow] : users;

  return (
    <div className="max-w-lg mx-auto px-4 py-4">
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-3">
          <Trophy className="w-9 h-9 text-accent" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-extrabold text-foreground">Leaderboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Top learners this week</p>
      </div>

      {/* Guest banner */}
      {guestMode && (
        <div className="flex items-start gap-2 mb-4 px-3 py-2.5 rounded-xl"
          style={{
            background: "rgba(147,51,234,0.08)",
            border: "1px solid rgba(147,51,234,0.25)",
          }}>
          <UserX className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#C084FC" }} />
          <p className="text-xs leading-relaxed" style={{ color: "rgba(192,132,252,0.85)" }}>
            You are viewing global leaders in Guest Mode. <strong>Sign in to post your score to the leaderboard!</strong>
          </p>
        </div>
      )}

      <ol className="flex flex-col gap-2.5" aria-label="Leaderboard rankings">
        {displayList.map((user, i) => {
          const rank = i + 1;
          const isGuest = !!user.isGuest;
          const isMe = !isGuest && myEmail && user.created_by === myEmail;
          const savedUsername = getUsername();
          const name = isGuest
            ? (user.created_by ?? "You (Guest)")
            : (isMe && savedUsername)
              ? savedUsername
              : (user.created_by?.split("@")[0] || `Learner ${rank}`);

          const ariaLabel = isGuest
            ? `You (Guest Mode), local rank ${rank}: ${user.xp} XP, ${user.streak} day streak. Sign in to appear on the global leaderboard.`
            : isMe
              ? `This is you! Rank ${rank}: ${name}, ${user.xp} XP, ${user.streak} day streak.`
              : `Rank ${rank}: ${name}, ${user.xp} XP, ${user.streak} day streak`;

          return (
            <li
              key={user.id}
              tabIndex={0}
              aria-label={ariaLabel}
              className={`
                flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all outline-none
                focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1
                ${isMe ? "ring-2 ring-primary ring-offset-1" : ""}
                ${isGuest
                  ? "border-dashed"
                  : i === 0 ? "border-accent bg-accent/5"
                  : i === 1 ? "border-gray-300 bg-gray-50 dark:bg-gray-900"
                  : i === 2 ? "border-amber-700/30 bg-amber-50 dark:bg-amber-950/20"
                  : "border-border bg-card"}
              `}
              style={isGuest ? {
                borderColor: "rgba(147,51,234,0.4)",
                background: "rgba(147,51,234,0.06)",
              } : {}}
            >
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm flex-shrink-0
                ${isGuest ? "" :
                  i === 0 ? "bg-accent text-accent-foreground" :
                  i === 1 ? "bg-gray-300 text-gray-700" :
                  i === 2 ? "bg-amber-700 text-white" :
                  "bg-muted text-muted-foreground"}
              `}
              style={isGuest ? { background: "rgba(147,51,234,0.2)", color: "#C084FC" } : {}}
              aria-hidden="true">
                {isGuest ? "👤" : rank}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-foreground flex items-center gap-1.5 flex-wrap">
                  {name}
                  {isMe && (
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-primary/15 text-primary">YOU</span>
                  )}
                  {isGuest && (
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full"
                      style={{ background: "rgba(147,51,234,0.15)", color: "#C084FC" }}>
                      GUEST
                    </span>
                  )}
                </p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-muted-foreground font-medium" aria-hidden="true">
                    {user.xp} XP
                  </span>
                  <span className="flex items-center gap-0.5 text-xs text-orange-500 font-medium" aria-hidden="true">
                    <Flame className="w-3 h-3" aria-hidden="true" />
                    {user.streak}
                  </span>
                  {isGuest && user.localRank && (
                    <span className="text-[10px] font-bold" style={{ color: "#C084FC" }}>
                      ~#{user.localRank} globally
                    </span>
                  )}
                </div>
              </div>

              {!isGuest && i < 3 && (
                <Medal
                  aria-hidden="true"
                  className={`w-6 h-6 flex-shrink-0 ${
                    i === 0 ? "text-accent" : i === 1 ? "text-gray-400" : "text-amber-700"
                  }`}
                />
              )}
            </li>
          );
        })}

        {displayList.length === 0 && (
          <li className="text-center py-12 text-muted-foreground">
            <p className="font-medium">No learners yet. Be the first!</p>
          </li>
        )}
      </ol>
    </div>
  );
}