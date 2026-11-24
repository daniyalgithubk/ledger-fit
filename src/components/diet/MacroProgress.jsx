function Bar({ label, value, target, unit, color }) {
  const pct = target > 0 ? Math.min(100, Math.round((value / target) * 100)) : 0;
  const over = target > 0 && value > target;

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <p className="text-xs font-semibold text-slate-300">{label}</p>
        <p className="text-xs text-slate-500">
          <span className={`font-bold ${over ? "text-orange-400" : "text-white"}`}>
            {value}
          </span>{" "}
          / {target} {unit}
        </p>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className={`h-full rounded-full transition-all ${over ? "bg-orange-500" : color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function MacroProgress({ targets, totals }) {
  if (!targets) return null;

  return (
    <div className="lf-card p-5 sm:p-6">
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-400">
        Today
      </p>
      <h3 className="mb-5 mt-1 text-lg font-bold text-white">Daily progress</h3>

      <div className="space-y-4">
        <Bar label="Calories" value={totals.calories} target={targets.kcal} unit="kcal" color="bg-blue-500" />
        <Bar label="Protein" value={totals.protein} target={targets.protein} unit="g" color="bg-cyan-400" />
        <Bar label="Carbs" value={totals.carbs} target={targets.carbs} unit="g" color="bg-green-400" />
        <Bar label="Fat" value={totals.fat} target={targets.fat} unit="g" color="bg-yellow-400" />
      </div>
    </div>
  );
}