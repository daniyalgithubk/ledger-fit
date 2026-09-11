const BmiCalculator = () => {
  return (
    <>
      {/* Vitals input form */}
      <section className="px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <form className="w-full min-h-[650px] rounded-xl border border-gray-200 bg-white p-8 shadow-lg">

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
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Submit
            </button>

            {/* Results */}
            <div className="mt-10 border-t border-gray-300 pt-8">
              <div className="flex flex-col gap-8 sm:flex-row">

                {/* BMI */}
                <div className="flex-1">
                  <label className="text-sm font-semibold text-gray-500">
                    BMI
                  </label>

                  <h2 className="mt-2 text-3xl font-bold text-gray-800">
                    23.5
                  </h2>

                  <h5 className="mt-1 text-sm font-medium text-green-600">
                    Normal
                  </h5>
                </div>

                {/* Suggested Zone */}
                <div className="flex-1">
                  <label className="text-sm font-semibold text-gray-500">
                    Suggested zone
                  </label>

                  <h2 className="mt-2 text-3xl font-bold text-gray-800">
                    Build zone
                  </h2>

                  <h5 className="mt-1 text-sm font-medium text-gray-500">
                    Calorie intake supports muscle growth
                  </h5>
                </div>

              </div>
            </div>

          </form>
        </div>
      </section>
    </>
  );
};

export default BmiCalculator;