import WeeklyLedger from '../components/weekilyLedger/WeeklyLedger'
import BmiRange from '../components/bmiRange/BmiRange'
import BmiCalculator from '../components/bmiCalculator/BmiCalculator'
import ActivityChart from '../components/activityChart/ActivityChart'

const Home = () => {
  return (
    <>
      {/* Start */}
      <section className="flex min-h-[80vh] flex-col items-center justify-center gap-6 px-4 text-center">
        <p className="text-xs font-semibold tracking-widest sm:text-sm">
          BASED ON YOUR VITALS
        </p>

        <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
          ENTER YOUR NUMBERS
          <br className="hidden sm:block" />
          <span className="sm:inline"> </span>
          GET TODAY'S WORKOUT
        </h1>

        <h4 className="max-w-xs text-sm text-gray-600 sm:max-w-md sm:text-base">
          Your BMI and calorie intake decide the zone. The zone decides the
          sets, the reps, and the day you rest. No guesswork, no generic
          plan.
        </h4>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-10">
          <button className="rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-600">
            Build my week →
          </button>

          <p className="text-sm text-gray-500">takes 20 seconds</p>
        </div>
      </section>

      <BmiCalculator />
      <ActivityChart />
      <WeeklyLedger />
      <BmiRange />
    </>
  );
};

export default Home;