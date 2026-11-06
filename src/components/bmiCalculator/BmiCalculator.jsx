import { useState } from "react";
import { useFitnessStore } from "../../zustand/store/useFitnessStore";


const ZONES = {
  Underweight: {
    name: "Build Zone",
    description: "Focus on strength training and nutrient-dense meals.",
  },
  Normal: {
    name: "Maintain Zone",
    description: "Keep a balanced mix of cardio, strength, and recovery.",
  },
  Overweight: {
    name: "Burn Zone",
    description: "Focus on regular cardio and consistent daily activity.",
  },
  "Obesity range": {
    name: "Gentle Start Zone",
    description: "Start with low-impact activity and build up gradually.",
  },
};



const BmiCalculator = () => {
  // Store values
  const setVitals = useFitnessStore((state) => state.setVitals);
  const clearVitals = useFitnessStore((state) => state.clearVitals);
  const bmi = useFitnessStore((state) => state.bmi);
  const bmiCategory = useFitnessStore((state) => state.bmiCategory);
  const storedWeight = useFitnessStore((state) => state.weight);
  const storedHeight = useFitnessStore((state) => state.height);
  const storedCalories = useFitnessStore((state) => state.calories);

  // Form inputs only (start from persisted values)
  const [weight, setWeight] = useState(storedWeight ? String(storedWeight) : "");
  const [height, setHeight] = useState(storedHeight ? String(storedHeight) : "");
  const [calories, setCalories] = useState(
    storedCalories ? String(storedCalories) : "",
  );
  const [error, setError] = useState("");

  // Derived from the store, so it also works after a page refresh
  const suggestedZone = bmiCategory ? ZONES[bmiCategory] : null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const weightValue = Number(weight);
    const heightValue = Number(height);
    const caloriesValue = Number(calories);

    if (
      !weight.trim() ||
      !height.trim() ||
      !calories.trim() ||
      !Number.isFinite(weightValue) ||
      !Number.isFinite(heightValue) ||
      !Number.isFinite(caloriesValue) ||
      weightValue < 20 ||
      heightValue < 50 ||
      caloriesValue <= 0 ||
      weightValue > 500 ||
      heightValue > 300 ||
      caloriesValue > 15000
    ) {
      setError(
        "Enter valid values. Weight 20-500 kg, height 50-300 cm, and calories up to 15,000.",
      );
      clearVitals(); // don't show stale results next to the error
      return;
    }

    setError("");

    // The store calculates BMI and category
    setVitals({
      weight: weightValue,
      height: heightValue,
      calories: caloriesValue,
    });
  };

  return (
    <>
      {/* Vitals input form */}
      <section className="px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <form
            onSubmit={handleSubmit}
            className="w-full min-h-[650px] rounded-xl border border-gray-200 bg-white p-8 shadow-lg"
          >
            <h3 className="mb-8 text-2xl font-bold text-gray-800">
              VITALS INPUT
            </h3>

            {/* Weight */}
            <div className="mb-6">
              <label
                htmlFor="weight"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Weight (kg):
              </label>

              <input
                type="number"
                id="weight"
                name="weight"
                min="20"
                max="500"
                step="any"
                required
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-black"
              />
            </div>

            {/* Height */}
            <div className="mb-6">
              <label
                htmlFor="height"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Height (cm):
              </label>

              <input
                type="number"
                id="height"
                name="height"
                min="50"
                max="300"
                step="any"
                required
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-black"
              />
            </div>

            {/* Calories */}
            <div className="mb-8">
              <label
                htmlFor="calories"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Daily Calories Intake:
              </label>

              <input
                type="number"
                id="calories"
                name="calories"
                min="1"
                max="15000"
                step="1"
                required
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-black"
              />
            </div>

            {/* Error message */}
            {error && (
              <p
                role="alert"
                className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600"
              >
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Submit
            </button>

            {/* Results */}
            <div
              aria-live="polite"
              className="mt-10 border-t border-gray-300 pt-8"
            >
              <div className="flex flex-col gap-8 sm:flex-row">
                {/* BMI */}
                <div className="flex-1">
                  <label className="text-sm font-semibold text-gray-500">
                    BMI
                  </label>

                  <h2 className="mt-2 text-3xl font-bold text-gray-800">
                    {bmi !== null ? bmi.toFixed(1) : "--"}
                  </h2>

                  <h5
                    className={`mt-1 text-sm font-medium ${
                      bmiCategory === "Normal"
                        ? "text-green-600"
                        : bmiCategory
                          ? "text-amber-600"
                          : "text-gray-500"
                    }`}
                  >
                    {bmiCategory || "Enter your vitals"}
                  </h5>
                </div>

                {/* Suggested Zone */}
                <div className="flex-1">
                  <label className="text-sm font-semibold text-gray-500">
                    Suggested zone
                  </label>

                  <h2 className="mt-2 text-3xl font-bold text-gray-800">
                    {suggestedZone?.name || "--"}
                  </h2>

                  <h5 className="mt-1 text-sm font-medium text-gray-500">
                    {suggestedZone?.description ||
                      "Submit your details to see your suggested focus."}
                  </h5>

                  {storedCalories > 0 && (
                    <p className="mt-3 text-sm text-gray-500">
                      Daily intake entered:{" "}
                      <span className="font-semibold text-gray-700">
                        {storedCalories.toLocaleString()} kcal
                      </span>
                    </p>
                  )}
                </div>
              </div>

              <p className="mt-6 text-xs leading-5 text-gray-500">
                BMI categories are intended for adults and are a screening
                measure, not a diagnosis. A suitable calorie target also depends
                on factors such as age, sex, activity level, and goals.
              </p>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default BmiCalculator;
