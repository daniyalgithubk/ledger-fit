const WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Order in which workout types repeat across the selected days
const ROTATIONS = {
  "Push / Pull / Legs": ["Push", "Pull", "Legs"],
  "Upper / Lower": ["Upper", "Lower"],
  "Full Body": ["Full Body"],
  "Custom Split": ["Full Body"], // placeholder until custom splits are built
};

const EXERCISES = {
  Push: ["Bench Press", "Overhead Press", "Incline Dumbbell Press", "Lateral Raise", "Triceps Pushdown", "Chest Fly"],
  Pull: ["Lat Pulldown", "Barbell Row", "Seated Cable Row", "Face Pull", "Biceps Curl", "Hammer Curl"],
  Legs: ["Squat", "Romanian Deadlift", "Leg Press", "Leg Curl", "Calf Raise", "Walking Lunge"],
  Upper: ["Bench Press", "Barbell Row", "Overhead Press", "Lat Pulldown", "Biceps Curl", "Triceps Pushdown"],
  Lower: ["Squat", "Romanian Deadlift", "Leg Press", "Leg Curl", "Calf Raise", "Walking Lunge"],
  "Full Body": ["Squat", "Bench Press", "Barbell Row", "Overhead Press", "Romanian Deadlift", "Plank"],
};

// Exercises per session, based on workout duration
const EXERCISE_COUNT = {
  "30 min": 3,
  "45 min": 4,
  "60 min": 5,
  "75 min": 6,
  "90 min": 6,
};

// Base sets and reps per goal
const GOAL_SETTINGS = {
  "Build Muscle": { sets: 3, reps: "8-12" },
  "Lose Weight": { sets: 3, reps: "12-15" },
  "Maintain Weight": { sets: 3, reps: "10-12" },
  "Improve Fitness": { sets: 3, reps: "12-15" },
  "Increase Strength": { sets: 4, reps: "4-6" },
};

export const generatePlan = ({ goal, level, duration, days, split }) => {
  const rotation = ROTATIONS[split] || ROTATIONS["Full Body"];
  const settings = GOAL_SETTINGS[goal] || GOAL_SETTINGS["Build Muscle"];
  const count = EXERCISE_COUNT[duration] || 5;

  // Beginners do one set fewer, advanced users one more
  let sets = settings.sets;
  if (level === "Beginner") sets = Math.max(2, sets - 1);
  if (level === "Advanced") sets += 1;

  // Put the selected days in calendar order
  const trainingDays = WEEK.filter((day) => days.includes(day));

  let workoutIndex = 0;

  const schedule = WEEK.map((day) => {
    if (!trainingDays.includes(day)) {
      return { day, isRest: true };
    }

    const type = rotation[workoutIndex % rotation.length];
    workoutIndex += 1;

    return {
      day,
      isRest: false,
      type,
      exercises: EXERCISES[type].slice(0, count).map((name) => ({
        name,
        sets,
        reps: settings.reps,
      })),
    };
  });

  return { goal, level, duration, split, schedule };
};