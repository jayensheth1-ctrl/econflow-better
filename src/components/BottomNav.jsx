import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { announce } from "../lib/a11y";
import { Map, Trophy, User, ShoppingCart, FlaskConical, Bot, BookOpen } from "lucide-react";

const navItems = [
  { path: "/", icon: Map, label: "Learn" },
  { path: "/leaderboard", icon: Trophy, label: "Ranks" },
  { path: "/lab", icon: FlaskConical, label: "Lab" },
  { path: "/mascot", icon: Bot, label: "Buddy" },
  { path: "/shop", icon: ShoppingCart, label: "Shop" },
  { path: "/knowledge", icon: BookOpen, label: "Wiki" },
  { path: "/profile", icon: User, label: "Me" },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  // A/D keyboard navigation between main tabs
  useEffect(() => {
    const paths = navItems.map(n => n.path);
    const labels = navItems.map(n => n.label);
    const onKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      const cur = paths.indexOf(location.pathname);
      if (e.key === "d" || e.key === "D") {
        const next = (cur + 1) % paths.length;
        navigate(paths[next]);
        announce(`Navigated to ${labels[next]}`);
      } else if (e.key === "a" || e.key === "A") {
        const prev = (cur - 1 + paths.length) % paths.length;
        navigate(paths[prev]);
        announce(`Navigated to ${labels[prev]}`);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [location.pathname, navigate]);

  // Announce page on route change
  useEffect(() => {
    const item = navItems.find(n => n.path === location.pathname);
    if (item) announce(`${item.label} page`);
  }, [location.pathname]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card/90 backdrop-blur-md border-t border-border shadow-lg">
      <div className="max-w-lg mx-auto flex items-center justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {navItems.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all duration-200 ${
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon
                aria-hidden="true"
                className={`w-6 h-6 transition-transform duration-200 ${active ? "scale-110" : ""}`}
                strokeWidth={active ? 2.5 : 2}
              />
              <span className="text-[11px] font-semibold">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}