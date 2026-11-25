import Reveal from "./Reveal";

export default function SectionCard({ icon: Icon, title, text, color = "text-blue-400", bg = "bg-blue-500/10", badge, children }) {
  return (
    <Reveal className="mx-auto mb-6 w-full max-w-4xl">
      <div className="lf-card p-5 sm:p-7">
        <div className="mb-6 flex items-center gap-3">
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${bg}`}>
            <Icon className={`h-5 w-5 ${color}`} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-white">{title}</h2>
            <p className="text-sm text-slate-400">{text}</p>
          </div>
          {badge && (
            <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-300">
              {badge}
            </span>
          )}
        </div>
        {children}
      </div>
    </Reveal>
  );
}