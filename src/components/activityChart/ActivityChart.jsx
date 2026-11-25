import { motion } from "framer-motion";
import { Flame, CalendarCheck, Activity } from "lucide-react";
import { useFitnessStore } from "../../zustand/store/useFitnessStore";
import { workoutPlans } from "../../data/workoutPlans";

const Stat = ({ icon: Icon, label, value, color }) => (
  <div className="rounded-xl border border-white/5 bg-slate-900/60 p-4">
    <Icon className={`mb-2 h-4 w-4 ${color}`} />
    <p className="text-xs text-slate-400">{label}</p>
    <p className="mt-1 text-xl font-extrabold tabular-nums text-white">{value}</p>
  </div>
);

export default function ActivityChart() {
  const category = useFitnessStore((s) => s.bmiCategory);
  const plan = workoutPlans[category] || workoutPlans.Normal;

  const data = plan.map((d) => ({
    day: d.day,
    name: d.workout,
    kcal: parseInt(d.calories, 10) || 0,
  }));

  const max = Math.max(...data.map((d) => d.kcal), 1);
  const total = data.reduce((t, d) => t + d.kcal, 0);
  const active = data.filter((d) => d.kcal > 0).length;
  const avg = active ? Math.round(total / active) : 0;
  const today = (new Date().getDay() + 6) % 7;

  return (
    <div className="lf-card p-5 sm:p-6">
      <div className="grid grid-cols-3 gap-3">
        <Stat icon={Flame} label="Weekly burn" value={`${total.toLocaleString()} kcal`} color="text-orange-400" />
        <Stat icon={CalendarCheck} label="Active days" value={`${active} / 7`} color="text-emerald-400" />
        <Stat icon={Activity} label="Avg per session" value={`${avg} kcal`} color="text-blue-400" />
      </div>

      <div className="mt-8 flex h-44 items-end gap-2 sm:gap-4">
        {data.map((d, i) => {
          const pct = d.kcal ? Math.max(8, (d.kcal / max) * 100) : 0;
          const isToday = i === today;
          return (
            <div key={d.day} className="group flex h-full flex-1 items-end" title={`${d.name}: ${d.kcal} kcal`}>
              {d.kcal ? (
                <motion.div
                  className={`relative w-full rounded-t-lg ${
                    isToday
                      ? "bg-gradient-to-t from-blue-500 to-cyan-400 shadow-[0_0_24px_-4px_rgba(34,211,238,0.6)]"
                      : "bg-gradient-to-t from-blue-500/30 to-blue-400/50 group-hover:from-blue-500/50 group-hover:to-blue-400/70"
                  }`}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.07, ease: "easeOut" }}
                >
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-slate-300">
                    {d.kcal}
                  </span>
                </motion.div>
              ) : (
                <div className="h-1 w-full rounded-full bg-slate-700/60" />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex gap-2 sm:gap-4">
        {data.map((d, i) => (
          <div
            key={d.day}
            className={`flex-1 text-center text-[11px] font-semibold tracking-wider ${
              i === today ? "text-cyan-300" : "text-slate-500"
            }`}
          >
            {d.day}
          </div>
        ))}
      </div>

      {!category && (
        <p className="mt-5 text-xs text-slate-500">
          Showing a general plan. Enter your vitals to personalise it.
        </p>
      )}
    </div>
  );
}