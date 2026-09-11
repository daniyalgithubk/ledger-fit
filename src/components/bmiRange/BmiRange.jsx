const BmiRange = () => {
  const Bmi = [
    {
      type: "Recovery",
      range: "Any BMI, deload week",
      color: "bg-green-500",
    },
    {
      type: "Cut",
      range: "BMI 25+, calories deficit",
      color: "bg-red-500",
    },
    {
      type: "Maintenance",
      range: "BMI 18.5-24.9, near maintenance",
      color: "bg-yellow-500",
    },
    {
      type: "Build",
      range: "BMI 18.5-24.9, calories surplus",
      color: "bg-pink-500",
    },
  ];

  return (
    <section className="px-4 py-10 mb-12">
      {/* Centered container */}
      <div className="mx-auto w-full max-w-6xl">

        {/* Heading */}
        <p className="mb-4 text-sm font-medium tracking-widest text-gray-900">
          HOW ZONES WORK
        </p>

        <h2 className="mb-12 text-4xl font-bold tracking-tight text-black md:text-5xl">
          EVERY ZONE MAPS TO A REAL BMI RANGE
        </h2>

        {/* Zone Cards */}
        <div className="space-y-5">
          {Bmi.map((item, index) => (
            <div
              key={index}
              className="relative rounded-2xl border border-gray-800 px-7 py-8 shadow-lg transition hover:border-gray-700"
            >
              {/* Colored Dot */}
              <div
                className={`mb-8 h-3 w-3 rounded-full ${item.color}`}
              ></div>

              {/* Zone Information */}
              <div>
                <h3 className="mb-2 text-2xl font-semibold text-black">
                  {item.type}
                </h3>

                <p className="text-base text-gray-900">
                  {item.range}
                </p>
              </div>

              {/* Icon */}
              <div className="absolute right-7 top-8 text-2xl text-gray-900">
                {index === 0 && "☾"}
                {index === 1 && "♨"}
                {index === 2 && "〽"}
                {index === 3 && "⚒"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BmiRange;