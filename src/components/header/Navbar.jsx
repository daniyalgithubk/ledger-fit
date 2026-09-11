import { useState, useRef, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const navLinks = ["Plan", "Week", "Zones"];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-black text-white" ref={menuRef}>
      <div className="flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link
  to="/"
  onClick={() => setIsOpen(false)}
  className="text-xl font-bold mobile-m:text-2xl"
>
  Ledger/Fit
</Link>

        {/* Desktop Navigation */}
        <div className="hidden sm:absolute sm:left-1/2 sm:flex sm:-translate-x-1/2 sm:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link}
              to={`/${link.toLowerCase()}`}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-medium text-gray-200 transition hover:bg-white/10 hover:text-white"
            >
              {link}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button className="rounded-lg bg-blue-500 px-3 py-2 text-sm font-semibold transition hover:bg-blue-600 mobile-m:px-4 mobile-m:text-base">
            Start ledger
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-white transition hover:bg-white/10 sm:hidden"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Panel - now floats OVER the page, so the blur has something to blur */}
      <div
        className={`absolute left-0 right-0 top-full overflow-hidden transition-all duration-300 ease-in-out sm:hidden ${
          isOpen
            ? "max-h-60 border-t border-white/10 opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="relative bg-black/40 backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-blue-500/20 to-transparent" />

          <div className="relative flex flex-col px-4 py-2">
            {navLinks.map((link) => (
              <button
                key={link}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-medium text-gray-200 transition hover:bg-white/10 hover:text-white"
              >
                {link}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
