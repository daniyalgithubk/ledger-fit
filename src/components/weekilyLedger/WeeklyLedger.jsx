import { motion } from "framer-motion";
import { Moon } from "lucide-react";
import { useFitnessStore } from "../../zustand/store/useFitnessStore";
import { workoutPlans } from "../data/workoutPlans";

const ZONE = {
  Build: { chip: "bg-pink-500/10 text-pink-300 border-pink-500/20", dot: "bg-pink-400" },
  Strength: { chip: "bg-pink-500/10 text-pink-300 border-pink-500/20", dot: "bg-pink-400" },
  Endurance: { chip: "bg-lime-400/10 text-lime-300 border-lime-400/20", dot: "bg-lime-400" },
  Recovery: { chip: "bg-cyan-400/10 text-cyan-300 border-cyan-400/20", dot: "bg-cyan-400" },
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const row = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const WeeklyLedger = () => {
  const bmiCategory = useFitnessStore((s) => s.bmiCategory);
  const workouts = workoutPlans[bmiCategory] || workoutPlans.Normal;
  const today = (new Date().getDay() + 6) % 7;

  return (
    <div className="lf-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 px-5 py-4">
        <p className="text-sm font-semibold text-white">
          {bmiCategory ? `Plan for BMI: ${bmiCategory}` : "General weekly plan"}
        </p>
        {!bmiCategory && (
          <p className="text-xs text-slate-500">Enter your vitals to personalise this week.</p>
        )}
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
      >
        {workouts.map((item, i) => {
          const isRest = item.workout === "Rest";
          const zone = ZONE[item.zone] || ZONE.Recovery;
          const isToday = i === today;

          return (
            <motion.div
              key={item.day}
              variants={row}
              className={`grid grid-cols-[56px_1fr_auto] items-center gap-4 px-5 py-4 ${
                i !== workouts.length - 1 ? "border-b border-white/5" : ""
              } ${isToday ? "bg-blue-500/[0.07]" : ""} ${isRest ? "opacity-70" : ""}`}
            >
              <div>
                <p className={`text-sm font-bold ${isToday ? "text-cyan-300" : "text-slate-300"}`}>
                  {item.day}
                </p>
                {isToday && (
                  <span className="mt-1 inline-block rounded bg-cyan-400/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-cyan-300">
                    Today
                  </span>
                )}
              </div>

              <div className="min-w-0">
                <p className="flex items-center gap-2 truncate font-semibold text-white">
                  {isRest && <Moon className="h-3.5 w-3.5 shrink-0 text-slate-400" />}
                  {item.workout}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {isRest ? "Recover and refuel" : `${item.sets} · ${item.time}`}
                </p>
              </div>

              <div className="flex flex-col items-end gap-1.5">
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${zone.chip}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${zone.dot}`} />
                  {item.zone}
                </span>
                <span className="text-xs text-slate-400">
                  {isRest ? "—" : <><b className="text-white">{item.calories}</b> kcal</>}
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default WeeklyLedger;