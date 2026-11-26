import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  User,
  Target,
  Trophy,
  Edit3,
  LogOut,
  Lock,
  Check,
  ArrowRight,
} from "lucide-react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuthStore } from "../../zustand/store/useAuthStore";
import { useFitnessStore } from "../../zustand/store/useFitnessStore";
import PageHeader from "../../components/ui/PageHeader";
import SectionCard from "../../components/ui/SectionCard";

const GOALS = [
  { title: "Build Muscle", icon: "💪" },
  { title: "Lose Weight", icon: "🔥" },
  { title: "Maintain Weight", icon: "⚖️" },
  { title: "Improve Fitness", icon: "🏃" },
  { title: "Increase Strength", icon: "🏋️" },
];

const inputClass =
  "w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/60 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.12)]";

const Profile = () => {
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const logout = useAuthStore((s) => s.logout);
  const updateProfileData = useAuthStore((s) => s.updateProfileData);

  const plan = useFitnessStore((s) => s.plan);
  const height = useFitnessStore((s) => s.height);
  const weight = useFitnessStore((s) => s.weight);
  const workoutHistory = useFitnessStore((s) => s.workoutHistory) || [];

  // Edit form
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Goals and achievements
  const [goalSaving, setGoalSaving] = useState(null);
  const [goalError, setGoalError] = useState("");
  const [openBadge, setOpenBadge] = useState(null);

  // A goal chosen here wins. Otherwise fall back to the goal from the plan page.
  const activeGoal = profile?.goal || plan?.goal;

  const startEditing = () => {
    setName(user.displayName ?? "");
    setAge(profile?.age ? String(profile.age) : "");
    setError("");
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const ageValue = age === "" ? null : Number(age);

    if (!name.trim()) {
      setError("Name can't be empty.");
      return;
    }
    if (
      ageValue !== null &&
      (!Number.isFinite(ageValue) || ageValue < 10 || ageValue > 100)
    ) {
      setError("Enter an age between 10 and 100.");
      return;
    }

    setSaving(true);
    try {
      await updateProfileData({ name: name.trim(), age: ageValue });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setError("Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const chooseGoal = async (title) => {
    if (title === activeGoal || goalSaving) return;
    setGoalSaving(title);
    setGoalError("");
    try {
      await setDoc(doc(db, "users", user.uid), { goal: title }, { merge: true });
      useAuthStore.setState((s) => ({ profile: { ...s.profile, goal: title } }));
    } catch (e) {
      console.error(e);
      setGoalError("Could not save your goal. Please try again.");
    } finally {
      setGoalSaving(null);
    }
  };

  // ---------- Derived values ----------
  const displayName = user.displayName || user.email.split("@")[0];
  const initial = displayName.charAt(0).toUpperCase();
  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const finishedCount = workoutHistory.length;

  const achievements = [
    { title: "First Workout", description: "Complete your first workout", icon: "🏆", target: 1 },
    { title: "5 Workouts", description: "Complete 5 workouts", icon: "🔥", target: 5 },
    { title: "10 Workouts", description: "Complete 10 workouts", icon: "💪", target: 10 },
  ].map((a) => ({ ...a, unlocked: finishedCount >= a.target }));

  const info = [
    { label: "Age", value: profile?.age ? `${profile.age} years` : "Not set" },
    { label: "Height", value: height ? `${height} cm` : "Not set" },
    { label: "Weight", value: weight ? `${weight} kg` : "Not set" },
    { label: "Member since", value: memberSince },
  ];

  const openAchievement = achievements.find((a) => a.title === openBadge);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <PageHeader
        eyebrow="Profile"
        title="Your profile"
        text="Manage your personal information and fitness goals"
      />

      {/* ================= PROFILE CARD ================= */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="lf-card relative mx-auto mb-6 w-full max-w-4xl overflow-hidden p-5 sm:p-7"
      >
        <div className="lf-hero-bg pointer-events-none absolute inset-0 opacity-60" />

        <div className="relative">
          {isEditing ? (
            <form onSubmit={handleSave} className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="edit-name" className="mb-2 block text-sm font-semibold text-slate-300">
                  Name
                </label>
                <input
                  id="edit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="edit-age" className="mb-2 block text-sm font-semibold text-slate-300">
                  Age
                </label>
                <input
                  id="edit-age"
                  type="number"
                  min="10"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className={inputClass}
                />
              </div>

              {error && (
                <p role="alert" className="text-sm text-red-400 sm:col-span-2">
                  {error}
                </p>
              )}

              <div className="flex gap-3 sm:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="lf-button px-5 py-3 text-sm disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="lf-ghost px-5 py-3 text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-5">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-3xl font-extrabold text-white shadow-lg shadow-blue-500/30">
                  {initial}
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-2xl font-extrabold text-white">{displayName}</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    {plan ? `${plan.level} • ${plan.goal}` : "No plan created yet"}
                  </p>
                  <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{user.email}</span>
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={startEditing} className="lf-button px-5 py-3 text-sm">
                  <Edit3 className="h-4 w-4" />
                  Edit profile
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="lf-ghost px-5 py-3 text-sm hover:!border-red-500/30 hover:!bg-red-500/10 hover:!text-red-300"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* ================= PERSONAL INFORMATION ================= */}
      <SectionCard
        icon={User}
        title="Personal information"
        text="Height and weight come from your BMI calculator"
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {info.map((item) => (
            <div key={item.label} className="rounded-xl border border-white/5 bg-slate-900/60 p-4">
              <p className="text-xs font-medium text-slate-500">{item.label}</p>
              <p
                className={`mt-1 text-lg font-bold ${
                  item.value === "Not set" ? "text-slate-500" : "text-white"
                }`}
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ================= FITNESS GOALS ================= */}
      <SectionCard
        icon={Target}
        title="Fitness goals"
        text="Tap a goal to make it your active goal"
        color="text-orange-400"
        bg="bg-orange-500/10"
      >
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {GOALS.map((goal) => {
            const active = activeGoal === goal.title;
            const savingThis = goalSaving === goal.title;
            return (
              <motion.button
                key={goal.title}
                type="button"
                onClick={() => chooseGoal(goal.title)}
                aria-pressed={active}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                className={`rounded-xl border p-5 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30 ${
                  active
                    ? "border-blue-500/60 bg-blue-500/10 shadow-[0_0_30px_-12px_rgba(59,130,246,0.8)]"
                    : "border-white/10 bg-slate-900/50 hover:border-blue-500/30 hover:bg-slate-900/80"
                }`}
              >
                <div className="text-2xl">{goal.icon}</div>
                <h3 className="mt-3 font-semibold text-white">{goal.title}</h3>
                <p
                  className={`mt-1 flex items-center gap-1 text-xs ${
                    active ? "text-cyan-300" : "text-slate-500"
                  }`}
                >
                  {savingThis ? (
                    "Saving..."
                  ) : active ? (
                    <>
                      <Check className="h-3 w-3" /> Active goal
                    </>
                  ) : (
                    "Tap to select"
                  )}
                </p>
              </motion.button>
            );
          })}
        </div>

        {goalError && <p className="mt-4 text-sm text-red-400">{goalError}</p>}

        {!plan && (
          <p className="mt-4 text-xs text-slate-500">
            Want a workout schedule for this goal?{" "}
            <Link to="/plan" className="font-semibold text-blue-400 hover:text-blue-300">
              Create your plan
            </Link>
          </p>
        )}
      </SectionCard>

      {/* ================= ACHIEVEMENTS ================= */}
      <SectionCard
        icon={Trophy}
        title="Achievements"
        text={`${finishedCount} workouts completed`}
        color="text-amber-300"
        bg="bg-amber-400/10"
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {achievements.map((a) => {
            const pct = Math.min(100, (finishedCount / a.target) * 100);
            const selected = openBadge === a.title;
            return (
              <motion.button
                key={a.title}
                type="button"
                onClick={() => setOpenBadge(selected ? null : a.title)}
                aria-expanded={selected}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                className={`rounded-xl border p-5 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-400/20 ${
                  selected
                    ? "border-amber-400/60 bg-amber-400/10"
                    : a.unlocked
                    ? "border-amber-400/30 bg-amber-400/[0.07] hover:border-amber-400/50"
                    : "border-white/10 bg-slate-900/50 hover:border-white/20"
                }`}
              >
                <div className="text-2xl">
                  {a.unlocked ? a.icon : <Lock className="h-6 w-6 text-slate-500" />}
                </div>
                <h3 className={`mt-3 font-semibold ${a.unlocked ? "text-white" : "text-slate-300"}`}>
                  {a.title}
                </h3>
                <p className="mt-1 text-sm text-slate-500">{a.description}</p>

                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-800">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-slate-500">
                  {Math.min(finishedCount, a.target)} / {a.target}
                </p>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {openAchievement && (
            <motion.div
              key={openAchievement.title}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 flex flex-col gap-3 rounded-xl border border-white/10 bg-slate-900/60 p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-300">
                  {openAchievement.unlocked
                    ? `Unlocked. You have completed ${finishedCount} workouts.`
                    : (() => {
                        const left = Math.max(0, openAchievement.target - finishedCount);
                        return `${left} more workout${left === 1 ? "" : "s"} to unlock "${openAchievement.title}".`;
                      })()}
                </p>
                {!openAchievement.unlocked && (
                  <Link to="/week" className="lf-button px-4 py-2 text-xs">
                    Go to my week <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </SectionCard>
    </div>
  );
};

export default Profile;