import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu, X, ChevronDown, UserRound, Settings, BarChart3, LogOut, LogIn, Dumbbell,
} from "lucide-react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../zustand/store/useAuthStore";

const navLinks = ["Plan", "Week", "Zones", "Diet"];

const menuItems = [
  { to: "/profile", label: "Profile", icon: UserRound },
  { to: "/progress", label: "My Progress", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

const getInitials = (name) =>
  name.trim().split(/\s+/).slice(0, 2).map((p) => p.charAt(0).toUpperCase()).join("");

const Avatar = ({ initials, className = "h-9 w-9" }) => (
  <div
    className={`flex ${className} shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-xs font-bold text-white shadow-lg shadow-blue-500/20`}
  >
    {initials}
  </div>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const logout = useAuthStore((s) => s.logout);

  const displayName = user ? user.displayName || user.email.split("@")[0] : "";
  const initials = user ? getInitials(displayName) : "";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onDown = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setIsOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setIsProfileOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const handleLogout = async () => {
    setIsProfileOpen(false);
    setIsOpen(false);
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav
      ref={navRef}
      className={`sticky top-0 z-50 border-b text-white transition-all duration-300 ${
        scrolled
          ? "border-white/10 bg-[#050d1a]/85 shadow-lg shadow-black/30 backdrop-blur-xl"
          : "border-transparent bg-[#050d1a]/40 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link
          to="/"
          onClick={() => { setIsOpen(false); setIsProfileOpen(false); }}
          className="flex items-center gap-2"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/30">
            <Dumbbell className="h-4 w-4 text-white" />
          </span>
          <span className="text-lg font-extrabold tracking-tight">
            Ledger<span className="text-blue-400">/Fit</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 sm:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link}
              to={`/${link.toLowerCase()}`}
              className={({ isActive }) =>
                `relative px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive ? "text-white" : "text-slate-400 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-blue-400 to-cyan-300"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <Link to="/ledger" className="lf-button px-4 py-2 text-sm">
            Start ledger
          </Link>

          {loading ? (
            <div className="hidden h-11 w-11 animate-pulse rounded-xl bg-white/5 sm:block" />
          ) : !user ? (
            <Link to="/login" className="lf-ghost hidden px-4 py-2.5 text-sm sm:flex">
              <LogIn className="h-4 w-4" />
              Log in
            </Link>
          ) : (
            <div ref={profileRef} className="relative hidden sm:block">
              <button
                onClick={() => setIsProfileOpen((o) => !o)}
                aria-label="Open profile menu"
                aria-expanded={isProfileOpen}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-2 py-1.5 transition hover:border-blue-500/30 hover:bg-white/[0.06]"
              >
                <Avatar initials={initials} />
                <div className="hidden text-left lg:block">
                  <p className="max-w-[120px] truncate text-xs font-semibold text-white">{displayName}</p>
                  <p className="max-w-[120px] truncate text-[10px] text-slate-500">{user.email}</p>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-[calc(100%+10px)] z-50 w-64 origin-top-right rounded-2xl border border-white/10 bg-[#061525]/95 p-2 shadow-2xl shadow-black/50 backdrop-blur-xl"
                  >
                    <div className="mb-2 flex items-center gap-3 rounded-xl bg-white/[0.03] p-3">
                      <Avatar initials={initials} className="h-11 w-11" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">{displayName}</p>
                        <p className="truncate text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>

                    {menuItems.map(({ to, label, icon: Icon }) => (
                      <Link
                        key={to}
                        to={to}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                      >
                        <Icon className="h-4 w-4 text-slate-500" />
                        {label}
                      </Link>
                    ))}

                    <div className="my-2 h-px bg-white/5" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Mobile button */}
          <button
            onClick={() => { setIsOpen((o) => !o); setIsProfileOpen(false); }}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition hover:bg-white/10 sm:hidden"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden sm:hidden"
          >
            <div className="border-t border-white/10 bg-[#031221]/95 px-4 py-3 backdrop-blur-xl">
              {navLinks.map((link) => (
                <NavLink
                  key={link}
                  to={`/${link.toLowerCase()}`}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `mb-1 block rounded-xl px-4 py-3 text-sm font-medium transition ${
                      isActive ? "bg-blue-500/10 text-blue-400" : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`
                  }
                >
                  {link}
                </NavLink>
              ))}

              <div className="mt-3 border-t border-white/10 pt-3">
                {loading ? (
                  <div className="h-14 animate-pulse rounded-xl bg-white/5" />
                ) : !user ? (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-blue-400 transition hover:bg-white/5"
                  >
                    <LogIn className="h-4 w-4" />
                    Log in
                  </Link>
                ) : (
                  <>
                    <div className="mb-2 flex items-center gap-3 rounded-xl bg-white/[0.03] p-3">
                      <Avatar initials={initials} className="h-10 w-10" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">{displayName}</p>
                        <p className="truncate text-[11px] text-slate-500">{user.email}</p>
                      </div>
                    </div>

                    {menuItems.map(({ to, label, icon: Icon }) => (
                      <Link
                        key={to}
                        to={to}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                      >
                        <Icon className="h-4 w-4 text-slate-500" />
                        {label}
                      </Link>
                    ))}

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;