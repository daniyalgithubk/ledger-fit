export const GOALS = {
  lose: { label: "Lose fat", factor: 0.85, split: { p: 0.35, c: 0.4, f: 0.25 } },
  maintain: { label: "Maintain", factor: 1, split: { p: 0.3, c: 0.45, f: 0.25 } },
  gain: { label: "Gain", factor: 1.1, split: { p: 0.3, c: 0.45, f: 0.25 } },
};

// A starting suggestion only. The user can always change it.
export function suggestGoal(category) {
  if (category === "Underweight") return "gain";
  if (category === "Overweight" || category === "Obesity range") return "lose";
  return "maintain";
}

export function getMacroTargets(calories, goal = "maintain") {
  const g = GOALS[goal] || GOALS.maintain;
  const kcal = Math.round(Number(calories) * g.factor);

  return {
    kcal,
    protein: Math.round((kcal * g.split.p) / 4),
    carbs: Math.round((kcal * g.split.c) / 4),
    fat: Math.round((kcal * g.split.f) / 9),
  };
}