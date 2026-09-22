const Plan = () => {
  const Goals = [
    {
      title: "Build Muscle",
      icon: "💪",
    },
    {
      title: "Lose Weight",
      icon: "🔥",
    },
    {
      title: "Maintain Weight",
      icon: "⚖️",
    },
    {
      title: "Improve Fitness",
      icon: "🏃",
    },
    {
      title: "Increase Strength",
      icon: "🏋️",
    },
  ];

  const Levels = [
    {
      title: "Beginner",
      icon: "🌱",
    },
    {
      title: "Intermediate",
      icon: "⚡",
    },
    {
      title: "Advanced",
      icon: "🔥",
    },
  ];

  const Durations = [
    "30 min",
    "45 min",
    "60 min",
    "75 min",
    "90 min",
  ];

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

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

      {/* ================= HEADER ================= */}
      <div className="mb-10 text-center">
        <p className="mb-2 text-sm font-bold tracking-[0.2em] text-blue-500">
          YOUR FITNESS PLAN
        </p>

        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Build a healthier, stronger you.
        </h1>

        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
          Set your goals, choose your preferences, and let's create a plan
          that works for you.
        </p>
      </div>

      {/* ================= GOALS ================= */}
      <section className="mx-auto mb-8 w-full max-w-6xl rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
        <h2 className="mb-6 text-center text-xl font-bold text-gray-900">
          Your Goals
        </h2>

        <div className="flex gap-4 overflow-x-auto pb-2">
          {Goals.map((goal) => (
            <div
              key={goal.title}
              className="flex min-w-[160px] flex-1 cursor-pointer flex-col items-center justify-center rounded-xl border border-gray-200 p-5 transition duration-200 hover:border-blue-500 hover:bg-blue-50 hover:shadow-md"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-2xl">
                {goal.icon}
              </div>

              <h3 className="text-center text-sm font-semibold text-gray-800">
                {goal.title}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* ================= EXPERIENCE LEVEL ================= */}
      <section className="mx-auto mb-8 w-full max-w-6xl rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
        <h2 className="mb-6 text-center text-xl font-bold text-gray-900">
          Your Experience Level
        </h2>

        <div className="flex flex-wrap justify-center gap-4">
          {Levels.map((level) => (
            <div
              key={level.title}
              className="flex w-full max-w-xs cursor-pointer flex-col items-center justify-center rounded-xl border border-gray-200 p-5 transition duration-200 hover:border-blue-500 hover:bg-blue-50 hover:shadow-md sm:w-52"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-2xl">
                {level.icon}
              </div>

              <h3 className="text-sm font-semibold text-gray-800">
                {level.title}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* ================= WORKOUT DURATION ================= */}
      <section className="mx-auto mb-8 w-full max-w-6xl rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
        <h2 className="mb-6 text-center text-xl font-bold text-gray-900">
          Workout Duration
        </h2>

        <div className="flex flex-wrap justify-center gap-4">
          {Durations.map((duration) => (
            <button
              key={duration}
              className="min-w-[110px] rounded-xl border border-gray-200 px-6 py-4 text-sm font-semibold text-gray-800 transition duration-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
            >
              {duration}
            </button>
          ))}
        </div>
      </section>

      {/* ================= WEEKLY SCHEDULE ================= */}
      <section className="mx-auto mb-8 w-full max-w-6xl rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
        <h2 className="mb-6 text-center text-xl font-bold text-gray-900">
          Weekly Workout Schedule
        </h2>

        {/* 
          flex-nowrap = keeps all 7 days on one line
          overflow-x-auto = allows scrolling on small screens
        */}
        <div className="flex flex-nowrap gap-3 overflow-x-auto pb-2">
          {Schedule.map((item) => (
            <div
              key={item.day}
              className="flex min-w-[120px] flex-1 cursor-pointer flex-col items-center justify-center rounded-xl border border-gray-200 p-4 transition duration-200 hover:border-blue-500 hover:bg-blue-50 hover:shadow-md"
            >
              <h3 className="mb-3 whitespace-nowrap text-sm font-semibold text-gray-800">
                {item.day}
              </h3>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-xl">
                {item.icon}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= WORKOUT SPLIT ================= */}
      <section className="mx-auto mb-8 w-full max-w-6xl rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
        <h2 className="mb-6 text-center text-xl font-bold text-gray-900">
          Workout Split
        </h2>

        <div className="flex flex-col gap-4">
          {Splits.map((split) => (
            <div
              key={split.title}
              className="cursor-pointer rounded-xl border border-gray-200 p-5 transition duration-200 hover:border-blue-500 hover:bg-blue-50 hover:shadow-md"
            >
              <h3 className="text-base font-bold text-gray-900">
                {split.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {split.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CREATE BUTTON ================= */}
      <div className="flex justify-center">
        <button className="w-full max-w-md rounded-full bg-blue-500 px-8 py-4 text-sm font-bold text-white shadow-md transition duration-200 hover:bg-blue-600 hover:shadow-lg sm:text-base">
          Create My Plan →
        </button>
      </div>

      {/* ================= INFO MESSAGE ================= */}
      <div className="mx-auto mt-8 flex w-full max-w-6xl items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-5 text-center">
        <span className="text-xl">💡</span>

        <p className="text-sm leading-6 text-gray-500">
          Your plan will be saved and you can update it anytime from the Plan
          page.
        </p>
      </div>

    </div>
  );
};

export default Plan;