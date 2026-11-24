import { useState } from "react";
import { Salad } from "lucide-react";
import MealLogger from "../../components/mealLogger/MealLogger";
import VitalsCard from "../../components/diet/VitalsCard";
import MacroProgress from "../../components/diet/MacroProgress";
import TodayMeals from "../../components/diet/TodayMeals";
import DietPlan from "../../components/diet/DietPlan";
import { useFitnessStore } from "../../zustand/store/useFitnessStore";
import { useAuthStore } from "../../zustand/store/useAuthStore";
import { useTodayMeals } from "../../hooks/useTodayMeals";
import { GOALS, getMacroTargets, suggestGoal } from "../../utils/macros";

const GOAL_KEY = "ledger-fit-goal";

const readGoal = () => {
  try {
    const g = localStorage.getItem(GOAL_KEY);
    return g && GOALS[g] ? g : null;
  } catch {
    return null;
  }
};

const Diet = () => {
  const weight = useFitnessStore((s) => s.weight);
  const height = useFitnessStore((s) => s.height);
  const calories = useFitnessStore((s) => s.calories);
  const bmi = useFitnessStore((s) => s.bmi);
  const bmiCategory = useFitnessStore((s) => s.bmiCategory);
  const user = useAuthStore((s) => s.user);

  const [chosenGoal, setChosenGoal] = useState(readGoal);
  const goal = chosenGoal || suggestGoal(bmiCategory);

  const changeGoal = (g) => {
    setChosenGoal(g);
    try {
      localStorage.setItem(GOAL_KEY, g);
    } catch {
      /* ignore */
    }
  };

  const targets = calories ? getMacroTargets(calories, goal) : null;
  const { meals, totals, loading, error, removeMeal } = useTodayMeals(user?.uid);

  return (
    <div className="lf-page">
      <section className="lf-container">
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
              <Salad className="h-4 w-4 text-blue-400" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
              Nutrition
            </p>
          </div>

          <h1 className="lf-title text-3xl sm:text-4xl">Your diet</h1>

          <p className="lf-muted mt-2 max-w-2xl text-sm leading-6">
            See your targets, log what you eat, and get a plan built around your
            vitals and goal.
          </p>
        </div>

        <div className="space-y-6">
          <VitalsCard
            vitals={{ bmi, bmiCategory, calories, weight, height }}
            goal={goal}
            onGoalChange={changeGoal}
            targetKcal={targets?.kcal}
          />

          <MacroProgress targets={targets} totals={totals} />

          <div className="lf-card overflow-hidden">
            <MealLogger />
          </div>

          <TodayMeals
            meals={meals}
            loading={loading}
            error={error}
            onDelete={removeMeal}
          />

          <DietPlan
            bmi={bmi}
            category={bmiCategory}
            kcal={targets?.kcal}
            goal={goal}
          />
        </div>
      </section>
    </div>
  );
};

export default Diet;