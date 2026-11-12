import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  Timestamp,
  where,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useFitnessStore } from "../../zustand/store/useFitnessStore";

async function parseMeal(text) {
  const token = await auth.currentUser.getIdToken();
  const res = await fetch("/api/parse-meal", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed.");
  return data;
}

export default function MealLogger() {
  const dailyTarget = useFitnessStore((s) => s.calories);

  const [text, setText] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [todayTotal, setTodayTotal] = useState(0);

  const total = items.reduce((sum, i) => sum + Number(i.calories || 0), 0);

  const loadToday = async () => {
    if (!auth.currentUser) return;
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const q = query(
      collection(db, "users", auth.currentUser.uid, "meals"),
      where("createdAt", ">=", Timestamp.fromDate(start))
    );
    const snap = await getDocs(q);
    let sum = 0;
    snap.forEach((d) => (sum += d.data().totalCalories || 0));
    setTodayTotal(sum);
  };

  useEffect(() => {
    loadToday();
  }, []);

  const analyze = async () => {
    setLoading(true);
    setError("");
    setItems([]);
    try {
      const data = await parseMeal(text);
      if (!data.items.length) setError("No food found. Try rephrasing.");
      setItems(data.items);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const updateCalories = (index, value) => {
    setItems((prev) =>
      prev.map((it, i) =>
        i === index ? { ...it, calories: Number(value) || 0 } : it
      )
    );
  };

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      await addDoc(collection(db, "users", auth.currentUser.uid, "meals"), {
        description: text,
        items,
        totalCalories: total,
        createdAt: serverTimestamp(),
      });
      setText("");
      setItems([]);
      await loadToday();
    } catch (e) {
      setError("Could not save: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
  <div className="p-5 sm:p-6">

    {/* Header */}
    <div className="mb-5 flex items-center justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-400">
          AI Meal Logger
        </p>
        <h3 className="mt-1 text-lg font-bold text-white">
          What did you eat?
        </h3>
      </div>

      {dailyTarget && (
        <div className="rounded-xl border border-white/5 bg-slate-900/60 px-4 py-2 text-right">
          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            Today
          </p>
          <p className="text-sm font-bold text-white">
            {todayTotal}
            <span className="font-normal text-slate-500"> / {dailyTarget} kcal</span>
          </p>
        </div>
      )}
    </div>

    {/* Input */}
    <textarea
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="e.g. 2 eggs, toast with butter, coffee with milk"
      maxLength={500}
      rows={3}
      className="w-full resize-none rounded-xl border border-white/10 bg-slate-900/60 p-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-blue-500/50"
    />

    <div className="mt-3 flex items-center justify-between">
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
      <p className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
        {error}
      </p>
    )}

    {/* Results */}
    {items.length > 0 && (
      <div className="mt-6 space-y-3">
        {items.map((it, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 rounded-xl border border-white/5 bg-slate-900/60 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-semibold text-white">{it.name}</p>
              <p className="text-xs text-slate-500">
                {it.quantity} · P {it.protein}g · C {it.carbs}g · F {it.fat}g
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
          </div>
        ))}

        <div className="flex items-center justify-between rounded-xl border border-blue-500/10 bg-blue-500/5 p-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
              Total (AI estimate)
            </p>
            <p className="text-2xl font-bold text-white">
              {total} <span className="text-sm font-normal text-slate-500">kcal</span>
            </p>
          </div>

          <button
            onClick={save}
            disabled={saving}
            className="lf-button px-6 py-2.5 text-sm disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save meal"}
          </button>
        </div>
      </div>
    )}
  </div>
);
}