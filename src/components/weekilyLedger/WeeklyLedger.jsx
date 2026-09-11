const WeeklyLedger = () => {
  const workouts = [
    {
      day: "MON",
      sets: "5 × 5",
      time: "55 min",
      workout: "Push",
      zone: "Build",
      calories: "420",
      zoneColor: "text-pink-500",
      dotColor: "bg-pink-500",
    },
    {
      day: "TUE",
      sets: "4 × 8",
      time: "50 min",
      workout: "Pull",
      zone: "Build",
      calories: "380",
      zoneColor: "text-pink-500",
      dotColor: "bg-pink-500",
    },
    {
      day: "WED",
      sets: "Recovery",
      time: "30 min",
      workout: "Mobility",
      zone: "Recovery",
      calories: "150",
      zoneColor: "text-cyan-400",
      dotColor: "bg-cyan-400",
    },
    {
      day: "THU",
      sets: "5 × 5",
      time: "60 min",
      workout: "Legs",
      zone: "Build",
      calories: "460",
      zoneColor: "text-pink-500",
      dotColor: "bg-pink-500",
    },
    {
      day: "FRI",
      sets: "Zone 2",
      time: "35 min",
      workout: "Cardio",
      zone: "Cut",
      calories: "340",
      zoneColor: "text-lime-400",
      dotColor: "bg-lime-400",
    },
    {
      day: "SAT",
      sets: "3 × 12",
      time: "45 min",
      workout: "Full body",
      zone: "Maintenance",
      calories: "400",
      zoneColor: "text-yellow-400",
      dotColor: "bg-yellow-400",
    },
    {
      day: "SUN",
      sets: "—",
      time: "—",
      workout: "Rest",
      zone: "Rest",
      calories: "—",
      zoneColor: "text-gray-500",
      dotColor: "bg-gray-500",
    },
  ];

  return (
    <section className="px-4 py-10">
      <div className="mx-auto max-w-6xl">

        {/* Heading */}
        <p className="mb-3 text-sm tracking-widest text-gray-500">
          WEEKLY LEDGER
        </p>

        <h2 className="mb-10 text-4xl font-bold tracking-tight text-black">
          SEVEN DAYS, WRITTEN FROM YOUR ZONE
        </h2>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-gray-800">

          {workouts.map((item, index) => (
            <div
              key={item.day}
              className={`grid grid-cols-3 items-center px-6 py-5 ${
                index !== workouts.length - 1
                  ? "border-b border-gray-800"
                  : ""
              }`}
            >

              {/* Day / Sets / Time */}
              <div>
                <p className="mb-3 text-sm font-medium text-gray-400">
                  {item.day}
                </p>

                <p className="text-sm text-gray-400">
                  {item.sets}
                </p>

                <p className="mt-2 text-sm text-gray-400">
                  {item.time}
                </p>
              </div>

              {/* Workout / Zone */}
              <div>
                <h3 className="text-base font-medium text-black">
                  {item.workout}
                </h3>

                <div
                  className={`mt-3 flex items-center gap-2 text-sm ${item.zoneColor}`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${item.dotColor}`}
                  ></span>

                  <span>{item.zone}</span>
                </div>
              </div>

              {/* Calories */}
              <div className="text-right">
                <span className="text-sm text-gray-900">
                  {item.calories}
                </span>
              </div>

            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default WeeklyLedger;