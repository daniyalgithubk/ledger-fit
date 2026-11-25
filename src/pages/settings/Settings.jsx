import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import {
  User, Bell, Dumbbell, Moon, Shield, Ruler, ChevronRight, LogOut, Check, KeyRound,
} from "lucide-react";
import { auth } from "../../firebase";
import { useAuthStore } from "../../zustand/store/useAuthStore";
import { useLocalSetting } from "../../hooks/useLocalSetting";
import PageHeader from "../../components/ui/PageHeader";
import SectionCard from "../../components/ui/SectionCard";
import Reveal from "../../components/ui/Reveal";

const selectClass =
  "rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none transition focus:border-blue-500/60";

const Row = ({ title, text, children }) => (
  <div className="flex flex-col gap-3 rounded-xl border border-white/5 bg-slate-900/60 p-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <p className="font-semibold text-white">{title}</p>
      <p className="mt-0.5 text-sm text-slate-500">{text}</p>
    </div>
    {children}
  </div>
);

const Toggle = ({ checked, onChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
      checked ? "bg-gradient-to-r from-blue-500 to-cyan-400" : "bg-slate-700"
    }`}
  >
    <span
      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
        checked ? "left-[22px]" : "left-0.5"
      }`}
    />
  </button>
);

const Settings = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const [duration, setDuration] = useLocalSetting("duration", "45 min");
  const [level, setLevel] = useLocalSetting("level", "Intermediate");
  const [reminders, setReminders] = useLocalSetting("reminders", true);
  const [updates, setUpdates] = useLocalSetting("updates", true);
  const [units, setUnits] = useLocalSetting("units", "Metric (kg, cm)");

  const [resetState, setResetState] = useState("idle"); // idle | sending | sent | error

  const handleReset = async () => {
    if (!user?.email) return;
    setResetState("sending");
    try {
      await sendPasswordResetEmail(auth, user.email);
      setResetState("sent");
    } catch (e) {
      console.error(e);
      setResetState("error");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <PageHeader
        eyebrow="Settings"
        title="Settings"
        text="Customize your fitness experience and account preferences"
      />

      <SectionCard icon={User} title="Account" text="Manage your account information">
        <div className="space-y-3">
          <Link
            to="/profile"
            className="group flex items-center justify-between rounded-xl border border-white/5 bg-slate-900/60 p-4 transition hover:border-blue-500/30"
          >
            <div>
              <p className="font-semibold text-white">Edit profile</p>
              <p className="mt-0.5 text-sm text-slate-500">Update your name and age</p>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-500 transition group-hover:translate-x-1 group-hover:text-blue-400" />
          </Link>

          <button
            type="button"
            onClick={handleReset}
            disabled={resetState === "sending" || resetState === "sent"}
            className="group flex w-full items-center justify-between rounded-xl border border-white/5 bg-slate-900/60 p-4 text-left transition hover:border-blue-500/30 disabled:opacity-80"
          >
            <div>
              <p className="flex items-center gap-2 font-semibold text-white">
                <KeyRound className="h-4 w-4 text-slate-400" />
                Change password
              </p>
              <p className="mt-0.5 text-sm text-slate-500">
                {resetState === "sent" && <span className="text-emerald-300">Reset link sent to {user?.email}. Check your inbox.</span>}
                {resetState === "error" && <span className="text-red-400">Could not send the email. Try again.</span>}
                {resetState === "sending" && "Sending..."}
                {resetState === "idle" && "We will email you a link to set a new password"}
              </p>
            </div>
            {resetState === "sent" ? (
              <Check className="h-5 w-5 text-emerald-400" />
            ) : (
              <ChevronRight className="h-5 w-5 text-slate-500 transition group-hover:translate-x-1 group-hover:text-blue-400" />
            )}
          </button>
        </div>
      </SectionCard>

      <SectionCard
        icon={Dumbbell}
        title="Workout preferences"
        text="Customize how your workouts are planned"
        color="text-pink-300"
        bg="bg-pink-500/10"
      >
        <div className="space-y-3">
          <Row title="Default workout duration" text="Choose your preferred workout length">
            <select value={duration} onChange={(e) => setDuration(e.target.value)} className={selectClass}>
              {["30 min", "45 min", "60 min", "75 min", "90 min"].map((o) => (
                <option key={o} className="bg-slate-900">{o}</option>
              ))}
            </select>
          </Row>

          <Row title="Fitness level" text="Set your current experience level">
            <select value={level} onChange={(e) => setLevel(e.target.value)} className={selectClass}>
              {["Beginner", "Intermediate", "Advanced"].map((o) => (
                <option key={o} className="bg-slate-900">{o}</option>
              ))}
            </select>
          </Row>
        </div>
      </SectionCard>

      <SectionCard
        icon={Bell}
        title="Notifications"
        text="Choose what notifications you receive"
        color="text-amber-300"
        bg="bg-amber-400/10"
      >
        <div className="space-y-3">
          <Row title="Workout reminders" text="Get reminded when it's time to workout">
            <Toggle checked={reminders} onChange={setReminders} label="Workout reminders" />
          </Row>
          <Row title="Progress updates" text="Receive weekly progress summaries">
            <Toggle checked={updates} onChange={setUpdates} label="Progress updates" />
          </Row>
        </div>
      </SectionCard>

      <SectionCard
        icon={Moon}
        title="Appearance"
        text="Customize how the application looks"
        color="text-indigo-300"
        bg="bg-indigo-500/10"
      >
        <Row title="Theme" text="Light and system themes are coming soon">
          <select value="Dark" disabled className={`${selectClass} opacity-70`}>
            <option className="bg-slate-900">Dark</option>
          </select>
        </Row>
      </SectionCard>

      <SectionCard
        icon={Ruler}
        title="Units"
        text="Choose how measurements are displayed"
        color="text-cyan-300"
        bg="bg-cyan-500/10"
      >
        <Row title="Measurement system" text="Weight, height and distance units">
          <select value={units} onChange={(e) => setUnits(e.target.value)} className={selectClass}>
            {["Metric (kg, cm)", "Imperial (lb, ft)"].map((o) => (
              <option key={o} className="bg-slate-900">{o}</option>
            ))}
          </select>
        </Row>
      </SectionCard>

      <SectionCard
        icon={Shield}
        title="Privacy & security"
        text="How your data is handled"
        color="text-emerald-300"
        bg="bg-emerald-500/10"
      >
        <p className="rounded-xl border border-white/5 bg-slate-900/60 p-4 text-sm leading-6 text-slate-400">
          Your vitals, plans and meal logs are stored against your account and only you can read them.
          Ledger/Fit gives general guidance and is not a medical service.
        </p>
      </SectionCard>

      <Reveal className="mx-auto w-full max-w-4xl pb-6">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-3.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </Reveal>
    </div>
  );
};

export default Settings;