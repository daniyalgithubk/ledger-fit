import { Salad } from "lucide-react";
import MealLogger from "../../components/mealLogger/MealLogger";

const Diet = () => {
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

          <h1 className="lf-title text-3xl sm:text-4xl">Log your meals</h1>

          <p className="lf-muted mt-2 max-w-2xl text-sm leading-6">
            Describe what you ate in plain words and get a calorie and macro
            estimate. Edit the numbers before saving.
          </p>
        </div>

        <div className="lf-card overflow-hidden">
          <MealLogger />
        </div>
      </section>
    </div>
  );
};

export default Diet;