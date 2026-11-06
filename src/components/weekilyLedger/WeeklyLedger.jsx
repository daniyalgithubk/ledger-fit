import { useFitnessStore } from "../../zustand/store/useFitnessStore";

const WeeklyLedger = () => {
  const workoutPlans = {
    Normal: [
      {
        day: "MON",
        sets: "4 × 8",
        time: "55 min",
        workout: "Upper Body",
        zone: "Build",
        calories: "350",
        zoneColor: "text-pink-500",
        dotColor: "bg-pink-500",
      },
      {
        day: "TUE",
        sets: "3 × 12",
        time: "40 min",
        workout: "Cardio",
        zone: "Endurance",
        calories: "280",
        zoneColor: "text-lime-400",
        dotColor: "bg-lime-400",
      },
      {
        day: "WED",
        sets: "4 × 10",
        time: "55 min",
        workout: "Lower Body",
        zone: "Build",
        calories: "400",
        zoneColor: "text-pink-500",
        dotColor: "bg-pink-500",
      },
      {
        day: "THU",
        sets: "Recovery",
        time: "30 min",
        workout: "Mobility",
        zone: "Recovery",
        calories: "120",
        zoneColor: "text-cyan-400",
        dotColor: "bg-cyan-400",
      },
      {
        day: "FRI",
        sets: "4 × 10",
        time: "50 min",
        workout: "Full Body",
        zone: "Build",
        calories: "380",
        zoneColor: "text-pink-500",
        dotColor: "bg-pink-500",
      },
      {
        day: "SAT",
        sets: "Zone 2",
        time: "35 min",
        workout: "Cycling / Jogging",
        zone: "Endurance",
        calories: "300",
        zoneColor: "text-lime-400",
        dotColor: "bg-lime-400",
      },
      {
        day: "SUN",
        sets: "—",
        time: "—",
        workout: "Rest",
        zone: "Recovery",
        calories: "—",
        zoneColor: "text-gray-500",
        dotColor: "bg-gray-500",
      },
    ],
    Underweight: [
      {
        day: "MON",
        sets: "3 × 10",
        time: "40 min",
        workout: "Full Body",
        zone: "Strength",
        calories: "250",
        zoneColor: "text-pink-500",
        dotColor: "bg-pink-500",
      },
      {
        day: "TUE",
        sets: "—",
        time: "25 min",
        workout: "Light Walking",
        zone: "Recovery",
        calories: "100",
        zoneColor: "text-cyan-400",
        dotColor: "bg-cyan-400",
      },
      {
        day: "WED",
        sets: "3 × 10",
        time: "40 min",
        workout: "Upper Body",
        zone: "Strength",
        calories: "230",
        zoneColor: "text-pink-500",
        dotColor: "bg-pink-500",
      },
      {
        day: "THU",
        sets: "—",
        time: "—",
        workout: "Rest",
        zone: "Recovery",
        calories: "—",
        zoneColor: "text-gray-500",
        dotColor: "bg-gray-500",
      },
      {
        day: "FRI",
        sets: "3 × 10",
        time: "40 min",
        workout: "Lower Body",
        zone: "Strength",
        calories: "260",
        zoneColor: "text-pink-500",
        dotColor: "bg-pink-500",
      },
      {
        day: "SAT",
        sets: "—",
        time: "25 min",
        workout: "Mobility / Walking",
        zone: "Recovery",
        calories: "100",
        zoneColor: "text-cyan-400",
        dotColor: "bg-cyan-400",
      },
      {
        day: "SUN",
        sets: "—",
        time: "—",
        workout: "Rest",
        zone: "Recovery",
        calories: "—",
        zoneColor: "text-gray-500",
        dotColor: "bg-gray-500",
      },
    ],
    Overweight: [
      {
        day: "MON",
        sets: "3 × 12",
        time: "40 min",
        workout: "Full Body Strength",
        zone: "Build",
        calories: "280",
        zoneColor: "text-pink-500",
        dotColor: "bg-pink-500",
      },
      {
        day: "TUE",
        sets: "Zone 2",
        time: "35 min",
        workout: "Brisk Walking",
        zone: "Endurance",
        calories: "220",
        zoneColor: "text-lime-400",
        dotColor: "bg-lime-400",
      },
      {
        day: "WED",
        sets: "3 × 12",
        time: "40 min",
        workout: "Upper Body",
        zone: "Build",
        calories: "260",
        zoneColor: "text-pink-500",
        dotColor: "bg-pink-500",
      },
      {
        day: "THU",
        sets: "Zone 2",
        time: "35 min",
        workout: "Cycling",
        zone: "Endurance",
        calories: "230",
        zoneColor: "text-lime-400",
        dotColor: "bg-lime-400",
      },
      {
        day: "FRI",
        sets: "3 × 12",
        time: "40 min",
        workout: "Lower Body",
        zone: "Build",
        calories: "300",
        zoneColor: "text-pink-500",
        dotColor: "bg-pink-500",
      },
      {
        day: "SAT",
        sets: "Zone 2",
        time: "30 min",
        workout: "Walking / Swimming",
        zone: "Endurance",
        calories: "200",
        zoneColor: "text-lime-400",
        dotColor: "bg-lime-400",
      },
      {
        day: "SUN",
        sets: "—",
        time: "—",
        workout: "Rest",
        zone: "Recovery",
        calories: "—",
        zoneColor: "text-gray-500",
        dotColor: "bg-gray-500",
      },
    ],
    "Obesity range": [
      {
        day: "MON",
        sets: "2–3 × 10",
        time: "25 min",
        workout: "Seated Strength",
        zone: "Build",
        calories: "150",
        zoneColor: "text-pink-500",
        dotColor: "bg-pink-500",
      },
      {
        day: "TUE",
        sets: "Easy pace",
        time: "15–20 min",
        workout: "Walking",
        zone: "Endurance",
        calories: "100",
        zoneColor: "text-lime-400",
        dotColor: "bg-lime-400",
      },
      {
        day: "WED",
        sets: "2–3 × 10",
        time: "25 min",
        workout: "Low-Impact Full Body",
        zone: "Build",
        calories: "160",
        zoneColor: "text-pink-500",
        dotColor: "bg-pink-500",
      },
      {
        day: "THU",
        sets: "Easy pace",
        time: "15–20 min",
        workout: "Cycling / Water Walking",
        zone: "Endurance",
        calories: "100",
        zoneColor: "text-lime-400",
        dotColor: "bg-lime-400",
      },
      {
        day: "FRI",
        sets: "2–3 × 10",
        time: "25 min",
        workout: "Seated Strength",
        zone: "Build",
        calories: "150",
        zoneColor: "text-pink-500",
        dotColor: "bg-pink-500",
      },
      {
        day: "SAT",
        sets: "Easy pace",
        time: "15 min",
        workout: "Gentle Mobility",
        zone: "Recovery",
        calories: "70",
        zoneColor: "text-cyan-400",
        dotColor: "bg-cyan-400",
      },
      {
        day: "SUN",
        sets: "—",
        time: "—",
        workout: "Rest",
        zone: "Recovery",
        calories: "—",
        zoneColor: "text-gray-500",
        dotColor: "bg-gray-500",
      },
    ],
  };

  const bmi = useFitnessStore((state) => state.bmi);
  const bmiCategory = useFitnessStore((state) => state.bmiCategory);

  const workouts = bmiCategory
    ? workoutPlans[bmiCategory] || workoutPlans.Normal
    : workoutPlans.Normal;

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
                index !== workouts.length - 1 ? "border-b border-gray-800" : ""
              }`}
            >
              {/* Day / Sets / Time */}
              <div>
                <p className="mb-3 text-sm font-medium text-gray-400">
                  {item.day}
                </p>

                <p className="text-sm text-gray-400">{item.sets}</p>

                <p className="mt-2 text-sm text-gray-400">{item.time}</p>
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
                <span className="text-sm text-gray-900">{item.calories}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WeeklyLedger;
