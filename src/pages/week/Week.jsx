import { Link } from "react-router-dom"; // adjust if you use another router
import {
  Calendar,
  Clock,
  Dumbbell,
  Flame,
  Timer,
  TrendingUp,
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

const STATUS = {
  completed: { label: "Completed", icon: "✅", color: "bg-green-500" },
  today: { label: "Today", icon: "📅", color: "bg-blue-500" },
  upcoming: { label: "Upcoming", icon: "⏳", color: "bg-yellow-500" },
  missed: { label: "Missed", icon: "❌", color: "bg-red-500" },
  rest: { label: "Rest Day", icon: "😴", color: "bg-gray-500" },
};

// Local date as YYYY-MM-DD (not UTC, so "today" is correct in any timezone)
const toKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;

// Build the 7 days (Monday to Sunday) of the current week from the plan
const buildWeek = (plan, completedWorkouts) => {
  const now = new Date();
  const todayKey = toKey(now);
  const offsetFromMonday = (now.getDay() + 6) % 7;

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - offsetFromMonday + i,
    );

    const key = toKey(date);
    const dayName = DAY_NAMES[date.getDay()];
    const planned = plan.schedule.find((item) => item.day === dayName);

    const isRest = !planned || planned.isRest;
    const isToday = key === todayKey;

    let status;
    if (isRest) status = "rest";
    else if (completedWorkouts[key]) status = "completed";
    else if (isToday) status = "today";
    else if (key < todayKey) status = "missed";
    else status = "upcoming";

    return {
      key,
      date,
      dayName,
      isToday,
      isRest,
      status,
      type: planned?.type,
      exercises: planned?.exercises ?? [],
    };
  });
};

const formatTime = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
};

