import { useState, useRef, useEffect } from "react";
import {
  Menu,
  X,
  ChevronDown,
  UserRound,
  Settings,
  BarChart3,
  LogOut,
  LogIn,
} from "lucide-react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../zustand/store/useAuthStore"; // adjust the path

const navLinks = ["Plan", "Week", "Zones"];

// "Daniyal Khan" -> "DK", "daniyal" -> "D"
const getInitials = (name) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const menuRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // Auth state
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const logout = useAuthStore((state) => state.logout);

  // Derived display values (only meaningful when user exists)
  const displayName = user
    ? user.displayName || user.email.split("@")[0]
    : "";
  const initials = user ? getInitials(displayName) : "";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }

      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
    <nav className="lf-navbar text-white">
      {/* ===================================================== */}
      {/* NAVBAR CONTAINER */}
      {/* ===================================================== */}

      <div
        ref={menuRef}
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6"
      >
        {/* ===================================================== */}
        {/* LOGO */}
        {/* ===================================================== */}

        <Link
          to="/"
          onClick={() => {
            setIsOpen(false);
            setIsProfileOpen(false);
          }}
          className="lf-logo"
        >
          Ledger<span className="text-blue-500">/Fit</span>
        </Link>

        {/* ===================================================== */}
        {/* DESKTOP NAVIGATION */}
        {/* ===================================================== */}

        <div className="hidden items-center gap-7 sm:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link}
              to={`/${link.toLowerCase()}`}
              className={({ isActive }) =>
                `lf-nav-link px-2 py-2 text-sm font-medium ${
                  isActive ? "lf-nav-link-active" : ""
                }`
              }
            >
              {link}
            </NavLink>
          ))}
        </div>

        {/* ===================================================== */}
        {/* RIGHT SIDE */}
        {/* ===================================================== */}

        <div className="flex items-center gap-2">
          {/* Start Ledger */}

          <Link to="/ledger" className="lf-button rounded-xl px-4 py-2 text-sm">
            Start ledger
          </Link>

          {/* ================================================= */}
          {/* PROFILE (logged in) / LOG IN (guest) */}
          {/* ================================================= */}

          {loading ? (
            // Firebase hasn't answered yet: show a placeholder so the
            // navbar doesn't flash "Log in" for a logged-in user
            <div className="hidden h-12 w-12 animate-pulse rounded-xl bg-white/5 sm:block" />
          ) : !user ? (
            <Link
              to="/login"
              className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-blue-500/30 hover:bg-white/[0.06] sm:flex"
            >
              <LogIn className="h-4 w-4" />
              Log in
            </Link>
          ) : (
            <div ref={profileRef} className="relative hidden sm:block">
              {/* Profile Button */}

              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                aria-label="Open profile menu"
                aria-expanded={isProfileOpen}
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.03]
                  px-2
                  py-1.5
                  transition
                  hover:border-blue-500/30
                  hover:bg-white/[0.06]
                "
              >
                {/* Avatar */}

                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    bg-gradient-to-br
                    from-blue-500
                    to-cyan-400
                    text-xs
                    font-bold
                    text-white
                    shadow-lg
                    shadow-blue-500/10
                  "
                >
                  {initials}
                </div>

                {/* User Information */}

                <div className="hidden text-left lg:block">
                  <p className="max-w-[120px] truncate text-xs font-semibold text-white">
                    {displayName}
                  </p>

                  <p className="max-w-[120px] truncate text-[10px] text-slate-500">
                    {user.email}
                  </p>
                </div>

                {/* Arrow */}

                <ChevronDown
                  className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* ================================================= */}
              {/* PROFILE DROPDOWN */}
              {/* ================================================= */}

              <div
                className={`
                  absolute
                  right-0
                  top-[calc(100%+10px)]
                  z-50
                  w-64
                  origin-top-right
                  rounded-2xl
                  border
                  border-white/10
                  bg-[#061525]/95
                  p-2
                  shadow-2xl
                  shadow-black/40
                  backdrop-blur-xl
                  transition-all
                  duration-200
                  ${
                    isProfileOpen
                      ? "visible scale-100 opacity-100"
                      : "invisible scale-95 opacity-0"
                  }
                `}
              >
                {/* Profile Header */}

                <div className="mb-2 flex items-center gap-3 rounded-xl bg-white/[0.03] p-3">
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-gradient-to-br
                      from-blue-500
                      to-cyan-400
                      text-sm
                      font-bold
                      text-white
                    "
                  >
                    {initials}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {displayName}
                    </p>

                    <p className="truncate text-xs text-slate-500">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Divider */}

                <div className="my-2 h-px bg-white/5" />

                {/* Profile */}

                <Link
                  to="/profile"
                  onClick={() => setIsProfileOpen(false)}
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-2.5
                    text-sm
                    text-slate-300
                    transition
                    hover:bg-white/5
                    hover:text-white
                  "
                >
                  <UserRound className="h-4 w-4 text-slate-500" />

                  <span>Profile</span>
                </Link>

                {/* My Progress */}

                <Link
                  to="/progress"
                  onClick={() => setIsProfileOpen(false)}
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-2.5
                    text-sm
                    text-slate-300
                    transition
                    hover:bg-white/5
                    hover:text-white
                  "
                >
                  <BarChart3 className="h-4 w-4 text-slate-500" />

                  <span>My Progress</span>
                </Link>

                {/* Settings */}

                <Link
                  to="/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-2.5
                    text-sm
                    text-slate-300
                    transition
                    hover:bg-white/5
                    hover:text-white
                  "
                >
                  <Settings className="h-4 w-4 text-slate-500" />

                  <span>Settings</span>
                </Link>

                {/* Divider */}

                <div className="my-2 h-px bg-white/5" />

                {/* Logout */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-2.5
                    text-sm
                    text-red-400
                    transition
                    hover:bg-red-500/10
                    hover:text-red-300
                  "
                >
                  <LogOut className="h-4 w-4" />

                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}

          {/* ================================================= */}
          {/* MOBILE MENU BUTTON */}
          {/* ================================================= */}

          <button
            onClick={() => {
              setIsOpen(!isOpen);
              setIsProfileOpen(false);
            }}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-white/10
              bg-white/5
              transition
              hover:bg-white/10
              sm:hidden
            "
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ===================================================== */}
      {/* MOBILE MENU */}
      {/* ===================================================== */}

      <div
        className={`overflow-hidden transition-all duration-300 sm:hidden ${
          isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-white/10 bg-[#031221]/95 px-4 py-3 backdrop-blur-xl">
          {/* Navigation */}

          {navLinks.map((link) => (
            <NavLink
              key={link}
              to={`/${link.toLowerCase()}`}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `mb-1 block rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-500/10 text-blue-400"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              {link}
            </NavLink>
          ))}

          {/* ================================================= */}
          {/* MOBILE PROFILE */}
          {/* ================================================= */}

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
                {/* User Info */}

                <div className="mb-2 flex items-center gap-3 rounded-xl bg-white/[0.03] p-3">
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-gradient-to-br
                      from-blue-500
                      to-cyan-400
                      text-xs
                      font-bold
                      text-white
                    "
                  >
                    {initials}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {displayName}
                    </p>

                    <p className="truncate text-[11px] text-slate-500">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Mobile Profile */}

                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    px-4
                    py-3
                    text-sm
                    text-slate-300
                    transition
                    hover:bg-white/5
                    hover:text-white
                  "
                >
                  <UserRound className="h-4 w-4 text-slate-500" />
                  Profile
                </Link>

                {/* Mobile Progress */}

                <Link
                  to="/progress"
                  onClick={() => setIsOpen(false)}
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    px-4
                    py-3
                    text-sm
                    text-slate-300
                    transition
                    hover:bg-white/5
                    hover:text-white
                  "
                >
                  <BarChart3 className="h-4 w-4 text-slate-500" />
                  My Progress
                </Link>

                {/* Mobile Settings */}

                <Link
                  to="/settings"
                  onClick={() => setIsOpen(false)}
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    px-4
                    py-3
                    text-sm
                    text-slate-300
                    transition
                    hover:bg-white/5
                    hover:text-white
                  "
                >
                  <Settings className="h-4 w-4 text-slate-500" />
                  Settings
                </Link>

                {/* Mobile Logout */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    px-4
                    py-3
                    text-sm
                    text-red-400
                    transition
                    hover:bg-red-500/10
                    hover:text-red-300
                  "
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;