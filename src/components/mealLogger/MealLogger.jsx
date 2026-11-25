import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useAuthStore } from "../../zustand/store/useAuthStore";

const EXAMPLES = ["2 eggs and toast with butter", "Chicken biryani, one plate", "Oats with banana and milk"];

async function parseMeal(text) {
  await auth.authStateReady();
  if (!auth.currentUser) throw new Error("You are logged out. Please log in and try again.");

  const token = await auth.currentUser.getIdToken();
  const res = await fetch("/api/parse-meal", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ text }),
  });

  const raw = await res.text();
  let data = {};
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    throw new Error(`Server returned ${res.status}: ${raw.slice(0, 100)}`);
  }
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export default function MealLogger() {
  const user = useAuthStore((s) => s.user);
  const authLoading = useAuthStore((s) => s.loading);

  const [text, setText] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const sum = (key) => items.reduce((t, i) => t + (Number(i[key]) || 0), 0);
  const total = sum("calories");

  const analyze = async () => {
    setLoading(true);
    setError("");
    setItems([]);
    try {
      const data = await parseMeal(text);
      const list = data.items || [];
      if (!list.length) setError("No food found. Try rephrasing.");
      setItems(list);
    } catch (e) {
      setError(
        /high demand|overloaded|busy|503/i.test(e.message)
          ? "The AI is busy right now. Please try again in a moment."
          : e.message
      );
    } finally {
      setLoading(false);
    }
  };

  const updateCalories = (index, value) =>
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, calories: Number(value) || 0 } : it)));

  const removeItem = (index) => setItems((prev) => prev.filter((_, i) => i !== index));

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      await addDoc(collection(db, "users", auth.currentUser.uid, "meals"), {
        description: text,
        items,
        totalCalories: total,
        totalProtein: sum("protein"),
        totalCarbs: sum("carbs"),
        totalFat: sum("fat"),
        createdAt: serverTimestamp(),
      });
      setText("");
      setItems([]);
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    } catch (e) {
      setError("Could not save: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) return <div className="lf-skeleton m-5 h-32" />;

  if (!user) {
    return <p className="p-5 text-sm text-slate-400">Please log in to use the AI meal logger.</p>;
  }

  return (
    <div className="p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
          <Sparkles className="h-5 w-5 text-emerald-400" />
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-400">AI meal logger</p>
          <h3 className="text-lg font-bold text-white">What did you eat?</h3>
        </div>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Describe your meal in plain words"
        maxLength={500}
        rows={3}
        className="w-full resize-none rounded-xl border border-white/10 bg-slate-950/60 p-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-blue-500/60 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.12)]"
      />

      <div className="mt-2 flex flex-wrap gap-2">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            onClick={() => setText(ex)}
            className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-slate-400 transition hover:border-blue-500/40 hover:text-white"
          >
            {ex}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-[11px] text-slate-600">{text.length}/500</p>
        <button
          onClick={analyze}
          disabled={loading || !text.trim()}
          className="lf-button px-6 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {error && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
          <p className="text-sm text-red-400">{error}</p>
          {/busy/i.test(error) && (
            <button
              onClick={analyze}
              disabled={loading}
              className="shrink-0 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 transition hover:text-white disabled:opacity-50"
            >
              Try again
            </button>
          )}
        </div>
      )}

      {loading && (
        <div className="mt-5 space-y-3">
          <div className="lf-skeleton h-16" />
          <div className="lf-skeleton h-16" />
        </div>
      )}

      <AnimatePresence>
        {saved && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
          >
            <Check className="h-4 w-4" /> Meal saved to today's log.
          </motion.p>
        )}
      </AnimatePresence>

      {items.length > 0 && !loading && (
        <div className="mt-6 space-y-3">
          <AnimatePresence initial={false}>
            {items.map((it, i) => (
              <motion.div
                key={`${it.name}-${i}`}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-3 rounded-xl border border-white/5 bg-slate-900/60 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-white">{it.name}</p>
                  <p className="text-xs text-slate-500">
                    {it.quantity} · Protein {it.protein}g · Carbs {it.carbs}g · Fat {it.fat}g
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={it.calories}
                    onChange={(e) => updateCalories(i, e.target.value)}
                    className="w-20 rounded-lg border border-white/10 bg-slate-950 px-2 py-1.5 text-right text-sm text-white outline-none focus:border-blue-500/50"
                  />
                  <span className="text-xs text-slate-500">kcal</span>
                  <button
                    onClick={() => removeItem(i)}
                    className="rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-slate-400 transition hover:border-red-500/30 hover:text-red-400"
                  >
                    Remove
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="flex items-center justify-between rounded-xl border border-blue-500/15 bg-blue-500/[0.07] p-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Total (AI estimate, editable)</p>
              <p className="text-2xl font-extrabold text-white">
                {total} <span className="text-sm font-normal text-slate-500">kcal</span>
              </p>
            </div>
            <button onClick={save} disabled={saving} className="lf-button px-6 py-2.5 text-sm disabled:opacity-50">
              {saving ? "Saving..." : "Save meal"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}