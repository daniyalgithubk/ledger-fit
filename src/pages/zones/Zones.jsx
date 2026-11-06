import { useState } from "react";
import {
  Activity,
  Calculator,
  Check,
  HeartPulse,
  Info,
  Pencil,
} from "lucide-react";

import { useFitnessStore } from "../../zustand/store/useFitnessStore";


// min and max are stored as numbers, so no text parsing is needed
const ZONES = [
  {
    zone: "Zone 1",
    title: "Active Recovery",
    description: "Light activity to promote recovery",
    min: 50,
    max: 60,
    color: "bg-green-500",
    lightColor: "bg-green-500/10",
    textColor: "text-green-400",
  },
  {
    zone: "Zone 2",
    title: "Endurance",
    description: "Build aerobic capacity",
    min: 60,
    max: 70,
    color: "bg-blue-500",
    lightColor: "bg-blue-500/10",
    textColor: "text-blue-400",
  },
  {
    zone: "Zone 3",
    title: "Tempo",
    description: "Improve lactate threshold",
    min: 70,
    max: 80,
    color: "bg-yellow-500",
    lightColor: "bg-yellow-500/10",
    textColor: "text-yellow-400",
  },
  {
    zone: "Zone 4",
    title: "Anaerobic Capacity",
    description: "Increase power output",
    min: 80,
    max: 90,
    color: "bg-orange-500",
    lightColor: "bg-orange-500/10",
    textColor: "text-orange-400",
  },
  {
    zone: "Zone 5",
    title: "Maximum Effort",
    description: "Sprint and all-out efforts",
    min: 90,
    max: 100,
    color: "bg-red-500",
    lightColor: "bg-red-500/10",
    textColor: "text-red-400",
  },
];


