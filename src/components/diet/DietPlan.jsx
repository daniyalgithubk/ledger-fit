import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Sunrise, Sun, Moon, Apple } from "lucide-react";
import { auth } from "../../firebase";

const PREFERENCES = [["none", "No preference"], ["halal", "Halal"], ["vegetarian", "Vegetarian"], ["vegan", "Vegan"]];
const CUISINES = [["any", "Any"], ["desi", "Desi"], ["western", "Western"], ["mediterranean", "Mediterranean"]];

async function requestPlan(payload) {
  await auth.authStateReady();
  if (!auth.currentUser) throw new Error("You are logged out. Please log in.");

  const token = await auth.currentUser.getIdToken();
  const res = await fetch("/api/diet-plan", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });

  const raw = await res.text();
  let data = {};
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    throw new Error(`Server returned ${res.status}: ${raw.slice(0, 100)}`);
  }
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

const mealIcon = (name = "") => {
  const n = name.toLowerCase();
  if (n.includes("breakfast")) return Sunrise;
  if (n.includes("lunch")) return Sun;
  if (n.includes("dinner")) return Moon;
  return Apple;
};

function ChipGroup({ label, options, value, onChange }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map(([v, l]) => (
          <button
            key={v}
            onClick={() => onChange(v)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
              value === v
                ? "border-blue-500/50 bg-blue-500/15 text-blue-200"
                : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
            }`}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function DietPlan({ bmi, category, kcal, goal }) {
  const [preference, setPreference] = useState("none");
  const [cuisine, setCuisine] = useState("any");
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const ready = Boolean(bmi && kcal);

  const generate = async () => {
    setLoading(true);
    setError("");
    try {
      setPlan(await requestPlan({ bmi: Number(bmi), category, calories: kcal, goal, preference, cuisine }));
    } catch (e) {
      setError(
        /busy|high demand|overloaded/i.test(e.message)
          ? "The AI is busy right now. Please try again in a moment."
          : e.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lf-card p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
          <Sparkles className="h-5 w-5 text-blue-400" />
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-400">AI diet plan</p>
          <h3 className="text-lg font-bold text-white">A day of eating for your goal</h3>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <ChipGroup label="Diet preference" options={PREFERENCES} value={preference} onChange={setPreference} />
        <ChipGroup label="Cuisine" options={CUISINES} value={cuisine} onChange={setCuisine} />
      </div>

      <button
        onClick={generate}
        disabled={!ready || loading}
        className="lf-button mt-6 px-6 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Sparkles className="h-4 w-4" />
        {loading ? "Creating plan..." : plan ? "Regenerate plan" : "Generate my plan"}
      </button>

      {!ready && <p className="mt-3 text-xs text-slate-500">Enter your vitals on the Home page first.</p>}

      {error && (
        <p className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}

      {loading && (
        <div className="mt-6 space-y-3">
          <div className="lf-skeleton h-24" />
          <div className="lf-skeleton h-24" />
          <div className="lf-skeleton h-24" />
        </div>
      )}

      {plan && !loading && (
        <div className="mt-6 space-y-3">
          {plan.meals.map((m, i) => {
            const Icon = mealIcon(m.name);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-xl border border-white/5 bg-slate-900/60 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="flex items-center gap-2 font-semibold text-white">
                    <Icon className="h-4 w-4 text-blue-400" />
                    {m.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    <b className="text-orange-300">{m.calories} kcal</b> · P {m.protein}g · C {m.carbs}g · F {m.fat}g
                  </p>
                </div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
                  {m.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              </motion.div>
            );
          })}

          <div className="rounded-xl border border-blue-500/15 bg-blue-500/[0.07] p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-400">Plan total</p>
            <p className="mt-1 text-sm text-white">
              {plan.totals.calories} kcal · Protein {plan.totals.protein}g · Carbs {plan.totals.carbs}g · Fat {plan.totals.fat}g
            </p>
          </div>

          {plan.tips.length > 0 && (
            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-400">
              {plan.tips.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          )}

          <p className="text-[11px] leading-5 text-slate-600">
            AI-generated, general guidance only. Not medical advice. Talk to a doctor or dietitian if you have a health condition.
          </p>
        </div>
      )}
    </div>
  );
}