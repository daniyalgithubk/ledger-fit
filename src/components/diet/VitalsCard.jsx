import { Link } from "react-router-dom";
import { HeartPulse, Target, Scale } from "lucide-react";
import { GOALS } from "../../utils/macros";

const CATEGORY_STYLE = {
  Underweight: "bg-sky-500/10 text-sky-400",
  Normal: "bg-green-500/10 text-green-400",
  Overweight: "bg-orange-500/10 text-orange-400",
  "Obesity range": "bg-red-500/10 text-red-400",
};

export default function VitalsCard({ vitals, goal, onGoalChange, targetKcal }) {
  const { bmi, bmiCategory, calories, weight, height } = vitals;

  if (!bmi || !calories) {
    return (
      <div className="lf-card p-5 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-400">
          Your vitals
        </p>
        <h3 className="mt-1 text-lg font-bold text-white">
          Add your vitals to unlock your diet plan
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          Your BMI and daily calories shape your targets and your plan.
        </p>
        <Link to="/" className="lf-button mt-4 inline-block px-5 py-2.5 text-sm">
          Enter vitals
        </Link>
      </div>
    );
  }

  return (
    <div className="lf-card p-5 sm:p-6">
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-400">
          Your vitals
        </p>
        <h3 className="mt-1 text-lg font-bold text-white">Your starting point</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-white/5 bg-slate-900/60 p-4">
          <HeartPulse className="mb-2 h-4 w-4 text-blue-400" />
          <p className="text-xs text-slate-400">BMI</p>
          <p className="mt-1 text-2xl font-bold text-white">{bmi}</p>
          <span
            className={`mt-1 inline-block rounded-md px-2 py-0.5 text-[10px] font-semibold ${
              CATEGORY_STYLE[bmiCategory] || "bg-white/5 text-slate-300"
            }`}
          >
            {bmiCategory}
          </span>
        </div>

        <div className="rounded-xl border border-white/5 bg-slate-900/60 p-4">
          <Scale className="mb-2 h-4 w-4 text-cyan-400" />
          <p className="text-xs text-slate-400">Weight / Height</p>
          <p className="mt-1 text-lg font-bold text-white">
            {weight} kg
            <span className="text-sm font-normal text-slate-500"> · {height} cm</span>
          </p>
        </div>

        <div className="rounded-xl border border-white/5 bg-slate-900/60 p-4">
          <Target className="mb-2 h-4 w-4 text-orange-400" />
          <p className="text-xs text-slate-400">Daily calories</p>
          <p className="mt-1 text-2xl font-bold text-white">{calories}</p>
          <p className="mt-1 text-[10px] text-slate-500">from your vitals</p>
        </div>

        <div className="rounded-xl border border-blue-500/10 bg-blue-500/5 p-4">
          <Target className="mb-2 h-4 w-4 text-blue-400" />
          <p className="text-xs text-slate-400">Your target</p>
          <p className="mt-1 text-2xl font-bold text-white">{targetKcal}</p>
          <p className="mt-1 text-[10px] text-slate-500">kcal for {GOALS[goal].label.toLowerCase()}</p>
        </div>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Your goal
        </p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(GOALS).map(([key, g]) => (
            <button
              key={key}
              onClick={() => onGoalChange(key)}
              className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                goal === key
                  ? "border-blue-500/50 bg-blue-500/10 text-blue-300"
                  : "border-white/10 text-slate-400 hover:text-white"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-[11px] leading-5 text-slate-600">
          BMI is a rough guide. It does not account for muscle mass, age or sex.
          This is general guidance, not medical advice.
        </p>
      </div>
    </div>
  );
}