export const GOALS = {
    lose: { label: "Lose fat", factor: 0.85, split: { p: 0.35, c: 0.4, f: 0.25 } },
  maintain: { label: "Maintain", factor: 1, split: { p: 0.3, c: 0.45, f: 0.25 } },
  gain: { label: "Gain", factor: 1.1, split: { p: 0.3, c: 0.45, f: 0.25 } },
}


export function suggestGoal(category){
    if(category == "Underweight") return "again";
    if(category == "Overweight" || category == "Obesity range") return "lose";
    return "maintain";
}


export function getMoretargets(calories, goal = "maintain"){
    const g = GOALS[goal] || GOALS.maintain;
    const Kcal = Math.round(Number(calories) * g.factor);

    return {
        Kcal, 
        protein: Math.round((Kcal * g.split.p / 4)),
        carbs: Math.round((Kcal * g.split.c / 4)),
        fats: Math.round((Kcal * g.split.f / 9)),
    };
}