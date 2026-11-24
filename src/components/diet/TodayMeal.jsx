import { useState } from "react";
import { Trash2 } from "lucide-react";

const formatTime = (ts) => {
  const d = ts?.toDate ? ts.toDate() : null;
  return d ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
};

export default function TodayMeals({ meals, loading, error, onDelete }) {
  const [busyId, setBusyId] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const handleDelete = async (id) => {
    setBusyId(id);
    setDeleteError("");
    try {
      await onDelete(id);
    } catch {
      setDeleteError("Could not delete that meal.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="lf-card p-5 sm:p-6">
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-400">
        Log
      </p>
      <h3 className="mb-4 mt-1 text-lg font-bold text-white">Today's meals</h3>

      {loading && <p className="text-sm text-slate-500">Loading...</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}
      {deleteError && <p className="mb-2 text-sm text-red-400">{deleteError}</p>}

      {!loading && !error && meals.length === 0 && (
        <p className="text-sm text-slate-500">No meals logged today yet.</p>
      )}

      <div className="space-y-3">
        {meals.map((m) => (
          <div
            key={m.id}
            className="flex items-start justify-between gap-3 rounded-xl border border-white/5 bg-slate-900/60 p-4"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {(m.items || []).map((i) => i.name).join(", ") || m.description}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {m.totalCalories} kcal
                {m.totalProtein != null &&
                  ` · P ${m.totalProtein}g · C ${m.totalCarbs}g · F ${m.totalFat}g`}
                {formatTime(m.createdAt) && ` · ${formatTime(m.createdAt)}`}
              </p>
            </div>

            <button
              onClick={() => handleDelete(m.id)}
              disabled={busyId === m.id}
              aria-label="Delete meal"
              className="shrink-0 rounded-lg border border-white/10 p-2 text-slate-400 transition hover:border-red-500/30 hover:text-red-400 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}