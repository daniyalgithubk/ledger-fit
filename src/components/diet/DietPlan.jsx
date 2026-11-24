import { useState } from "react";
import { Sparkles } from "lucide-react";
import { auth } from "../../firebase";

const PREFERENCES = [
  ["none", "No preference"],
  ["halal", "Halal"],
  ["vegetarian", "Vegetarian"],
  ["vegan", "Vegan"],
];

const CUISINES = [
  ["any", "Any"],
  ["desi", "Desi / South Asian"],
  ["western", "Western"],
  ["mediterranean", "Mediterranean"],
];

async function requestPlan(payload) {
  await auth.authStateReady();
  if (!auth.currentUser) throw new Error("You are logged out. Please log in.");

  const token = await auth.currentUser.getIdToken();
  const res = await fetch("/api/diet-plan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
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

const selectClass =
  "w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500/50";

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
      const data = await requestPlan({
        bmi: Number(bmi),
        category,
        calories: kcal,
        goal,
        preference,
        cuisine,
      });
      setPlan(data);
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
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
          <Sparkles className="h-5 w-5 text-blue-400" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-400">
            AI diet plan
          </p>
          <h3 className="text-lg font-bold text-white">A day of eating for your goal</h3>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs text-slate-400">
          Diet preference
          <select
            value={preference}
            onChange={(e) => setPreference(e.target.value)}
            className={`${selectClass} mt-1.5`}
          >
            {PREFERENCES.map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </label>

        <label className="text-xs text-slate-400">
          Cuisine
          <select
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            className={`${selectClass} mt-1.5`}
          >
            {CUISINES.map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </label>
      </div>

      <button
        onClick={generate}
        disabled={!ready || loading}
        className="lf-button mt-4 px-6 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Creating plan..." : plan ? "Regenerate plan" : "Generate my plan"}
      </button>

      {!ready && (
        <p className="mt-3 text-xs text-slate-500">
          Enter your vitals on the Home page first.
        </p>
      )}

      {error && (
        <p className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}

      {plan && (
        <div className="mt-6 space-y-3">
          {plan.meals.map((m, i) => (
            <div key={i} className="rounded-xl border border-white/5 bg-slate-900/60 p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-semibold text-white">{m.name}</p>
                <p className="text-xs text-slate-500">
                  {m.calories} kcal · Protein {m.protein}g · Carbs {m.carbs}g · Fat {m.fat}g
                </p>
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
                {m.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            </div>
          ))}

          <div className="rounded-xl border border-blue-500/10 bg-blue-500/5 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Plan total
            </p>
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
            AI-generated, general guidance only. It is not medical advice. Talk to a
            doctor or dietitian if you have a health condition.
          </p>
        </div>
      )}
    </div>
  );
}