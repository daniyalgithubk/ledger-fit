import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, BarChart3, CalendarDays, Dumbbell, HeartPulse, Salad, Sparkles, Target, Moon,
} from "lucide-react";

import WeeklyLedger from "../components/weekilyLedger/WeeklyLedger";
import BmiRange from "../components/bmiRange/BmiRange";
import BmiCalculator from "../components/bmiCalculator/BmiCalculator";
import ActivityChart from "../components/activityChart/ActivityChart";
import Reveal from "../components/ui/Reveal";
import AnimatedNumber from "../components/ui/AnimatedNumber";
import { useFitnessStore } from "../zustand/store/useFitnessStore";
import workoutPlans from "../components/data/workoutPlans";

const CAT_STYLE = {
  Underweight: "bg-sky-500/10 text-sky-300",
  Normal: "bg-emerald-500/10 text-emerald-300",
  Overweight: "bg-orange-500/10 text-orange-300",
  "Obesity range": "bg-red-500/10 text-red-300",
};

const fade = (d = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay: d, ease: [0.22, 1, 0.36, 1] },
});

const features = [
  { icon: HeartPulse, title: "Track your vitals", text: "BMI and calorie target" },
  { icon: CalendarDays, title: "Build your week", text: "A schedule that fits your zone" },
  { icon: BarChart3, title: "Track progress", text: "Weekly burn at a glance" },
];

const SectionHeader = ({ step, title, text }) => (
  <Reveal className="mb-6">
    <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-400">{step}</p>
    <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{title}</h2>
    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{text}</p>
  </Reveal>
);

const Section = ({ children, id }) => (
  <section id={id} className="mx-auto max-w-6xl scroll-mt-24 px-4 py-10 sm:px-6">
    {children}
  </section>
);

