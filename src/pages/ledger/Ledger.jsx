import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // adjust if you use another router
import {
  Play,
  Check,
  Clock3,
  Flame,
  Dumbbell,
  ChevronRight,
  RotateCcw,
  Trophy,
} from "lucide-react";
import { useFitnessStore } from "../../zustand/store/useFitnessStore"; // adjust the path

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Local date as YYYY-MM-DD (same helper as the Week page)
const toKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;

// 125 seconds -> "02:05", 3725 seconds -> "1:02:05"
const formatClock = (totalSeconds) => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");

  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
};

const Ledger = () => {
  // ---------- Store ----------
  const plan = useFitnessStore((state) => state.plan);
  const session = useFitnessStore((state) => state.session);
  const completedWorkouts = useFitnessStore((state) => state.completedWorkouts);
  const workoutHistory = useFitnessStore((state) => state.workoutHistory);
  const startSession = useFitnessStore((state) => state.startSession);
  const toggleExercise = useFitnessStore((state) => state.toggleExercise);
  const setExerciseWeight = useFitnessStore((state) => state.setExerciseWeight);
  const cancelSession = useFitnessStore((state) => state.cancelSession);
  const finishSession = useFitnessStore((state) => state.finishSession);

  // ---------- Today ----------
  const now = new Date();
  const todayKey = toKey(now);
  const todayName = DAY_NAMES[now.getDay()];
  const todayEntry = plan?.schedule.find((item) => item.day === todayName);

  // A session only counts if it was started today
  const isActive = Boolean(session && session.dateKey === todayKey);
  const alreadyDone = Boolean(completedWorkouts[todayKey]) && !isActive;

  // ---------- Timer ----------
  const [tick, setTick] = useState(Date.now());

  useEffect(() => {
    if (!isActive) return;

    setTick(Date.now());
    const id = setInterval(() => setTick(Date.now()), 1000);

    return () => clearInterval(id); // stop the timer when leaving the page
  }, [isActive]);

  // ================= NO PLAN =================
  if (!plan) {
    return (
      <main className="min-h-screen">
        <div className="mx-auto w-full max-w-3xl px-4 py-10 text-center">
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900">No plan yet</h1>

            <p className="mx-auto mt-3 max-w-md text-sm text-slate-500">
              Create your fitness plan first. Today's workout will appear here
              so you can record it.
            </p>

            <Link
              to="/plan" // adjust to your Plan route
              className="mt-6 inline-block rounded-xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              Create My Plan →
            </Link>
          </section>
        </div>
      </main>
    );
  }

  // ================= REST DAY =================
  if (!todayEntry || todayEntry.isRest) {
    return (
      <main className="min-h-screen">
        <div className="mx-auto w-full max-w-3xl px-4 py-10 text-center">
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900">Rest day 😴</h1>

            <p className="mx-auto mt-3 max-w-md text-sm text-slate-500">
              Nothing is planned for {todayName}. Recover, stretch and come back
              stronger.
            </p>
          </section>
        </div>
      </main>
    );
  }

  // ================= ALREADY DONE TODAY =================
  if (alreadyDone) {
    const record = workoutHistory.find((item) => item.dateKey === todayKey);

    return (
      <main className="min-h-screen">
        <div className="mx-auto w-full max-w-3xl px-4 py-10 text-center">
          <section className="rounded-2xl border border-blue-100 bg-blue-50 p-8">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 text-white">
              <Trophy className="h-6 w-6" />
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              Today's workout is done!
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm text-slate-600">
              {record
                ? `${todayEntry.type} Day · ${formatClock(record.durationSeconds)} · ${record.exercises.filter((e) => e.done).length}/${record.exercises.length} exercises`
                : "You marked today's workout as completed."}
            </p>
          </section>
        </div>
      </main>
    );
  }

  // ================= DERIVED DATA =================
  const exercises = todayEntry.exercises;
  const doneCount = isActive
    ? exercises.filter((exercise) => session.done[exercise.name]).length
    : 0;
  const allDone = isActive && doneCount === exercises.length;
  const progress = (doneCount / exercises.length) * 100;

  const elapsedSeconds = isActive
    ? Math.max(0, Math.floor((tick - session.startedAt) / 1000))
    : 0;
  const estimatedCalories = Math.round((elapsedSeconds / 60) * 6); // rough: ~6 kcal/min

  const handleFinish = () => {
    finishSession({
      dateKey: todayKey,
      type: todayEntry.type,
      durationSeconds: elapsedSeconds,
      completedAt: new Date().toISOString(),
      exercises: exercises.map((exercise) => ({
        name: exercise.name,
        sets: exercise.sets,
        reps: exercise.reps,
        weight: session.weights[exercise.name] || null,
        done: Boolean(session.done[exercise.name]),
      })),
    });
  };

  return (
    <main className="min-h-screen">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600">
              <Dumbbell className="h-4 w-4" />
              Workout Ledger
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Record your workout
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Track today's session, complete each exercise, and keep your
              training history up to date.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Clock3 className="h-4 w-4" />
            {todayName}
          </div>
        </div>

        {/* Workout Summary */}
        <section className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5 sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="mb-1 text-sm font-medium text-blue-500">
                  Today's Workout
                </p>

                <h2 className="text-2xl font-bold text-slate-900">
                  {todayEntry.type} Day
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {plan.goal} · {plan.level}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {isActive && (
                  <button
                    type="button"
                    onClick={cancelSession}
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-500 transition hover:border-red-200 hover:text-red-500"
                  >
                    Cancel
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => startSession(todayKey)}
                  disabled={isActive}
                  className={`inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition ${
                    isActive ? "cursor-default" : "hover:bg-blue-600"
                  }`}
                >
                  {isActive ? (
                    <>
                      <Check className="h-4 w-4" />
                      Workout Active
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 fill-current" />
                      Start Workout
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Workout Stats */}
          <div className="grid grid-cols-2 divide-x divide-slate-100 sm:grid-cols-4">
            <div className="p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Exercises
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900">
                {exercises.length}
              </p>
            </div>

            <div className="p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Completed
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900">
                {doneCount}
              </p>
            </div>

            <div className="p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Duration
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900">
                {formatClock(elapsedSeconds)}
              </p>
            </div>

            <div className="p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Est. Calories
              </p>

              <p className="mt-1 flex items-center gap-1 text-xl font-bold text-slate-900">
                <Flame className="h-5 w-5 text-orange-500" />
                {estimatedCalories}
              </p>
            </div>
          </div>
        </section>

        {/* Progress */}
        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900">
                Workout Progress
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {doneCount} of {exercises.length} exercises completed
              </p>
            </div>

            <span className="text-sm font-bold text-blue-500">
              {Math.round(progress)}%
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </section>

        {/* Exercise Log */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5 sm:p-7">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Exercise Log
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {isActive
                    ? "Enter your weight and complete each exercise as you finish it."
                    : "Press Start Workout to begin logging."}
                </p>
              </div>

              <RotateCcw className="h-5 w-5 text-slate-400" />
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {exercises.map((exercise, index) => {
              const completed = isActive && Boolean(session.done[exercise.name]);

              return (
                <div
                  key={exercise.name}
                  className={`p-5 transition sm:p-6 ${
                    completed ? "bg-blue-50/50" : "bg-white"
                  }`}
                >
                  <div className="flex items-center gap-4">

                    {/* Exercise Number */}
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                        completed
                          ? "bg-blue-500 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {completed ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        String(index + 1).padStart(2, "0")
                      )}
                    </div>

                    {/* Exercise Details */}
                    <div className="min-w-0 flex-1">
                      <h3
                        className={`font-semibold ${
                          completed ? "text-blue-600" : "text-slate-900"
                        }`}
                      >
                        {exercise.name}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {exercise.sets} sets × {exercise.reps} reps
                      </p>
                    </div>

                    {/* Weight input */}
                    <div className="relative w-24 shrink-0">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        placeholder="0"
                        disabled={!isActive}
                        value={isActive ? session.weights[exercise.name] ?? "" : ""}
                        onChange={(e) =>
                          setExerciseWeight(exercise.name, e.target.value)
                        }
                        aria-label={`Weight for ${exercise.name} in kg`}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 pr-9 text-sm text-slate-900 outline-none focus:border-blue-400 disabled:bg-slate-50 disabled:text-slate-400"
                      />

                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                        kg
                      </span>
                    </div>

                    {/* Desktop Complete Button */}
                    <button
                      type="button"
                      disabled={!isActive}
                      onClick={() => toggleExercise(exercise.name)}
                      className={`hidden items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition sm:flex ${
                        completed
                          ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                          : "border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                      } ${!isActive ? "cursor-not-allowed opacity-40" : ""}`}
                    >
                      {completed ? "Completed" : "Complete"}

                      <ChevronRight className="h-4 w-4" />
                    </button>

                    {/* Mobile Complete Button */}
                    <button
                      type="button"
                      disabled={!isActive}
                      onClick={() => toggleExercise(exercise.name)}
                      aria-label={`Toggle ${exercise.name}`}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl sm:hidden ${
                        completed
                          ? "bg-blue-500 text-white"
                          : "border border-slate-200 text-slate-500"
                      } ${!isActive ? "cursor-not-allowed opacity-40" : ""}`}
                    >
                      {completed ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Workout Completed */}
        {allDone && (
          <section className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-6 sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500 text-white">
                <Trophy className="h-6 w-6" />
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-slate-900">
                  Workout completed!
                </h3>

                <p className="mt-1 text-sm text-slate-600">
                  Great work. Save it to add it to your progress history.
                </p>
              </div>

              <button
                type="button"
                onClick={handleFinish}
                className="rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
              >
                Finish & Save
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default Ledger;