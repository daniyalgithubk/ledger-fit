import { useState } from "react";
import { Mail, User, Target, Trophy, Edit3 } from "lucide-react";
import { useAuthStore } from "../../zustand/store/useAuthStore"; // adjust the path
import { useFitnessStore } from "../../zustand/store/useFitnessStore"; // adjust the path

const GOALS = [
  { title: "Build Muscle", icon: "💪" },
  { title: "Lose Weight", icon: "🔥" },
  { title: "Maintain Weight", icon: "⚖️" },
  { title: "Improve Fitness", icon: "🏃" },
  { title: "Increase Strength", icon: "🏋️" },
];

const Profile = () => {
  // Account data
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const logout = useAuthStore((state) => state.logout);
  const updateProfileData = useAuthStore((state) => state.updateProfileData);

  // Fitness data from the other pages
  const plan = useFitnessStore((state) => state.plan);
  const height = useFitnessStore((state) => state.height);
  const weight = useFitnessStore((state) => state.weight);
  const workoutHistory = useFitnessStore((state) => state.workoutHistory);

  // Edit form
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

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

    if (ageValue !== null && (!Number.isFinite(ageValue) || ageValue < 10 || ageValue > 100)) {
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

  // ---------- Derived values ----------
  const displayName = user.displayName || user.email.split("@")[0];
  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const finishedCount = workoutHistory.length;

  const achievements = [
    {
      title: "First Workout",
      description: "Complete your first workout",
      icon: "🏆",
      unlocked: finishedCount >= 1,
    },
    {
      title: "5 Workouts",
      description: "Complete 5 workouts",
      icon: "🔥",
      unlocked: finishedCount >= 5,
    },
    {
      title: "10 Workouts",
      description: "Complete 10 workouts",
      icon: "💪",
      unlocked: finishedCount >= 10,
    },
  ];

  const info = [
    { label: "Age", value: profile?.age ? `${profile.age} years` : "Not set" },
    { label: "Height", value: height ? `${height} cm` : "Not set" },
    { label: "Weight", value: weight ? `${weight} kg` : "Not set" },
    { label: "Member Since", value: memberSince },
  ];

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500";

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

      {/* ================= HEADER ================= */}
      <div className="mb-10 text-center">
        <p className="mb-2 text-sm font-semibold tracking-widest text-blue-500">
          PROFILE
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Your Profile
        </h1>

        <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-500 sm:text-base">
          Manage your personal information and fitness goals
        </p>
      </div>

      {/* ================= PROFILE CARD ================= */}
      <div className="mx-auto mb-8 w-full max-w-6xl rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">

        {isEditing ? (
          <form onSubmit={handleSave} className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="edit-name" className="mb-2 block text-sm font-semibold text-gray-700">
                Name
              </label>
              <input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
            </div>

            <div>
              <label htmlFor="edit-age" className="mb-2 block text-sm font-semibold text-gray-700">
                Age
              </label>
              <input id="edit-age" type="number" min="10" max="100" value={age} onChange={(e) => setAge(e.target.value)} className={inputClass} />
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-600 sm:col-span-2">
                {error}
              </p>
            )}

            <div className="flex gap-3 sm:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>

              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-3xl font-bold text-blue-500">
                {displayName.charAt(0).toUpperCase()}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {displayName}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {plan ? `${plan.level} • ${plan.goal}` : "No plan created yet"}
                </p>

                <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={startEditing}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
              >
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </button>

              <button
                type="button"
                onClick={logout}
                className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-600 transition hover:border-red-200 hover:text-red-500"
              >
                Log out
              </button>
            </div>

          </div>
        )}
      </div>

      {/* ================= PERSONAL INFORMATION ================= */}
      <div className="mx-auto mb-8 w-full max-w-6xl rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">

        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
            <User className="h-5 w-5 text-blue-500" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Personal Information
            </h2>

            <p className="text-sm text-gray-500">
              Height and weight come from your BMI calculator
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {info.map((item) => (
            <div key={item.label} className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-medium text-gray-500">{item.label}</p>
              <p className="mt-1 text-lg font-bold text-gray-900">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ================= GOALS ================= */}
      <div className="mx-auto mb-8 w-full max-w-6xl rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">

        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
            <Target className="h-5 w-5 text-blue-500" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900">Fitness Goals</h2>
            <p className="text-sm text-gray-500">Your current fitness objective</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {GOALS.map((goal) => {
            const active = plan?.goal === goal.title;

            return (
              <div
                key={goal.title}
                className={`rounded-xl border p-5 ${
                  active
                    ? "border-blue-200 bg-blue-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="text-2xl">{goal.icon}</div>

                <h3 className="mt-3 font-semibold text-gray-900">{goal.title}</h3>

                <p className="mt-1 text-xs text-gray-500">
                  {active ? "Active goal" : "Available goal"}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= ACHIEVEMENTS ================= */}
      <div className="mx-auto w-full max-w-6xl rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">

        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
            <Trophy className="h-5 w-5 text-blue-500" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900">Achievements</h2>
            <p className="text-sm text-gray-500">
              {finishedCount} workouts completed
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.title}
              className={`rounded-xl border p-5 ${
                achievement.unlocked
                  ? "border-blue-100 bg-blue-50"
                  : "border-gray-100 bg-gray-50 opacity-60"
              }`}
            >
              <div className="text-2xl">
                {achievement.unlocked ? achievement.icon : "🔒"}
              </div>

              <h3 className="mt-3 font-semibold text-gray-900">
                {achievement.title}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {achievement.description}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Profile;