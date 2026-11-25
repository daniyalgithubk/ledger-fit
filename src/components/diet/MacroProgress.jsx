import { motion } from "framer-motion";
import ProgressRing from "../ui/ProgressRing";
import AnimatedNumber from "../ui/AnimatedNumber";

function Bar({ label, value, target, color, index }) {
  const pct = target > 0 ? Math.min(100, (value / target) * 100) : 0;
  const over = target > 0 && value > target;

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <p className="text-xs font-semibold text-slate-300">{label}</p>
        <p className="text-xs text-slate-500">
          <span className={`font-bold ${over ? "text-orange-400" : "text-white"}`}>{value}</span> / {target} g
        </p>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <motion.div
          className={`h-full rounded-full ${over ? "bg-orange-500" : color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay: 0.2 + index * 0.1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export default function MacroProgress({ targets, totals }) {
  if (!targets) return null;

  const left = targets.kcal - totals.calories;
  const over = left < 0;

  return (
    <div className="lf-card p-5 sm:p-6">
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-400">Today</p>
      <h3 className="mb-5 mt-1 text-lg font-bold text-white">Daily progress</h3>

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
        <ProgressRing value={totals.calories} max={targets.kcal} color={over ? "#f97316" : "#3b82f6"}>
          <p className="text-2xl font-extrabold tabular-nums text-white">
            <AnimatedNumber value={Math.abs(left)} />
          </p>
          <p className="text-[11px] text-slate-400">{over ? "kcal over" : "kcal left"}</p>
        </ProgressRing>

        <div className="w-full flex-1 space-y-4">
          <div className="flex justify-between text-xs text-slate-400">
            <span>
              Eaten <b className="text-white">{totals.calories}</b> kcal
            </span>
            <span>
              Target <b className="text-white">{targets.kcal}</b> kcal
            </span>
          </div>
          <Bar label="Protein" value={totals.protein} target={targets.protein} color="bg-cyan-400" index={0} />
          <Bar label="Carbs" value={totals.carbs} target={targets.carbs} color="bg-emerald-400" index={1} />
          <Bar label="Fat" value={totals.fat} target={targets.fat} color="bg-yellow-400" index={2} />
        </div>
      </div>
    </div>
  );
}