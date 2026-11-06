import {
  User,
  Bell,
  Dumbbell,
  Moon,
  Shield,
  Ruler,
  ChevronRight,
  LogOut,
} from "lucide-react";

const Settings = () => {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

      {/* ================= HEADER ================= */}
      <div className="mb-10 text-center">
        <p className="mb-2 text-sm font-semibold tracking-widest text-blue-500">
          SETTINGS
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Settings
        </h1>

        <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-500 sm:text-base">
          Customize your fitness experience and account preferences
        </p>
      </div>

      {/* ================= ACCOUNT ================= */}
      <div className="mx-auto mb-6 w-full max-w-6xl rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">

        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
            <User className="h-5 w-5 text-blue-500" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Account
            </h2>

            <p className="text-sm text-gray-500">
              Manage your account information
            </p>
          </div>
        </div>

        <div className="divide-y divide-gray-100">

          <button className="flex w-full items-center justify-between py-4 text-left">
            <div>
              <p className="font-semibold text-gray-900">
                Edit Profile
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Update your personal information
              </p>
            </div>

            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>

          <button className="flex w-full items-center justify-between py-4 text-left">
            <div>
              <p className="font-semibold text-gray-900">
                Change Password
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Update your account password
              </p>
            </div>

            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>

        </div>
      </div>

      {/* ================= WORKOUT PREFERENCES ================= */}
      <div className="mx-auto mb-6 w-full max-w-6xl rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">

        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
            <Dumbbell className="h-5 w-5 text-blue-500" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Workout Preferences
            </h2>

            <p className="text-sm text-gray-500">
              Customize how your workouts are planned
            </p>
          </div>
        </div>

        <div className="space-y-4">

          <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
            <div>
              <p className="font-semibold text-gray-900">
                Default Workout Duration
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Choose your preferred workout length
              </p>
            </div>

            <select className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500">
              <option>45 min</option>
              <option>30 min</option>
              <option>60 min</option>
              <option>75 min</option>
              <option>90 min</option>
            </select>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
            <div>
              <p className="font-semibold text-gray-900">
                Fitness Level
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Set your current experience level
              </p>
            </div>

            <select className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500">
              <option>Intermediate</option>
              <option>Beginner</option>
              <option>Advanced</option>
            </select>
          </div>

        </div>
      </div>

      {/* ================= NOTIFICATIONS ================= */}
      <div className="mx-auto mb-6 w-full max-w-6xl rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">

        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
            <Bell className="h-5 w-5 text-blue-500" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Notifications
            </h2>

            <p className="text-sm text-gray-500">
              Choose what notifications you receive
            </p>
          </div>
        </div>

        <div className="space-y-3">

          <label className="flex cursor-pointer items-center justify-between rounded-xl bg-gray-50 p-4">
            <div>
              <p className="font-semibold text-gray-900">
                Workout Reminders
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Get reminded when it's time to workout
              </p>
            </div>

            <input
              type="checkbox"
              defaultChecked
              className="h-5 w-5 accent-blue-500"
            />
          </label>

          <label className="flex cursor-pointer items-center justify-between rounded-xl bg-gray-50 p-4">
            <div>
              <p className="font-semibold text-gray-900">
                Progress Updates
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Receive weekly progress summaries
              </p>
            </div>

            <input
              type="checkbox"
              defaultChecked
              className="h-5 w-5 accent-blue-500"
            />
          </label>

        </div>
      </div>

      {/* ================= APPEARANCE ================= */}
      <div className="mx-auto mb-6 w-full max-w-6xl rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">

        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
            <Moon className="h-5 w-5 text-blue-500" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Appearance
            </h2>

            <p className="text-sm text-gray-500">
              Customize how the application looks
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">

          <div>
            <p className="font-semibold text-gray-900">
              Theme
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Select your preferred theme
            </p>
          </div>

          <select className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500">
            <option>Light</option>
            <option>Dark</option>
            <option>System</option>
          </select>

        </div>
      </div>

      {/* ================= UNITS ================= */}
      <div className="mx-auto mb-6 w-full max-w-6xl rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">

        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
            <Ruler className="h-5 w-5 text-blue-500" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Units
            </h2>

            <p className="text-sm text-gray-500">
              Choose how measurements are displayed
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">

          <div>
            <p className="font-semibold text-gray-900">
              Measurement System
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Weight, height and distance units
            </p>
          </div>

          <select className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500">
            <option>Metric (kg, cm)</option>
            <option>Imperial (lb, ft)</option>
          </select>

        </div>
      </div>

      {/* ================= PRIVACY ================= */}
      <div className="mx-auto mb-6 w-full max-w-6xl rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">

        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
            <Shield className="h-5 w-5 text-blue-500" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Privacy & Security
            </h2>

            <p className="text-sm text-gray-500">
              Manage your privacy and security settings
            </p>
          </div>
        </div>

        <button className="flex w-full items-center justify-between rounded-xl bg-gray-50 p-4 text-left">

          <div>
            <p className="font-semibold text-gray-900">
              Privacy Settings
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Control how your fitness data is used
            </p>
          </div>

          <ChevronRight className="h-5 w-5 text-gray-400" />

        </button>
      </div>

      {/* ================= LOG OUT ================= */}
      <div className="mx-auto w-full max-w-6xl">

        <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100">
          <LogOut className="h-4 w-4" />
          Log Out
        </button>

      </div>

    </div>
  );
};

export default Settings;