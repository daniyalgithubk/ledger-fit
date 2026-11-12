import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  Dumbbell,
  HeartPulse,
  Sparkles,
  Target,
} from "lucide-react";

import WeeklyLedger from "../components/weekilyLedger/WeeklyLedger";
import BmiRange from "../components/bmiRange/BmiRange";
import BmiCalculator from "../components/bmiCalculator/BmiCalculator";
import ActivityChart from "../components/activityChart/ActivityChart";
import MealLogger from "../components/mealLogger/MealLogger"

const Home = () => {
  return (
    <div className="lf-page">
      {/* ===================================================== */}
      {/* HERO */}
      {/* ===================================================== */}

      <section className="relative overflow-hidden border-b border-white/5">
        {/* Background glow */}

        <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[120px]" />

        <div className="pointer-events-none absolute right-0 top-20 h-[300px] w-[300px] rounded-full bg-cyan-500/5 blur-[100px]" />

        <div className="relative mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid w-full items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
            {/* ================= HERO CONTENT ================= */}

            <div>
              <div className="mb-6 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                  <Sparkles className="h-4 w-4 text-blue-400" />
                </div>

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
                  Based on your vitals
                </p>
              </div>

              <h1 className="max-w-4xl text-4xl font-black leading-[1.05] tracking-[-0.04em] text-white sm:text-5xl lg:text-7xl">
                Enter your numbers.
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  Get today's workout.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base lg:text-lg">
                Your BMI and calorie intake help define your training zone. Your
                zone guides the sets, reps and recovery. No guesswork, no
                generic plan.
              </p>

              {/* Buttons */}

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <button className="lf-button flex items-center justify-center gap-2 px-6 py-3.5 text-sm">
                  Build my week
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-6 py-3.5 text-sm font-semibold text-slate-300 transition hover:border-blue-500/30 hover:bg-blue-500/5 hover:text-white">
                  Explore Ledger/Fit
                </button>
              </div>

              <div className="mt-5 flex items-center gap-2 text-xs text-slate-600">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Takes about 20 seconds
              </div>
            </div>

            {/* ================= HERO STATS CARD ================= */}

            <div className="relative">
              <div className="lf-card relative overflow-hidden p-5 sm:p-6">
                {/* Card glow */}

                <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-blue-500/10 blur-[70px]" />

                <div className="relative">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-400">
                        Your dashboard
                      </p>

                      <h2 className="mt-2 text-xl font-bold text-white">
                        Today's overview
                      </h2>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                      <Dumbbell className="h-5 w-5 text-blue-400" />
                    </div>
                  </div>

                  {/* Stats */}

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-white/5 bg-slate-900/60 p-4">
                      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
                        <HeartPulse className="h-4 w-4 text-blue-400" />
                      </div>

                      <p className="text-xs text-slate-400">BMI</p>

                      <p className="mt-1 text-2xl font-bold text-white">--</p>

                      <p className="mt-1 text-[10px] text-slate-500">
                        Enter your vitals
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/5 bg-slate-900/60 p-4">
                      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10">
                        <Target className="h-4 w-4 text-orange-400" />
                      </div>

                      <p className="text-xs text-slate-400">Daily Target</p>

                      <p className="mt-1 text-2xl font-bold text-white">--</p>

                      <p className="mt-1 text-[10px] text-slate-500">
                        Calories
                      </p>
                    </div>
                  </div>

                  {/* Workout preview */}

                  <div className="mt-3 rounded-xl border border-blue-500/10 bg-blue-500/5 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                          Today's focus
                        </p>

                        <p className="mt-1 font-semibold text-white">
                          Build your workout
                        </p>
                      </div>

                      <ArrowRight className="h-4 w-4 text-blue-400" />
                    </div>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                      <div className="h-full w-[35%] rounded-full bg-blue-500" />
                    </div>

                    <p className="mt-2 text-[10px] text-slate-500">
                      Complete your vitals to unlock your plan
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* QUICK FEATURES */}
      {/* ===================================================== */}

      <section className="border-b border-white/5 bg-black/10">
        <div className="mx-auto grid max-w-7xl gap-px px-4 py-5 sm:grid-cols-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 rounded-xl p-4">
            <div className="lf-icon-box h-10 w-10 shrink-0">
              <HeartPulse className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Track your vitals
              </p>

              <p className="mt-1 text-xs text-slate-500">
                BMI and calorie information
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl p-4">
            <div className="lf-icon-box h-10 w-10 shrink-0">
              <CalendarDays className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Build your week
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Plan your training schedule
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl p-4">
            <div className="lf-icon-box h-10 w-10 shrink-0">
              <BarChart3 className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">Track progress</p>

              <p className="mt-1 text-xs text-slate-500">
                Follow your weekly activity
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* BMI CALCULATOR */}
      {/* ===================================================== */}

      <section className="lf-container">
        <div className="mb-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
            Step 01
          </p>

          <h2 className="lf-title text-2xl sm:text-3xl">
            Start with your numbers
          </h2>

          <p className="lf-muted mt-2 max-w-2xl text-sm leading-6">
            Enter your basic information to understand where you are starting
            from.
          </p>
        </div>

        <div className="lf-card overflow-hidden">
          <BmiCalculator />
        </div>
      </section>

      {/* ===================================================== */}
      {/* ACTIVITY */}
      {/* ===================================================== */}

      <section className="lf-container pt-0">
        <div className="mb-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
            Step 02
          </p>

          <h2 className="lf-title text-2xl sm:text-3xl">
            Understand your activity
          </h2>

          <p className="lf-muted mt-2 max-w-2xl text-sm leading-6">
            Use your activity information to understand your current training
            pattern.
          </p>
        </div>

        <div className="lf-card overflow-hidden">
          <ActivityChart />
        </div>
      </section>

      {/* ===================================================== */}
      {/* AI MEAL LOGGER */}
      {/* ===================================================== */}

      <section className="lf-container pt-0">
        <div className="mb-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
            Step 03
          </p>

          <h2 className="lf-title text-2xl sm:text-3xl">
            Log your meals with AI
          </h2>

          <p className="lf-muted mt-2 max-w-2xl text-sm leading-6">
            Describe what you ate in plain words and get a calorie estimate.
          </p>
        </div>

        <div
          className="
      lf-card
      overflow-hidden
      [&_h2]:!text-white
      [&_p]:!text-slate-300
      [&_strong]:!text-white
      [&_textarea]:!text-white
      [&_input]:!text-white
    "
        >
          <MealLogger />
        </div>
      </section>

      {/* ===================================================== */}
      {/* WEEKLY LEDGER */}
      {/* ===================================================== */}

      <section className="lf-container pt-0">
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
              Step 03
            </p>
          </div>

          <h2 className="lf-title text-2xl sm:text-3xl">
            Follow your weekly ledger
          </h2>

          <p className="lf-muted mt-2 max-w-2xl text-sm leading-6">
            See your training activity and keep your week moving forward.
          </p>
        </div>

        {/* 
          Dark theme overrides for the existing WeeklyLedger component.
          These selectors force the old dark text to become readable.
        */}

        <div
          className="
            lf-card
            overflow-hidden
            [&_h1]:!text-white
            [&_h2]:!text-white
            [&_h3]:!text-white
            [&_h4]:!text-white
            [&_h5]:!text-white
            [&_h6]:!text-white
            [&_p]:!text-slate-300
            [&_span]:!text-slate-300
            [&_td]:!text-slate-300
            [&_th]:!text-slate-200
            [&_label]:!text-slate-300
          "
        >
          <WeeklyLedger />
        </div>
      </section>

      {/* ===================================================== */}
      {/* BMI RANGE / HOW ZONES WORK */}
      {/* ===================================================== */}

      <section className="lf-container pt-0">
        <div className="mb-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
            Your Zone
          </p>

          <h2 className="lf-title text-2xl sm:text-3xl">
            Understand your BMI range
          </h2>

          <p className="lf-muted mt-2 max-w-2xl text-sm leading-6">
            Use your BMI range as one part of understanding your current
            starting point.
          </p>
        </div>

        {/* 
          Dark theme overrides for BmiRange.
          The original component contains dark/black text,
          so these selectors make it readable on the new dark UI.
        */}

        <div
          className="
            lf-card
            overflow-hidden
            [&_h1]:!text-white
            [&_h2]:!text-white
            [&_h3]:!text-white
            [&_h4]:!text-white
            [&_h5]:!text-white
            [&_h6]:!text-white
            [&_p]:!text-slate-300
            [&_span]:!text-slate-300
            [&_td]:!text-slate-300
            [&_th]:!text-slate-200
            [&_label]:!text-slate-300
          "
        >
          <BmiRange />
        </div>
      </section>

      {/* ===================================================== */}
      {/* FINAL CTA */}
      {/* ===================================================== */}

      <section className="relative overflow-hidden border-t border-white/5">
        <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-[600px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[100px]" />

        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:py-24">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10">
            <Dumbbell className="h-6 w-6 text-blue-400" />
          </div>

          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to build your week?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
            Turn your numbers into a structured training plan and start tracking
            your progress with Ledger/Fit.
          </p>

          <button className="lf-button mt-7 px-7 py-3.5 text-sm">
            Build my week →
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
