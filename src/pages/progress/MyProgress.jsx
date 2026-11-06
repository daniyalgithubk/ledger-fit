import {
  TrendingUp,
  Dumbbell,
  Flame,
  Clock,
  Target,
  Activity,
  Trophy,
} from "lucide-react";

const MyProgress = () => {
  const stats = [
    {
      title: "Workouts",
      value: "42",
      description: "Total workouts",
      icon: Dumbbell,
    },
    {
      title: "Calories",
      value: "18,450",
      description: "Calories burned",
      icon: Flame,
    },
    {
      title: "Training Time",
      value: "31h 20m",
      description: "Total training",
      icon: Clock,
    },
    {
      title: "Streak",
      value: "12 Days",
      description: "Current streak",
      icon: TrendingUp,
    },
  ];

  const progress = [
    {
      title: "Weight",
      current: "72 kg",
      target: "68 kg",
      percentage: 70,
    },
    {
      title: "Strength",
      current: "85 kg",
      target: "100 kg",
      percentage: 85,
    },
    {
      title: "Weekly Goal",
      current: "4 / 5",
      target: "5 workouts",
      percentage: 80,
    },
  ];

  const exercises = [
    {
      exercise: "Squats",
      current: "85 kg",
      improvement: "+15 kg",
    },
    {
      exercise: "Bench Press",
      current: "70 kg",
      improvement: "+10 kg",
    },
    {
      exercise: "Deadlift",
      current: "110 kg",
      improvement: "+20 kg",
    },
    {
      exercise: "Leg Press",
      current: "180 kg",
      improvement: "+25 kg",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

      {/* ================= HEADER ================= */}
      <div className="mb-10 text-center">
        <p className="mb-2 text-sm font-semibold tracking-widest text-blue-500">
          PROGRESS
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          My Progress
        </h1>

        <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-500 sm:text-base">
          Track your achievements, performance and fitness journey
        </p>
      </div>

      {/* ================= STATISTICS ================= */}
      <div className="mx-auto mb-8 grid w-full max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                  <Icon className="h-5 w-5 text-blue-500" />
                </div>

                <TrendingUp className="h-4 w-4 text-green-500" />

              </div>

              <p className="mt-5 text-sm text-gray-500">
                {stat.title}
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {stat.value}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                {stat.description}
              </p>
            </div>
          );
        })}

      </div>

      {/* ================= GOAL PROGRESS ================= */}
      <div className="mx-auto mb-8 w-full max-w-6xl rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">

        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
            <Target className="h-5 w-5 text-blue-500" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Goal Progress
            </h2>

            <p className="text-sm text-gray-500">
              See how close you are to reaching your goals
            </p>
          </div>
        </div>

        <div className="space-y-6">

          {progress.map((item) => (
            <div key={item.title}>

              <div className="mb-2 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {item.title}
                  </p>

                  <p className="text-xs text-gray-500">
                    {item.current} / {item.target}
                  </p>
                </div>

                <span className="text-sm font-bold text-blue-500">
                  {item.percentage}%
                </span>
              </div>

              <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>

            </div>
          ))}

        </div>
      </div>

      {/* ================= PERFORMANCE ================= */}
      <div className="mx-auto mb-8 w-full max-w-6xl rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">

        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
            <Activity className="h-5 w-5 text-blue-500" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Strength Progress
            </h2>

            <p className="text-sm text-gray-500">
              Your personal best improvements
            </p>
          </div>
        </div>

        <div className="space-y-3">

          {exercises.map((item) => (
            <div
              key={item.exercise}
              className="flex flex-col gap-3 rounded-xl bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between"
            >

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
                  <Dumbbell className="h-5 w-5 text-blue-500" />
                </div>

                <div>
                  <p className="font-semibold text-gray-900">
                    {item.exercise}
                  </p>

                  <p className="text-xs text-gray-500">
                    Personal Best
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">

                <p className="font-bold text-gray-900">
                  {item.current}
                </p>

                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                  {item.improvement}
                </span>

              </div>

            </div>
          ))}

        </div>
      </div>

      {/* ================= ACHIEVEMENT ================= */}
      <div className="mx-auto w-full max-w-6xl rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
              <Trophy className="h-6 w-6 text-blue-500" />
            </div>

            <div>
              <h2 className="font-bold text-gray-900">
                Great Progress!
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                You've completed 42 workouts and maintained a 12-day streak.
              </p>
            </div>

          </div>

          <button className="rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600">
            View Achievements
          </button>

        </div>
      </div>

    </div>
  );
};

export default MyProgress;