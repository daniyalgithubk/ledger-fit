import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Dumbbell, Flame, Scale, HeartPulse, Target, Activity, Trophy, ArrowRight,
} from "lucide-react";
import { useFitnessStore } from "../../zustand/store/useFitnessStore";
import PageHeader from "../../components/ui/PageHeader";
import SectionCard from "../../components/ui/SectionCard";
import Reveal from "../../components/ui/Reveal";
import AnimatedNumber from "../../components/ui/AnimatedNumber";

// Sample data: the app does not record these yet
const SAMPLE_PROGRESS = [
  { title: "Weight", current: "72 kg", target: "68 kg", percentage: 70 },
  { title: "Strength", current: "85 kg", target: "100 kg", percentage: 85 },
  { title: "Weekly goal", current: "4 / 5", target: "5 workouts", percentage: 80 },
];

const SAMPLE_LIFTS = [
  { exercise: "Squats", current: "85 kg", improvement: "+15 kg" },
  { exercise: "Bench Press", current: "70 kg", improvement: "+10 kg" },
  { exercise: "Deadlift", current: "110 kg", improvement: "+20 kg" },
  { exercise: "Leg Press", current: "180 kg", improvement: "+25 kg" },
];

const Stat = ({ icon: Icon, color, bg, title, children, sub, i }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay: 0.1 + i * 0.08 }}
    className="lf-card lf-card-hover p-5"
  >
    <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${bg}`}>
      <Icon className={`h-5 w-5 ${color}`} />
    </span>
    <p className="mt-5 text-sm text-slate-400">{title}</p>
    <p className="mt-1 text-2xl font-extrabold tabular-nums text-white">{children}</p>
    <p className="mt-1 text-xs text-slate-500">{sub}</p>
  </motion.div>
);

const MyProgress = () => {
  const workoutHistory = useFitnessStore((s) => s.workoutHistory) || [];
  const weight = useFitnessStore((s) => s.weight);
  const bmi = useFitnessStore((s) => s.bmi);
  const bmiCategory = useFitnessStore((s) => s.bmiCategory);
  const calories = useFitnessStore((s) => s.calories);

  const workouts = workoutHistory.length;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <PageHeader
        eyebrow="Progress"
        title="My progress"
        text="Track your achievements, performance and fitness journey"
      />

      {/* Live stats */}
      <div className="mx-auto mb-8 grid w-full max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat i={0} icon={Dumbbell} color="text-blue-400" bg="bg-blue-500/10" title="Workouts" sub="Completed so far">
          <AnimatedNumber value={workouts} />
        </Stat>
        <Stat i={1} icon={HeartPulse} color="text-emerald-400" bg="bg-emerald-500/10" title="BMI" sub={bmiCategory || "Add your vitals"}>
          {bmi ? <AnimatedNumber value={bmi} decimals={1} /> : "--"}
        </Stat>
        <Stat i={2} icon={Scale} color="text-cyan-400" bg="bg-cyan-500/10" title="Weight" sub="From your vitals">
          {weight ? (<><AnimatedNumber value={weight} /> kg</>) : "--"}
        </Stat>
        <Stat i={3} icon={Flame} color="text-orange-400" bg="bg-orange-500/10" title="Daily target" sub="kcal per day">
          {calories ? <AnimatedNumber value={calories} /> : "--"}
        </Stat>
      </div>

      {workouts === 0 && (
        <Reveal className="mx-auto mb-8 w-full max-w-4xl">
          <div className="lf-card flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:text-left">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
              <Dumbbell className="h-6 w-6 text-blue-400" />
            </span>
            <div className="flex-1">
              <p className="font-bold text-white">No workouts yet</p>
              <p className="mt-0.5 text-sm text-slate-400">
                Finish your first workout and your stats will start filling in.
              </p>
            </div>
            <Link to="/week" className="lf-button px-5 py-2.5 text-sm">
              Go to my week <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      )}

      {/* Goal progress */}
      <SectionCard
        icon={Target}
        title="Goal progress"
        text="See how close you are to reaching your goals"
        badge="Sample data"
      >
        <div className="space-y-6">
          {SAMPLE_PROGRESS.map((item, i) => (
            <div key={item.title}>
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.current} / {item.target}</p>
                </div>
                <span className="text-sm font-bold text-cyan-300">{item.percentage}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${item.percentage}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: i * 0.12, ease: "easeOut" }}
                />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Strength */}
      <SectionCard
        icon={Activity}
        title="Strength progress"
        text="Your personal best improvements"
        color="text-pink-300"
        bg="bg-pink-500/10"
        badge="Sample data"
      >
        <div className="space-y-3">
          {SAMPLE_LIFTS.map((item) => (
            <div
              key={item.exercise}
              className="flex flex-col gap-3 rounded-xl border border-white/5 bg-slate-900/60 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <Dumbbell className="h-5 w-5 text-blue-400" />
                </span>
                <div>
                  <p className="font-semibold text-white">{item.exercise}</p>
                  <p className="text-xs text-slate-500">Personal best</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <p className="font-bold text-white">{item.current}</p>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                  {item.improvement}
                </span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Achievements link */}
      <Reveal className="mx-auto w-full max-w-4xl">
        <div className="lf-card flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/10">
              <Trophy className="h-6 w-6 text-amber-300" />
            </span>
            <div>
              <h2 className="font-bold text-white">
                {workouts > 0 ? "Great progress!" : "Your first badge is waiting"}
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                {workouts > 0
                  ? `You've completed ${workouts} workout${workouts === 1 ? "" : "s"}.`
                  : "Complete a workout to unlock achievements."}
              </p>
            </div>
          </div>

          <Link to="/profile" className="lf-button px-5 py-3 text-sm">
            View achievements <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Reveal>
    </div>
  );
};

export default MyProgress;