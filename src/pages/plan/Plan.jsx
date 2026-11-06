import { useState, useRef } from "react";
import {
  Dumbbell,
  Flame,
  Scale,
  Activity,
  Trophy,
  Sprout,
  Zap,
  Clock,
  CalendarDays,
  Check,
} from "lucide-react";
import { useFitnessStore } from "../../zustand/store/useFitnessStore";
import GeneratedPlan from "../../components/generatedPlan/GeneratedPlan";

const Goals = [
  { title: "Build Muscle", icon: Dumbbell },
  { title: "Lose Weight", icon: Flame },
  { title: "Maintain Weight", icon: Scale },
  { title: "Improve Fitness", icon: Activity },
  { title: "Increase Strength", icon: Trophy },
];

const Levels = [
  {
    title: "Beginner",
    icon: Sprout,
    description: "New to structured training",
  },
  {
    title: "Intermediate",
    icon: Zap,
    description: "Consistent training experience",
  },
  {
    title: "Advanced",
    icon: Flame,
    description: "Experienced with structured programs",
  },
];

const Durations = ["30 min", "45 min", "60 min", "75 min", "90 min"];

const Schedule = [
  { day: "Monday", icon: "💪" },
  { day: "Tuesday", icon: "🏃" },
  { day: "Wednesday", icon: "🏋️" },
  { day: "Thursday", icon: "🔥" },
  { day: "Friday", icon: "💪" },
  { day: "Saturday", icon: "🏃" },
  { day: "Sunday", icon: "😴" },
];

const Splits = [
  {
    title: "Push / Pull / Legs",
    desc: "Mon Push · Tue Pull · Wed Legs · Thu Rest · Fri Push · Sat Pull · Sun Rest",
  },
  {
    title: "Upper / Lower",
    desc: "Mon Upper · Tue Lower · Wed Upper · Thu Lower · Fri Upper · Sat Lower · Sun Rest",
  },
  {
    title: "Full Body",
    desc: "Mon Full · Tue Rest · Wed Full · Thu Rest · Fri Full · Sat Rest · Sun Rest",
  },
  {
    title: "Custom Split",
    desc: "Create your own workout split based on your goals.",
  },
];

