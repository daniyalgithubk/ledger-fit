import { Link } from "react-router-dom";
import { Dumbbell } from "lucide-react";

const explore = [
  ["Plan", "/plan"],
  ["Week", "/week"],
  ["Zones", "/zones"],
  ["Diet", "/diet"],
];
const account = [
  ["Profile", "/profile"],
  ["My Progress", "/progress"],
  ["Settings", "/settings"],
];

const Column = ({ title, links }) => (
  <div>
    <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">{title}</p>
    <ul className="mt-3 space-y-2">
      {links.map(([label, to]) => (
        <li key={to}>
          <Link to={to} className="text-sm text-slate-400 transition hover:text-white">
            {label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => (
  <footer className="border-t border-white/5 bg-[#040b16]">
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
      <div>
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400">
            <Dumbbell className="h-4 w-4 text-white" />
          </span>
          <span className="text-lg font-extrabold">
            Ledger<span className="text-blue-400">/Fit</span>
          </span>
        </div>
        <p className="mt-3 max-w-xs text-sm leading-6 text-slate-500">
          Your numbers decide your training zone, your week and your plate.
        </p>
      </div>
      <Column title="Explore" links={explore} />
      <Column title="Account" links={account} />
    </div>

    <div className="border-t border-white/5">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-[11px] text-slate-600 sm:flex-row sm:justify-between sm:px-6">
        <p>© {new Date().getFullYear()} Ledger/Fit</p>
        <p>General guidance only, not medical advice.</p>
      </div>
    </div>
  </footer>
);

export default Footer;