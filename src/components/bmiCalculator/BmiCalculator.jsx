import { useEffect, useRef, useState } from "react";
import { Scale, Ruler, Flame, Check, ArrowRight } from "lucide-react";
import { useFitnessStore } from "../../zustand/store/useFitnessStore";

const ZONES = {
  Underweight: {
    name: "Build Zone",
    description: "Focus on strength training and nutrient-dense meals.",
  },
  Normal: {
    name: "Maintain Zone",
    description: "Keep a balanced mix of cardio, strength, and recovery.",
  },
  Overweight: {
    name: "Burn Zone",
    description: "Focus on regular cardio and consistent daily activity.",
  },
  "Obesity range": {
    name: "Gentle Start Zone",
    description: "Start with low-impact activity and build up gradually.",
  },
};

// Colours and BMI cut-offs for each category
const BANDS = [
  { category: "Underweight", max: 18.5, text: "text-sky-400" },
  { category: "Normal", max: 25, text: "text-emerald-400" },
  { category: "Overweight", max: 30, text: "text-orange-400" },
  { category: "Obesity range", max: Infinity, text: "text-red-400" },
];

const LIMITS = {
  weight: [20, 500, "Weight must be between 20 and 500 kg."],
  height: [50, 300, "Height must be between 50 and 300 cm."],
  calories: [1, 15000, "Calories must be between 1 and 15,000."],
};

const SCALE_MIN = 15;
const SCALE_MAX = 40;

