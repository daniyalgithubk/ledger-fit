import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HeartPulse, Target, Scale, ArrowRight, Sparkles } from "lucide-react";
import { GOALS, suggestGoal } from "../../utils/macros";
import AnimatedNumber from "../ui/AnimatedNumber";

const CATEGORY_STYLE = {
  Underweight: "bg-sky-500/10 text-sky-300",
  Normal: "bg-emerald-500/10 text-emerald-300",
  Overweight: "bg-orange-500/10 text-orange-300",
  "Obesity range": "bg-red-500/10 text-red-300",
};

const Tile = ({ icon: Icon, color, label, children, sub, highlight }) => (
  <div className={`rounded-xl border p-4 ${highlight ? "border-blue-500/20 bg-blue-500/[0.07]" : "border-white/5 bg-slate-900/60"}`}>
    <Icon className={`mb-2 h-4 w-4 ${color}`} />
    <p className="text-xs text-slate-400">{label}</p>
    <div className="mt-1 text-2xl font-extrabold tabular-nums text-white">{children}</div>
    {sub}
  </div>
);

export default function VitalsCard({ vitals, goal, onGoalChange, targetKcal }) {
  const { bmi, bmiCategory, calories, weight, height } = vitals;

  if (!bmi || !calories) {
    return (
      <div className="lf-card p-6 text-center sm:p-8">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10">
          <HeartPulse className="h-6 w-6 text-blue-400" />
        </span>
        <h3 className="mt-4 text-lg font-bold text-white">Add your vitals to unlock your diet plan</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
          Your BMI and daily calories set your targets and shape your AI plan. It takes about 20 seconds.
        </p>
        <Link to="/" className="lf-button mt-5 px-6 py-3 text-sm">
          Enter vitals <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const suggested = suggestGoal(bmiCategory);

  return (
    <div className="lf-card p-5 sm:p-6">
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-400">Your vitals</p>
      <h3 className="mb-4 mt-1 text-lg font-bold text-white">Your starting point</h3>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Tile
          icon={HeartPulse}
          color="text-blue-400"
          label="BMI"
          sub={
            <span className={`mt-1.5 inline-block rounded-md px-2 py-0.5 text-[10px] font-semibold ${CATEGORY_STYLE[bmiCategory] || "bg-white/5 text-slate-300"}`}>
              {bmiCategory}
            </span>
          }
        >
          <AnimatedNumber value={bmi} decimals={1} />
        </Tile>

        <Tile icon={Scale} color="text-cyan-400" label="Weight / Height">
          <span className="text-lg">
            {weight} kg <span className="text-sm font-normal text-slate-500">· {height} cm</span>
          </span>
        </Tile>

        <Tile
          icon={Target}
          color="text-orange-400"
          label="Daily calories"
          sub={<p className="mt-1.5 text-[11px] text-slate-500">from your vitals</p>}
        >
          <AnimatedNumber value={calories} />
        </Tile>

        <Tile
          icon={Target}
          color="text-blue-400"
          label="Your target"
          highlight
          sub={<p className="mt-1.5 text-[11px] text-slate-500">kcal to {GOALS[goal].label.toLowerCase()}</p>}
        >
          <AnimatedNumber value={targetKcal} />
        </Tile>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Your goal</p>
          {goal === suggested && (
            <span className="flex items-center gap-1 text-[11px] text-cyan-300">
              <Sparkles className="h-3 w-3" /> Suggested for you
            </span>
          )}
        </div>

        <div className="flex rounded-xl border border-white/10 bg-slate-950/60 p-1">
          {Object.entries(GOALS).map(([key, g]) => (
            <button
              key={key}
              onClick={() => onGoalChange(key)}
              className={`relative z-10 flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                goal === key ? "text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              {goal === key && (
                <motion.span
                  layoutId="goal-pill"
                  className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
              {g.label}
            </button>
          ))}
        </div>

        <p className="mt-3 text-[11px] leading-5 text-slate-600">
          BMI is a rough guide. It does not account for muscle mass, age or sex. General guidance, not medical advice.
        </p>
      </div>
    </div>
  );
}