const Zones = () => {
  // Saved result and action from the store
  const heartZones = useFitnessStore((state) => state.heartZones);
  const setHeartZones = useFitnessStore((state) => state.setHeartZones);

  // Form inputs only (start from the saved values, if any)
  const [calculateBy, setCalculateBy] = useState(heartZones?.method ?? "age");
  const [age, setAge] = useState(
    heartZones?.age ? String(heartZones.age) : "",
  );
  const [maxHeartRate, setMaxHeartRate] = useState(
    heartZones?.method === "heart" && heartZones.maxHeartRate
      ? String(heartZones.maxHeartRate)
      : "",
  );
  const [error, setError] = useState("");

  const isAgeMode = calculateBy === "age";
  const currentInput = isAgeMode ? age : maxHeartRate;

  const handleCalculate = () => {
    if (isAgeMode) {
      const ageValue = Number(age);

      if (!Number.isFinite(ageValue) || ageValue < 10 || ageValue > 100) {
        setError("Enter an age between 10 and 100.");
        return;
      }

      setError("");
      setHeartZones({
        method: "age",
        age: ageValue,
        maxHeartRate: Math.round(220 - ageValue),
      });
    } else {
      const heartValue = Number(maxHeartRate);

      if (
        !Number.isFinite(heartValue) ||
        heartValue < 100 ||
        heartValue > 230
      ) {
        setError("Enter a maximum heart rate between 100 and 230 bpm.");
        return;
      }

      setError("");
      setHeartZones({
        method: "heart",
        age: null,
        maxHeartRate: Math.round(heartValue),
      });
    }
  };

  const switchMethod = (method) => {
    setCalculateBy(method);
    setError("");
  };

  return (
    <div className="lf-page">
      <div className="lf-container">

        {/* ================= HEADER ================= */}

        <div className="mb-10">
          <div className="mb-2 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(0,149,255,0.8)]" />

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
              Training Zones
            </p>
          </div>

          <h1 className="lf-title text-3xl sm:text-4xl lg:text-5xl">
            Find Your Perfect Zone
          </h1>

          <p className="lf-muted mt-3 max-w-2xl text-sm leading-6 sm:text-base">
            Understand your heart rate zones and train at the right intensity
            for better results.
          </p>
        </div>

        {/* ================= CALCULATOR ================= */}

        <section className="lf-card lf-section">
          <div className="mb-8">
            <div className="mb-4 flex items-center gap-4">
              <div className="lf-icon-box h-12 w-12">
                <Calculator className="h-5 w-5" />
              </div>

              <div>
                <h2 className="lf-title text-lg">Calculate Your Zones</h2>

                <p className="lf-muted mt-1 text-sm">
                  Enter your age or maximum heart rate to personalize your
                  training zones.
                </p>
              </div>
            </div>
          </div>

          {/* Calculation methods */}

          <div className="grid gap-4 md:grid-cols-2">

            {/* Age */}

            <button
              type="button"
              onClick={() => switchMethod("age")}
              className={`rounded-2xl border p-5 text-left transition duration-200 ${
                isAgeMode
                  ? "border-blue-500/60 bg-blue-500/10 shadow-[0_0_25px_rgba(0,130,255,0.08)]"
                  : "border-white/5 bg-slate-900/50 hover:border-blue-500/30 hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                    isAgeMode
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-slate-800 text-slate-500"
                  }`}
                >
                  <Activity className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="font-semibold text-white">
                    Calculate From Age
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Estimate your maximum heart rate from your age.
                  </p>
                </div>
              </div>
            </button>

            {/* Max Heart Rate */}

            <button
              type="button"
              onClick={() => switchMethod("heart")}
              className={`rounded-2xl border p-5 text-left transition duration-200 ${
                !isAgeMode
                  ? "border-blue-500/60 bg-blue-500/10 shadow-[0_0_25px_rgba(0,130,255,0.08)]"
                  : "border-white/5 bg-slate-900/50 hover:border-blue-500/30 hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                    !isAgeMode
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-slate-800 text-slate-500"
                  }`}
                >
                  <HeartPulse className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="font-semibold text-white">
                    Use Maximum Heart Rate
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Enter your known maximum heart rate.
                  </p>
                </div>
              </div>
            </button>

          </div>

          {/* Input */}

          <div className="mt-7 max-w-xl">
            <label
              htmlFor="zones-input"
              className="mb-2 block text-sm font-semibold text-slate-300"
            >
              {isAgeMode ? "Your Age" : "Your Maximum Heart Rate"}
            </label>

            <div className="relative">
              <input
                id="zones-input"
                type="number"
                min={isAgeMode ? "10" : "100"}
                max={isAgeMode ? "100" : "230"}
                value={currentInput}
                onChange={(e) => {
                  if (isAgeMode) {
                    setAge(e.target.value);
                  } else {
                    setMaxHeartRate(e.target.value);
                  }

                  setError("");
                }}
                placeholder={isAgeMode ? "e.g. 25" : "e.g. 180"}
                className="lf-input px-4 py-3.5 pr-20 text-sm"
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-600">
                {isAgeMode ? "years" : "bpm"}
              </span>
            </div>

            {/* Error message */}
            {error && (
              <p role="alert" className="mt-3 text-xs text-red-400">
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={handleCalculate}
              disabled={!currentInput}
              className={`lf-button mt-4 w-full px-6 py-3.5 text-sm ${
                !currentInput ? "cursor-not-allowed opacity-40" : ""
              }`}
            >
              Calculate Zones →
            </button>
          </div>
        </section>

        {/* ================= HEART RATE ZONES ================= */}

        <section className="lf-card lf-section">
          {!heartZones ? (
            // Nothing calculated yet
            <div className="py-8 text-center">
              <HeartPulse className="mx-auto mb-4 h-8 w-8 text-slate-600" />

              <h2 className="lf-title text-lg">No zones yet</h2>

              <p className="lf-muted mx-auto mt-2 max-w-md text-sm">
                Enter your age or maximum heart rate above and click
                "Calculate Zones" to see your personal heart rate zones.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <HeartPulse className="h-5 w-5 text-blue-400" />

                    <span className="text-xs font-bold uppercase tracking-[0.15em] text-blue-400">
                      Personalized
                    </span>
                  </div>

                  <h2 className="lf-title text-xl">Your Heart Rate Zones</h2>

                  <p className="lf-muted mt-2 text-sm">
                    Based on{" "}
                    {heartZones.method === "age"
                      ? `age ${heartZones.age}`
                      : "your maximum heart rate"}{" "}
                    · Max Heart Rate:{" "}
                    <span className="font-semibold text-blue-400">
                      {heartZones.maxHeartRate} bpm
                    </span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                  className="flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-slate-900/70 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-blue-500/40 hover:text-blue-400"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </button>

              </div>

              {/* Zone Cards */}

              <div className="grid gap-4 lg:grid-cols-2">
                {ZONES.map((zone, index) => {
                  const minHeartRate = Math.round(
                    heartZones.maxHeartRate * (zone.min / 100),
                  );

                  const maxHeartRateValue = Math.round(
                    heartZones.maxHeartRate * (zone.max / 100),
                  );

                  return (
                    <div
                      key={zone.zone}
                      className={`group rounded-2xl border border-white/5 bg-slate-900/50 p-5 transition duration-200 hover:border-blue-500/20 hover:bg-slate-800/60 ${
                        index === 0 ? "lg:col-span-2" : ""
                      }`}
                    >
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                        {/* Zone indicator */}

                        <div
                          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${zone.lightColor}`}
                        >
                          <div
                            className={`h-4 w-4 rounded-full ${zone.color} shadow-[0_0_14px_currentColor]`}
                          />
                        </div>

                        {/* Zone information */}

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="font-bold text-white">
                              {zone.zone}: {zone.title}
                            </h3>

                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${zone.lightColor} ${zone.textColor}`}
                            >
                              {zone.min}–{zone.max}%
                            </span>
                          </div>

                          <p className="mt-2 text-sm text-slate-500">
                            {zone.description}
                          </p>
                        </div>

                        {/* Heart Rate */}

                        <div className="rounded-xl border border-white/5 bg-black/20 px-4 py-3 sm:min-w-[145px] sm:text-right">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                            Heart Rate
                          </p>

                          <p className="mt-1 text-sm font-bold text-white">
                            {minHeartRate} – {maxHeartRateValue}
                          </p>

                          <p className="text-[10px] text-slate-600">BPM</p>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="mt-6 text-xs leading-5 text-slate-600">
                These zones are estimates. "220 minus age" can be off by 10 bpm
                or more for an individual. If you have a heart condition or take
                medication that affects heart rate, ask your doctor before
                training by these numbers.
              </p>
            </>
          )}
        </section>

        {/* ================= WHY ZONES ================= */}

        <section className="lf-card lf-section">
          <div className="grid gap-8 lg:grid-cols-[auto_1fr]">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
              <Info className="h-6 w-6" />
            </div>

            <div>
              <h2 className="lf-title text-xl">Why Heart Rate Zones?</h2>

              <p className="lf-muted mt-2 text-sm">
                Training in the right zone helps you manage your training
                intensity and stay consistent with your goals.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  "Burn fat more efficiently",
                  "Improve endurance and performance",
                  "Reduce the risk of overtraining",
                  "Get better results, faster",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl border border-white/5 bg-slate-900/50 p-3"
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-400">
                      <Check className="h-3.5 w-3.5" />
                    </div>

                    <span className="text-sm text-slate-400">{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ================= FINAL MESSAGE ================= */}

        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-blue-500/10 bg-blue-500/5 p-6 text-center sm:flex-row">
          <HeartPulse className="h-5 w-5 text-blue-400" />

          <p className="text-sm leading-6 text-slate-500">
            Listen to your body and adjust your training intensity based on
            how you feel.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Zones;