const Plan = () => {
  const createPlan = useFitnessStore((state) => state.createPlan);

  const [selectedGoal, setSelectedGoal] = useState("Build Muscle");
  const [selectedLevel, setSelectedLevel] = useState("Beginner");
  const [selectedDuration, setSelectedDuration] = useState("60 min");
  const [selectedDays, setSelectedDays] = useState([
    "Monday",
    "Wednesday",
    "Friday",
  ]);
  const [selectedSplit, setSelectedSplit] = useState("Push / Pull / Legs");

  const [planError, setPlanError] = useState("");
  const planRef = useRef(null);

  const toggleDay = (day) => {
    setSelectedDays((currentDays) => {
      if (currentDays.includes(day)) {
        return currentDays.filter((item) => item !== day);
      }

      return [...currentDays, day];
    });
  };

  const handleCreatePlan = () => {
    if (selectedDays.length === 0) {
      setPlanError("Please select at least one training day.");
      return;
    }

    setPlanError("");

    createPlan({
      goal: selectedGoal,
      level: selectedLevel,
      duration: selectedDuration,
      days: selectedDays,
      split: selectedSplit,
    });

    // Wait for the plan to render, then scroll to it
    setTimeout(() => {
      planRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <div className="lf-page">
      <div className="lf-container">

        {/* ================= HEADER ================= */}

        <div className="mb-10">
          <div className="mb-2 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(0,149,255,0.8)]" />

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
              Build Your Plan
            </p>
          </div>

          <h1 className="lf-title text-3xl sm:text-4xl lg:text-5xl">
            Create Your Fitness Plan
          </h1>

          <p className="lf-muted mt-3 max-w-2xl text-sm leading-6 sm:text-base">
            Choose your goals, training level and schedule. Ledger/Fit will
            use your selections to build your weekly training structure.
          </p>
        </div>

        {/* ================= GOALS ================= */}

        <section className="lf-card lf-section">
          <div className="mb-7 flex items-center gap-4">
            <div className="lf-icon-box h-12 w-12">
              <Trophy className="h-5 w-5" />
            </div>

            <div>
              <h2 className="lf-title text-lg">What is your goal?</h2>

              <p className="lf-muted mt-1 text-sm">
                Select the main result you want from your training.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {Goals.map((goal) => {
              const Icon = goal.icon;
              const isSelected = selectedGoal === goal.title;

              return (
                <button
                  key={goal.title}
                  type="button"
                  onClick={() => setSelectedGoal(goal.title)}
                  className={`lf-choice flex flex-col items-center justify-center gap-4 p-5 text-center ${
                    isSelected ? "lf-choice-active" : ""
                  }`}
                >
                  <div className="lf-icon-box h-12 w-12">
                    <Icon className="h-5 w-5" />
                  </div>

                  <span className="text-sm font-semibold text-slate-200">
                    {goal.title}
                  </span>

                  {isSelected && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* ================= LEVEL ================= */}

        <section className="lf-card lf-section">
          <div className="mb-7 flex items-center gap-4">
            <div className="lf-icon-box h-12 w-12">
              <Zap className="h-5 w-5" />
            </div>

            <div>
              <h2 className="lf-title text-lg">Training Experience</h2>

              <p className="lf-muted mt-1 text-sm">
                Choose the level that best matches your current experience.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {Levels.map((level) => {
              const Icon = level.icon;
              const isSelected = selectedLevel === level.title;

              return (
                <button
                  key={level.title}
                  type="button"
                  onClick={() => setSelectedLevel(level.title)}
                  className={`lf-choice p-5 text-left ${
                    isSelected ? "lf-choice-active" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="lf-icon-box h-12 w-12">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div>
                      <h3 className="font-bold text-white">{level.title}</h3>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {level.description}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-blue-400">
                      <Check className="h-4 w-4" />
                      Selected
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* ================= DURATION ================= */}

        <section className="lf-card lf-section">
          <div className="mb-7 flex items-center gap-4">
            <div className="lf-icon-box h-12 w-12">
              <Clock className="h-5 w-5" />
            </div>

            <div>
              <h2 className="lf-title text-lg">Workout Duration</h2>

              <p className="lf-muted mt-1 text-sm">
                How much time can you normally spend training?
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {Durations.map((duration) => {
              const isSelected = selectedDuration === duration;

              return (
                <button
                  key={duration}
                  type="button"
                  onClick={() => setSelectedDuration(duration)}
                  className={`lf-choice px-5 py-4 text-sm font-semibold ${
                    isSelected
                      ? "lf-choice-active text-blue-400"
                      : "text-slate-300"
                  }`}
                >
                  {duration}
                </button>
              );
            })}
          </div>
        </section>

        {/* ================= WEEKLY SCHEDULE ================= */}

        <section className="lf-card lf-section">
          <div className="mb-7 flex items-center gap-4">
            <div className="lf-icon-box h-12 w-12">
              <CalendarDays className="h-5 w-5" />
            </div>

            <div>
              <h2 className="lf-title text-lg">Weekly Schedule</h2>

              <p className="lf-muted mt-1 text-sm">
                Select the days you want to train.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {Schedule.map((item) => {
              const isSelected = selectedDays.includes(item.day);

              return (
                <button
                  key={item.day}
                  type="button"
                  onClick={() => toggleDay(item.day)}
                  className={`lf-choice p-4 text-center ${
                    isSelected ? "lf-choice-active" : ""
                  }`}
                >
                  <div className="text-xl">{item.icon}</div>

                  <p className="mt-3 text-xs font-semibold text-slate-300">
                    {item.day}
                  </p>

                  <p
                    className={`mt-2 text-[10px] font-bold uppercase tracking-wider ${
                      isSelected ? "text-blue-400" : "text-slate-600"
                    }`}
                  >
                    {isSelected ? "Training" : "Rest"}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-5">
            <p className="text-xs text-slate-500">Training days selected</p>

            <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-400">
              {selectedDays.length} days
            </span>
          </div>
        </section>

        {/* ================= WORKOUT SPLIT ================= */}

        <section className="lf-card lf-section">
          <div className="mb-7">
            <div className="flex items-center gap-4">
              <div className="lf-icon-box h-12 w-12">
                <Dumbbell className="h-5 w-5" />
              </div>

              <div>
                <h2 className="lf-title text-lg">Workout Split</h2>

                <p className="lf-muted mt-1 text-sm">
                  Choose how your workouts should be organized.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {Splits.map((split) => {
              const isSelected = selectedSplit === split.title;

              return (
                <button
                  key={split.title}
                  type="button"
                  onClick={() => setSelectedSplit(split.title)}
                  className={`lf-choice p-5 text-left ${
                    isSelected ? "lf-choice-active" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-white">{split.title}</h3>

                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        {split.desc}
                      </p>
                    </div>

                    {isSelected && (
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500">
                        <Check className="h-3.5 w-3.5 text-white" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ================= SUMMARY ================= */}

        <section className="lf-card lf-section">
          <div className="grid gap-5 md:grid-cols-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                Goal
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                {selectedGoal}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                Level
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                {selectedLevel}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                Duration
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                {selectedDuration}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                Split
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                {selectedSplit}
              </p>
            </div>
          </div>
        </section>

        {/* ================= CREATE BUTTON ================= */}

        <div className="flex flex-col items-center justify-center pt-2">
          <button
            type="button"
            onClick={handleCreatePlan}
            className="lf-button w-full max-w-md px-8 py-4 text-sm"
          >
            Create My Plan →
          </button>

          {planError && (
            <p role="alert" className="mt-4 text-xs text-red-400">
              {planError}
            </p>
          )}

          <p className="mt-4 text-xs text-slate-600">
            You can change your plan anytime.
          </p>
        </div>

        {/* ================= GENERATED PLAN ================= */}

        <div ref={planRef} className="mt-8">
          <GeneratedPlan />
        </div>

      </div>
    </div>
  );
};

export default Plan;