const Home = () => {
  const bmi = useFitnessStore((s) => s.bmi);
  const bmiCategory = useFitnessStore((s) => s.bmiCategory);
  const calories = useFitnessStore((s) => s.calories);

  const todayIdx = (new Date().getDay() + 6) % 7;
  const todayPlan =
    bmiCategory && workoutPlans[bmiCategory] ? workoutPlans[bmiCategory][todayIdx] : null;
  const isRest = todayPlan?.workout === "Rest";
  const dateLabel = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="text-white">
      {/* HERO */}
      <section className="lf-hero-bg relative overflow-hidden border-b border-white/5">
        <div className="lf-grid pointer-events-none absolute inset-0" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div>
            <motion.div {...fade(0)} className="mb-6 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                <Sparkles className="h-4 w-4 text-blue-400" />
              </span>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
                Based on your vitals
              </p>
            </motion.div>

            <motion.h1
              {...fade(0.1)}
              className="text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
            >
              Enter your numbers.
              <br />
              <span className="lf-gradient-text">Get today's workout.</span>
            </motion.h1>

            <motion.p {...fade(0.2)} className="mt-6 max-w-xl text-base leading-7 text-slate-400">
              Your BMI and calorie intake define your training zone. Your zone guides the sets,
              reps and recovery. No guesswork, no generic plan.
            </motion.p>

            <motion.div {...fade(0.3)} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/plan" className="lf-button px-6 py-3.5 text-sm">
                Build my week
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#vitals" className="lf-ghost px-6 py-3.5 text-sm">
                {bmi ? "Update my vitals" : "Enter my vitals"}
              </a>
            </motion.div>

            <motion.div {...fade(0.4)} className="mt-5 flex items-center gap-2 text-xs text-slate-500">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Takes about 20 seconds
            </motion.div>
          </div>

          {/* Dashboard card */}
          <motion.div {...fade(0.25)} className="lf-card p-5 sm:p-6">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-400">
                  Your dashboard
                </p>
                <h2 className="mt-1.5 text-xl font-bold">Today's overview</h2>
                <p className="mt-0.5 text-xs text-slate-500">{dateLabel}</p>
              </div>
              <motion.span
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10"
              >
                <Dumbbell className="h-5 w-5 text-blue-400" />
              </motion.span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/5 bg-slate-900/60 p-4">
                <HeartPulse className="mb-3 h-4 w-4 text-blue-400" />
                <p className="text-xs text-slate-400">BMI</p>
                <p className="mt-1 text-3xl font-extrabold tabular-nums">
                  {bmi ? <AnimatedNumber value={bmi} decimals={1} /> : "--"}
                </p>
                {bmiCategory ? (
                  <span
                    className={`mt-1.5 inline-block rounded-md px-2 py-0.5 text-[10px] font-semibold ${CAT_STYLE[bmiCategory]}`}
                  >
                    {bmiCategory}
                  </span>
                ) : (
                  <p className="mt-1.5 text-[11px] text-slate-500">Enter your vitals</p>
                )}
              </div>

              <div className="rounded-xl border border-white/5 bg-slate-900/60 p-4">
                <Target className="mb-3 h-4 w-4 text-orange-400" />
                <p className="text-xs text-slate-400">Daily target</p>
                <p className="mt-1 text-3xl font-extrabold tabular-nums">
                  {calories ? <AnimatedNumber value={calories} /> : "--"}
                </p>
                <p className="mt-1.5 text-[11px] text-slate-500">kcal per day</p>
              </div>
            </div>

            <div className="mt-3 rounded-xl border border-blue-500/15 bg-blue-500/[0.06] p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                Today's focus
              </p>

              {todayPlan ? (
                <>
                  <div className="mt-1.5 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{todayPlan.workout}</p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {isRest ? "Recover and eat well today" : `${todayPlan.sets} · ${todayPlan.time}`}
                      </p>
                    </div>
                    {isRest ? (
                      <Moon className="h-5 w-5 text-slate-400" />
                    ) : (
                      <span className="rounded-lg bg-orange-500/10 px-2.5 py-1 text-xs font-bold text-orange-300">
                        {todayPlan.calories} kcal
                      </span>
                    )}
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${((todayIdx + 1) / 7) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                    />
                  </div>
                  <p className="mt-2 text-[11px] text-slate-500">Day {todayIdx + 1} of 7 this week</p>
                </>
              ) : (
                <>
                  <p className="mt-1.5 font-semibold">Unlock today's workout</p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Add your vitals and your plan appears here.
                  </p>
                  <a href="#vitals" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300">
                    Enter vitals <ArrowRight className="h-3 w-3" />
                  </a>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURE STRIP */}
      <section className="border-b border-white/5 bg-black/10">
        <div className="mx-auto grid max-w-6xl gap-2 px-4 py-5 sm:grid-cols-3 sm:px-6">
          {features.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.08} className="flex items-center gap-4 rounded-xl p-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs text-slate-500">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* STEP 1 */}
      <Section id="vitals">
        <SectionHeader
          step="Step 01"
          title="Start with your numbers"
          text="Enter your weight, height and daily calories. Everything else on this page adapts to them."
        />
        <Reveal>
          <BmiCalculator />
        </Reveal>
      </Section>

      {/* STEP 2 */}
      <Section>
        <SectionHeader
          step="Step 02"
          title="See your weekly burn"
          text="Estimated calories burned per day by your zone plan. Today is highlighted."
        />
        <Reveal>
          <ActivityChart />
        </Reveal>
      </Section>

      {/* STEP 3 */}
      <Section>
        <SectionHeader
          step="Step 03"
          title="Follow your weekly ledger"
          text="Seven days written from your zone: what to train, how long, and how hard."
        />
        <Reveal>
          <WeeklyLedger />
        </Reveal>
      </Section>

      {/* ZONES */}
      <Section>
        <SectionHeader
          step="Your zone"
          title="How zones map to BMI"
          text="BMI is one starting point. Your current zone is highlighted."
        />
        <BmiRange />
      </Section>

      {/* NUTRITION */}
      <Section>
        <Reveal>
          <Link
            to="/diet"
            className="lf-card lf-card-hover group flex items-center justify-between gap-4 p-5 sm:p-6"
          >
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
                <Salad className="h-5 w-5 text-emerald-400" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">Nutrition</p>
                <p className="mt-1 font-semibold">Log meals and get an AI diet plan</p>
                <p className="mt-0.5 text-sm text-slate-500">
                  Describe what you ate. Get calories, macros and a plan for your goal.
                </p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-blue-400 transition group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </Section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20 pt-6 sm:px-6">
        <Reveal>
          <div className="lf-card relative overflow-hidden p-8 text-center sm:p-12">
            <div className="lf-hero-bg pointer-events-none absolute inset-0 opacity-70" />
            <div className="relative">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10">
                <Dumbbell className="h-6 w-6 text-blue-400" />
              </span>
              <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Ready to build your week?
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-400">
                Turn your numbers into a structured training plan and track it with Ledger/Fit.
              </p>
              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <Link to="/plan" className="lf-button px-7 py-3.5 text-sm">
                  Create my plan <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/diet" className="lf-ghost px-7 py-3.5 text-sm">
                  Plan my meals
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
};

export default Home;