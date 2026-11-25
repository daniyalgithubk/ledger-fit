import { motion } from "framer-motion";
import { Dumbbell, Moon } from "lucide-react";
import { useFitnessStore } from "../../zustand/store/useFitnessStore";

const GeneratedPlan = () => {
  const plan = useFitnessStore((state) => state.plan);
  if (!plan) return null;

  return (
    <section className="lf-card p-5 sm:p-7">
      <div className="mb-6">
        <h2 className="text-xl font-extrabold text-white">Your weekly plan</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {[plan.goal, plan.level, plan.duration, plan.split].map((tag) => (
            <span key={tag} className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-200">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {plan.schedule.map((item, i) => (
          <motion.div
            key={item.day}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className={`rounded-xl border p-5 ${
              item.isRest ? "border-white/5 bg-slate-900/30" : "border-white/10 bg-slate-900/60"
            }`}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-white">{item.day}</h3>
              {item.isRest ? (
                <Moon className="h-4 w-4 text-slate-500" />
              ) : (
                <span className="rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-400/20 px-3 py-1 text-xs font-bold text-cyan-200">
                  {item.type}
                </span>
              )}
            </div>

            {item.isRest ? (
              <p className="text-xs text-slate-500">Rest and recover.</p>
            ) : (
              <ul className="space-y-2.5">
                {item.exercises.map((exercise) => (
                  <li key={exercise.name} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-200">
                      <Dumbbell className="h-3.5 w-3.5 text-blue-400" />
                      {exercise.name}
                    </span>
                    <span className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-slate-400">
                      {exercise.sets} × {exercise.reps}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default GeneratedPlan;