const Week = () => {
  const plan = useFitnessStore((state) => state.plan);
  const completedWorkouts = useFitnessStore((state) => state.completedWorkouts);
  const toggleWorkout = useFitnessStore((state) => state.toggleWorkout);

  // ================= EMPTY STATE =================
  if (!plan) {
    return (
      <div className="lf-page">
        <div className="lf-container">
          <section className="lf-card lf-section text-center">
            <h1 className="lf-title text-2xl">No plan yet</h1>

            <p className="lf-muted mx-auto mt-3 max-w-md text-sm">
              Create your fitness plan first and your weekly schedule will
              appear here.
            </p>

            <Link
              to="/plan" // adjust to your Plan route
              className="lf-button mt-6 inline-block px-6 py-3 text-sm"
            >
              Create My Plan →
            </Link>
          </section>
        </div>
      </div>
    );
  }

  // ================= DERIVED DATA =================
  const week = buildWeek(plan, completedWorkouts);
  const today = week.find((item) => item.isToday);

  const totalWorkouts = week.filter((item) => !item.isRest).length;
  const doneWorkouts = week.filter((item) => item.status === "completed").length;
  const percentage =
    totalWorkouts === 0 ? 0 : Math.round((doneWorkouts / totalWorkouts) * 100);

  const minutesPerWorkout = parseInt(plan.duration, 10) || 0; // "60 min" -> 60
  const trainingMinutes = doneWorkouts * minutesPerWorkout;
  const estimatedCalories = trainingMinutes * 6; // rough estimate, ~6 kcal/min

  const todayDone = today?.status === "completed";

  return (
    <div className="lf-page">
      <div className="lf-container">

        {/* ================= PAGE HEADER ================= */}

        <div className="mb-10">
          <div className="mb-2 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(0,149,255,0.8)]" />

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
              This Week
            </p>
          </div>

          <h1 className="lf-title text-3xl sm:text-4xl lg:text-5xl">
            Your Weekly Journey
          </h1>

          <p className="lf-muted mt-3 max-w-2xl text-sm leading-6 sm:text-base">
            Track your workouts, stay consistent and make progress throughout
            the week.
          </p>
        </div>

        {/* ================= WEEKLY PROGRESS ================= */}

        <section className="lf-card lf-section">
          <div className="mb-7 flex items-center gap-4">
            <div className="lf-icon-box h-12 w-12">
              <TrendingUp className="h-5 w-5" />
            </div>

            <div>
              <h2 className="lf-title text-lg">Weekly Progress</h2>

              <p className="lf-muted mt-1 text-sm">
                Keep pushing toward your weekly goal
              </p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">

            {/* Progress */}

            <div className="flex flex-col justify-center">
              <div className="mb-3 flex items-end justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">
                    {doneWorkouts}/{totalWorkouts} workouts completed
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    Weekly completion
                  </p>
                </div>

                <span className="text-3xl font-bold text-blue-400">
                  {percentage}%
                </span>
              </div>

              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400 shadow-[0_0_18px_rgba(0,132,255,0.5)] transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className="mt-4 flex justify-between text-xs text-slate-600">
                <span>0 workouts</span>
                <span>{totalWorkouts} workouts goal</span>
              </div>
            </div>

            {/* Stats */}

            <div className="grid grid-cols-3 gap-3">

              <div className="rounded-xl border border-blue-500/10 bg-blue-500/5 p-4 text-center">
                <Dumbbell className="mx-auto mb-3 h-5 w-5 text-blue-400" />
                <p className="text-xl font-bold text-white">{doneWorkouts}</p>
                <p className="mt-1 text-xs text-slate-500">Workouts</p>
              </div>

              <div className="rounded-xl border border-orange-500/10 bg-orange-500/5 p-4 text-center">
                <Flame className="mx-auto mb-3 h-5 w-5 text-orange-400" />
                <p className="text-xl font-bold text-white">
                  {estimatedCalories.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-slate-500">Est. calories</p>
              </div>

              <div className="rounded-xl border border-cyan-500/10 bg-cyan-500/5 p-4 text-center">
                <Timer className="mx-auto mb-3 h-5 w-5 text-cyan-400" />
                <p className="text-xl font-bold text-white">
                  {formatTime(trainingMinutes)}
                </p>
                <p className="mt-1 text-xs text-slate-500">Training</p>
              </div>

            </div>
          </div>
        </section>

        {/* ================= WEEK SCHEDULE ================= */}

        <section className="lf-card lf-section">
          <div className="mb-7 flex items-center gap-4">
            <div className="lf-icon-box h-12 w-12">
              <Calendar className="h-5 w-5" />
            </div>

            <div>
              <h2 className="lf-title text-lg">This Week's Schedule</h2>

              <p className="lf-muted mt-1 text-sm">
                Your workout schedule for this week
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
            {week.map((item) => {
              const status = STATUS[item.status];

              return (
                <div
                  key={item.key}
                  className={`rounded-xl border p-4 text-center transition duration-200 ${
                    item.isToday
                      ? "border-blue-500/60 bg-blue-500/10 shadow-[0_0_25px_rgba(0,130,255,0.08)]"
                      : "border-white/5 bg-slate-900/50 hover:border-blue-500/20 hover:bg-slate-800/60"
                  }`}
                >
                  <p
                    className={`text-xs font-semibold ${
                      item.isToday ? "text-blue-400" : "text-slate-500"
                    }`}
                  >
                    {item.dayName}
                  </p>

                  <p className="mt-3 text-2xl font-bold text-white">
                    {item.date.getDate()}
                  </p>

                  <div
                    className={`mx-auto mt-4 flex h-10 w-10 items-center justify-center rounded-full ${
                      item.isToday && item.status !== "completed"
                        ? "bg-blue-500 shadow-[0_0_18px_rgba(0,132,255,0.45)]"
                        : item.status === "completed"
                        ? "bg-green-500/20"
                        : item.status === "rest"
                        ? "bg-slate-700"
                        : item.status === "missed"
                        ? "bg-red-500/20"
                        : "bg-yellow-500/20"
                    }`}
                  >
                    <span className="text-sm">{status.icon}</span>
                  </div>

                  {item.isToday && (
                    <p className="mt-3 text-[10px] font-bold tracking-wider text-blue-400">
                      TODAY
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}

          <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/5 pt-5">
            {Object.values(STATUS).map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full ${item.color}`}
                >
                  <span className="text-xs">{item.icon}</span>
                </div>

                <span className="text-xs text-slate-500">{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ================= TODAY'S WORKOUT ================= */}

        <section className="lf-card lf-section">
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-4">
              <div className="lf-icon-box h-12 w-12">
                <Dumbbell className="h-5 w-5" />
              </div>

              <div>
                <h2 className="lf-title text-lg">Today's Workout</h2>

                <p className="lf-muted mt-1 text-sm">
                  {today.isRest ? "Rest Day" : `${today.type} Day`}
                </p>
              </div>
            </div>

            <span
              className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold text-white ${
                STATUS[today.status].color
              }`}
            >
              {STATUS[today.status].label}
            </span>
          </div>

          {today.isRest ? (
            <p className="text-sm text-slate-500">
              Today is a rest day. Recover, stretch and come back stronger.
            </p>
          ) : (
            <>
              <div className="grid gap-3 md:grid-cols-2">
                {today.exercises.map((exercise, index) => (
                  <div
                    key={exercise.name}
                    className="group flex items-center justify-between rounded-xl border border-white/5 bg-slate-900/50 p-4 transition hover:border-blue-500/20 hover:bg-slate-800/60"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-sm font-bold text-blue-400">
                        {index + 1}
                      </div>

                      <div>
                        <h3 className="font-semibold text-white">
                          {exercise.name}
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          {exercise.sets} × {exercise.reps}
                        </p>
                      </div>
                    </div>

                    <Clock className="h-4 w-4 text-slate-600 transition group-hover:text-blue-400" />
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => toggleWorkout(today.key)}
                className="lf-button mt-6 w-full px-5 py-3.5 text-sm"
              >
                {todayDone ? "Completed ✓ (tap to undo)" : "Mark Workout Complete ✓"}
              </button>
            </>
          )}
        </section>

        {/* ================= WEEKLY WORKOUT OVERVIEW ================= */}

        <section className="lf-card lf-section">
          <div className="mb-7">
            <h2 className="lf-title text-lg">Weekly Workout Overview</h2>

            <p className="lf-muted mt-1 text-sm">
              Review your workout activity throughout the week
            </p>
          </div>

          <div className="space-y-3">
            {week.map((item) => {
              const status = STATUS[item.status];

              return (
                <div
                  key={item.key}
                  className="grid gap-4 rounded-xl border border-white/5 bg-slate-900/50 p-4 transition hover:border-blue-500/20 hover:bg-slate-800/60 md:grid-cols-[100px_1fr_auto] md:items-center"
                >
                  {/* Date */}

                  <div>
                    <p className="text-xs font-bold text-slate-600">
                      {item.dayName.slice(0, 3).toUpperCase()}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-white">
                      {item.date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Workout */}

                  <div>
                    <p className="font-semibold text-slate-200">
                      {item.isRest ? "Rest Day" : `${item.type} Day`}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {item.isRest
                        ? "Recovery"
                        : `${item.exercises.length} exercises`}
                    </p>
                  </div>

                  {/* Status */}

                  <div
                    className={`flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold text-white ${status.color}`}
                  >
                    <span>{status.icon}</span>
                    <span>{status.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Week;