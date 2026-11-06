import { Dumbbell, Moon } from "lucide-react";
import { useFitnessStore } from "../../zustand/store/useFitnessStore";

const GeneratedPlan = () => {
  const plan = useFitnessStore((state) => state.plan);

  if (!plan) return null;

  return (
    <section className="lf-card lf-section">
      <div className="mb-7">
        <h2 className="lf-title text-xl">Your Weekly Plan</h2>

        <p className="lf-muted mt-1 text-sm">
          {plan.goal} · {plan.level} · {plan.duration} · {plan.split}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {plan.schedule.map((item) => (
          <div key={item.day} className="lf-choice p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-white">{item.day}</h3>

              {item.isRest ? (
                <Moon className="h-4 w-4 text-slate-500" />
              ) : (
                <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-400">
                  {item.type}
                </span>
              )}
            </div>

            {item.isRest ? (
              <p className="text-xs text-slate-500">Rest and recover.</p>
            ) : (
              <ul className="space-y-2">
                {item.exercises.map((exercise) => (
                  <li
                    key={exercise.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="flex items-center gap-2 text-slate-200">
                      <Dumbbell className="h-3.5 w-3.5 text-blue-400" />
                      {exercise.name}
                    </span>

                    <span className="text-xs text-slate-500">
                      {exercise.sets} × {exercise.reps}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default GeneratedPlan;