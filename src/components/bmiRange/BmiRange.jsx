import { motion } from "framer-motion";
import { Moon, Flame, Scale, Dumbbell } from "lucide-react";
import { useFitnessStore } from "../../zustand/store/useFitnessStore";

const ZONES = [
  { type: "Recovery", range: "Any BMI, deload week", icon: Moon, text: "text-emerald-300", bg: "bg-emerald-500/10", ring: "border-emerald-500/40" },
  { type: "Cut", range: "BMI 25+, calorie deficit", icon: Flame, text: "text-red-300", bg: "bg-red-500/10", ring: "border-red-500/40" },
  { type: "Maintenance", range: "BMI 18.5–24.9, near maintenance", icon: Scale, text: "text-amber-300", bg: "bg-amber-500/10", ring: "border-amber-500/40" },
  { type: "Build", range: "BMI below 18.5, calorie surplus", icon: Dumbbell, text: "text-pink-300", bg: "bg-pink-500/10", ring: "border-pink-500/40" },
];

const ACTIVE = {
  Underweight: "Build",
  Normal: "Maintenance",
  Overweight: "Cut",
  "Obesity range": "Cut",
};

const BmiRange = () => {
  const category = useFitnessStore((s) => s.bmiCategory);
  const activeZone = ACTIVE[category];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {ZONES.map(({ type, range, icon: Icon, text, bg, ring }, i) => {
        const isActive = activeZone === type;
        return (
          <motion.div
            key={type}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            className={`lf-card lf-card-hover p-6 ${isActive ? `${ring} shadow-[0_0_30px_-10px_currentColor] ${text}` : ""}`}
          >
            <div className="flex items-start justify-between">
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${bg} ${text}`}>
                <Icon className="h-5 w-5" />
              </span>
              {isActive && (
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${bg} ${text}`}>
                  You are here
                </span>
              )}
            </div>
            <h3 className="mt-5 text-xl font-bold text-white">{type}</h3>
            <p className="mt-1 text-sm text-slate-400">{range}</p>
          </motion.div>
        );
      })}
    </div>
  );
};

export default BmiRange;