const toPct = (bmi) =>
  Math.min(100, Math.max(0, ((bmi - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100));

function useCountUp(target, duration = 600) {
  const [value, setValue] = useState(target);
  const from = useRef(target);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      from.current = target;
      return;
    }
    const start = performance.now();
    const begin = from.current;
    let raf;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const next = begin + (target - begin) * eased;
      setValue(next);
      from.current = next;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

function Field({ id, label, icon: Icon, unit, value, onChange, error, placeholder }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-300">
        {label}
      </label>
      <div
        className={`group flex items-center gap-3 rounded-xl border bg-slate-900/60 px-4 py-3 transition-all duration-200 motion-reduce:transition-none focus-within:shadow-[0_0_0_4px_rgba(59,130,246,0.12)] ${
          error ? "border-red-500/50" : "border-white/10 focus-within:border-blue-500/60"
        }`}
      >
        <Icon className="h-5 w-5 shrink-0 text-slate-500 transition-colors group-focus-within:text-blue-400" />
        <input
          id={id}
          name={id}
          type="number"
          inputMode="decimal"
          step="any"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className="w-full bg-transparent text-lg font-semibold text-white outline-none placeholder:text-slate-600 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <span className="shrink-0 text-sm text-slate-500">{unit}</span>
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

const BmiCalculator = () => {
  // Store values
  const setVitals = useFitnessStore((state) => state.setVitals);
  const clearVitals = useFitnessStore((state) => state.clearVitals);
  const bmi = useFitnessStore((state) => state.bmi);
  const bmiCategory = useFitnessStore((state) => state.bmiCategory);
  const storedWeight = useFitnessStore((state) => state.weight);
  const storedHeight = useFitnessStore((state) => state.height);
  const storedCalories = useFitnessStore((state) => state.calories);

  // Form inputs only (start from persisted values)
  const [weight, setWeight] = useState(storedWeight ? String(storedWeight) : "");
  const [height, setHeight] = useState(storedHeight ? String(storedHeight) : "");
  const [calories, setCalories] = useState(storedCalories ? String(storedCalories) : "");
  const [touched, setTouched] = useState(false);
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  // One entrance moment: the BMI marker sweeps in from the left
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const values = {
    weight: Number(weight),
    height: Number(height),
    calories: Number(calories),
  };

  const errors = {};
  for (const key of Object.keys(LIMITS)) {
    const [min, max, msg] = LIMITS[key];
    const raw = key === "weight" ? weight : key === "height" ? height : calories;
    const v = values[key];
    if (!raw.trim() || !Number.isFinite(v) || v < min || v > max) errors[key] = msg;
  }
  const showError = (key) => (touched && errors[key] ? errors[key] : "");

  // Live preview while typing; falls back to the saved values from the store
  const liveBmi =
    !errors.weight && !errors.height
      ? Math.round((values.weight / Math.pow(values.height / 100, 2)) * 10) / 10
      : null;
  const liveBand = liveBmi ? BANDS.find((b) => liveBmi < b.max) : null;

  const shownBmi = liveBmi ?? bmi;
  const shownCategory = liveBand?.category ?? bmiCategory;
  const band = BANDS.find((b) => b.category === shownCategory) || null;
  const suggestedZone = shownCategory ? ZONES[shownCategory] : null;
  const shownCalories = !errors.calories ? values.calories : storedCalories;

  const animatedBmi = useCountUp(shownBmi || 0);
  const markerLeft = mounted && shownBmi ? toPct(shownBmi) : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);

    if (Object.keys(errors).length) {
      clearVitals(); // don't show stale results next to the errors
      setSaved(false);
      return;
    }

    // The store calculates BMI and category
    setVitals({
      weight: values.weight,
      height: values.height,
      calories: values.calories,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const edit = (setter) => (v) => {
    setter(v);
    setSaved(false);
  };

  return (
    <section className="px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <form onSubmit={handleSubmit} noValidate className="lf-card overflow-hidden">
          <div className="grid lg:grid-cols-2">
            {/* Inputs */}
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-white">Your vitals</h2>
              <p className="mt-1 text-sm text-slate-400">
                We use these to work out your BMI and your daily calorie target.
              </p>

              <div className="mt-6 space-y-5">
                <Field id="weight" label="Weight" icon={Scale} unit="kg" placeholder="e.g. 75"
                  value={weight} onChange={edit(setWeight)} error={showError("weight")} />
                <Field id="height" label="Height" icon={Ruler} unit="cm" placeholder="e.g. 175"
                  value={height} onChange={edit(setHeight)} error={showError("height")} />
                <Field id="calories" label="Daily calorie intake" icon={Flame} unit="kcal" placeholder="e.g. 2400"
                  value={calories} onChange={edit(setCalories)} error={showError("calories")} />
              </div>

              <button
                type="submit"
                className={`mt-7 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-300 active:scale-[0.98] motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30 ${
                  saved
                    ? "bg-emerald-500 shadow-emerald-500/20"
                    : "bg-gradient-to-r from-blue-500 to-cyan-500 shadow-blue-500/20 hover:-translate-y-0.5 hover:shadow-blue-500/40 motion-reduce:hover:translate-y-0"
                }`}
              >
                {saved ? (
                  <>
                    <Check className="h-4 w-4" /> Vitals saved
                  </>
                ) : (
                  <>
                    Save vitals <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>

            {/* Results */}
            <div
              aria-live="polite"
              className="border-t border-white/5 bg-slate-900/40 p-6 sm:p-8 lg:border-l lg:border-t-0"
            >
              <p className="text-sm font-medium text-slate-400">Your BMI</p>

              <div className="mt-2 flex items-end gap-3">
                <span className="text-6xl font-extrabold tabular-nums leading-none text-white">
                  {shownBmi ? animatedBmi.toFixed(1) : "--"}
                </span>
                {band && (
                  <span
                    key={band.category}
                    className={`mb-1 rounded-lg bg-white/5 px-2.5 py-1 text-sm font-semibold ${band.text}`}
                  >
                    {band.category}
                  </span>
                )}
              </div>

              {/* BMI scale */}
              <div className="mt-8">
                <div className="relative">
                  <div className="flex h-2.5 overflow-hidden rounded-full">
                    <div className="bg-sky-400/70" style={{ width: `${toPct(18.5)}%` }} />
                    <div className="bg-emerald-400/70" style={{ width: `${toPct(25) - toPct(18.5)}%` }} />
                    <div className="bg-orange-400/70" style={{ width: `${toPct(30) - toPct(25)}%` }} />
                    <div className="flex-1 bg-red-400/70" />
                  </div>
                  <div
                    className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 transition-[left,opacity] duration-[900ms] ease-out motion-reduce:transition-none"
                    style={{ left: `${markerLeft}%`, opacity: shownBmi ? 1 : 0 }}
                    aria-hidden="true"
                  >
                    <div className="h-5 w-5 rounded-full border-4 border-slate-900 bg-white shadow-[0_0_0_2px_rgba(255,255,255,0.4)]" />
                  </div>
                </div>
                <div className="mt-2 flex justify-between text-[11px] text-slate-500">
                  <span>{SCALE_MIN}</span>
                  <span>18.5</span>
                  <span>25</span>
                  <span>30</span>
                  <span>{SCALE_MAX}</span>
                </div>
              </div>

              {/* Suggested zone */}
              <div className="mt-8 rounded-xl border border-white/5 bg-slate-900/60 p-4">
                <p className="text-sm text-slate-400">Suggested zone</p>
                {suggestedZone ? (
                  <div key={suggestedZone.name} style={{ animation: "vfFadeIn 0.4s ease-out" }}>
                    <p className={`mt-1 text-2xl font-bold ${band?.text || "text-white"}`}>
                      {suggestedZone.name}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">{suggestedZone.description}</p>
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-slate-500">
                    Enter your weight and height to see your suggested focus.
                  </p>
                )}
                {shownCalories > 0 && (
                  <p className="mt-3 border-t border-white/5 pt-3 text-sm text-slate-400">
                    Daily intake entered:{" "}
                    <span className="font-semibold text-white">
                      {Number(shownCalories).toLocaleString()} kcal
                    </span>
                  </p>
                )}
              </div>

              <p className="mt-5 text-[11px] leading-5 text-slate-500">
                BMI categories are intended for adults and are a screening measure, not a
                diagnosis. A suitable calorie target also depends on factors such as age, sex,
                activity level, and goals.
              </p>
            </div>
          </div>

          <style>{`@keyframes vfFadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion: reduce){[style*="vfFadeIn"]{animation:none!important}}`}</style>
        </form>
      </div>
    </section>
  );
};

export default BmiCalculator;