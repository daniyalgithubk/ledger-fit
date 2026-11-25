import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2, Utensils } from "lucide-react";

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
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-400">Log</p>
      <h3 className="mb-4 mt-1 text-lg font-bold text-white">Today's meals</h3>

      {loading && (
        <div className="space-y-3">
          <div className="lf-skeleton h-16" />
          <div className="lf-skeleton h-16" />
        </div>
      )}
      {error && <p className="text-sm text-red-400">{error}</p>}
      {deleteError && <p className="mb-2 text-sm text-red-400">{deleteError}</p>}

      {!loading && !error && meals.length === 0 && (
        <div className="rounded-xl border border-dashed border-white/10 p-6 text-center">
          <Utensils className="mx-auto h-6 w-6 text-slate-600" />
          <p className="mt-2 text-sm text-slate-400">No meals logged yet today.</p>
          <p className="text-xs text-slate-600">Use the logger above to add your first one.</p>
        </div>
      )}

      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {meals.map((m) => (
            <motion.div
              key={m.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.25 }}
              className="flex items-start justify-between gap-3 rounded-xl border border-white/5 bg-slate-900/60 p-4"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {(m.items || []).map((i) => i.name).join(", ") || m.description}
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                  <span className="font-semibold text-orange-300">{m.totalCalories} kcal</span>
                  {m.totalProtein != null && (
                    <span>
                      P {m.totalProtein}g · C {m.totalCarbs}g · F {m.totalFat}g
                    </span>
                  )}
                  {formatTime(m.createdAt) && <span>{formatTime(m.createdAt)}</span>}
                </div>
              </div>

              <button
                onClick={() => handleDelete(m.id)}
                disabled={busyId === m.id}
                aria-label="Delete meal"
                className="shrink-0 rounded-lg border border-white/10 p-2 text-slate-400 transition hover:border-red-500/30 hover:text-red-400 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}