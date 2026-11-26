import { useState } from "react";
import { Download, Trash2, Loader2 } from "lucide-react";
import { collection, deleteDoc, doc, getDoc, getDocs, writeBatch } from "firebase/firestore";
import {
  deleteUser,
  EmailAuthProvider,
  GoogleAuthProvider,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
} from "firebase/auth";
import { auth, db } from "../../firebase";
import { useFitnessStore } from "../../zustand/store/useFitnessStore";

// IMPORTANT: list every subcollection stored under users/{uid} in Firestore.
// Check Firebase Console -> Firestore -> Data -> users -> (your uid).
// Names that don't exist are skipped, but any real one missing here is NOT exported or deleted.
const SUBCOLLECTIONS = ["meals", "plans", "workouts"];

// Firestore timestamps -> ISO strings so the export is readable JSON
const clean = (v) => {
  if (v && typeof v.toDate === "function") return v.toDate().toISOString();
  if (Array.isArray(v)) return v.map(clean);
  if (v && typeof v === "object") {
    return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, clean(x)]));
  }
  return v;
};

async function collectData(user) {
  const profileSnap = await getDoc(doc(db, "users", user.uid));
  const collections = {};

  for (const name of SUBCOLLECTIONS) {
    const snap = await getDocs(collection(db, "users", user.uid, name));
    collections[name] = snap.docs.map((d) => ({ id: d.id, ...clean(d.data()) }));
  }

  const f = useFitnessStore.getState();
  return {
    exportedAt: new Date().toISOString(),
    account: { email: user.email, name: user.displayName || null },
    profile: profileSnap.exists() ? clean(profileSnap.data()) : null,
    vitals: {
      weightKg: f.weight ?? null,
      heightCm: f.height ?? null,
      calories: f.calories ?? null,
      bmi: f.bmi ?? null,
      bmiCategory: f.bmiCategory ?? null,
    },
    collections,
  };
}

function downloadJson(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "ledger-fit-data.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Deleting an account needs a recent sign-in, so confirm identity first
async function reauthenticate(user, password) {
  const provider = user.providerData[0]?.providerId;
  if (provider === "password") {
    await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, password));
  } else if (provider === "google.com") {
    await reauthenticateWithPopup(user, new GoogleAuthProvider());
  } else {
    throw new Error("unsupported-provider");
  }
}

async function deleteAllData(uid) {
  for (const name of SUBCOLLECTIONS) {
    const snap = await getDocs(collection(db, "users", uid, name));
    for (let i = 0; i < snap.docs.length; i += 400) {
      const batch = writeBatch(db);
      snap.docs.slice(i, i + 400).forEach((d) => batch.delete(d.ref));
      await batch.commit();
    }
  }
  await deleteDoc(doc(db, "users", uid));
}

function friendlyError(e) {
  const code = e?.code || e?.message || "";
  if (code.includes("wrong-password") || code.includes("invalid-credential"))
    return "That password is not correct.";
  if (code.includes("popup-closed")) return "Sign-in was cancelled. Nothing was deleted.";
  if (code.includes("permission-denied"))
    return "Your Firestore rules blocked the delete. Nothing was removed.";
  if (code.includes("unsupported-provider"))
    return "Please log out, log in again, and retry.";
  if (code.includes("too-many-requests")) return "Too many attempts. Try again later.";
  return "Something went wrong. Nothing was deleted. Please try again.";
}

const rowClass =
  "flex flex-col gap-3 rounded-xl border border-white/5 bg-slate-900/60 p-4 sm:flex-row sm:items-center sm:justify-between";

export default function PrivacyControls({ onDeleted }) {
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");

  const [confirming, setConfirming] = useState(false);
  const [typed, setTyped] = useState("");
  const [password, setPassword] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const user = auth.currentUser;
  const needsPassword = user?.providerData[0]?.providerId === "password";
  const canDelete = typed === "DELETE" && (!needsPassword || password.length > 0) && !deleting;

  const handleExport = async () => {
    if (!user) return;
    setExporting(true);
    setExportError("");
    try {
      downloadJson(await collectData(user));
    } catch (e) {
      console.error(e);
      setExportError("Could not export your data. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async () => {
    if (!user || !canDelete) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await reauthenticate(user, password);
      await deleteAllData(user.uid);
      await deleteUser(user);
      localStorage.clear();
      onDeleted?.();
    } catch (e) {
      console.error(e);
      setDeleteError(friendlyError(e));
      setDeleting(false);
    }
  };

  return (
    <div className="mt-3 space-y-3">
      <div className={rowClass}>
        <div>
          <p className="font-semibold text-white">Download my data</p>
          <p className="mt-0.5 text-sm text-slate-500">
            Get your profile, vitals and logs as a JSON file.
          </p>
          {exportError && <p className="mt-1 text-sm text-red-400">{exportError}</p>}
        </div>
        <button
          type="button"
          onClick={handleExport}
          disabled={exporting || !user}
          className="lf-ghost px-4 py-2.5 text-sm disabled:opacity-50"
        >
          {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          {exporting ? "Preparing..." : "Download"}
        </button>
      </div>

      <div className="rounded-xl border border-red-500/20 bg-red-500/[0.04] p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-red-300">Delete my account</p>
            <p className="mt-0.5 text-sm text-slate-500">
              Permanently removes your account and all of your data. This cannot be undone.
            </p>
          </div>
          {!confirming && (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
            >
              <Trash2 className="h-4 w-4" />
              Delete account
            </button>
          )}
        </div>

        {confirming && (
          <div className="mt-4 space-y-3 border-t border-red-500/10 pt-4">
            <label className="block text-sm text-slate-300">
              Type <span className="font-bold text-white">DELETE</span> to confirm
              <input
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                autoComplete="off"
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500/50"
              />
            </label>

            {needsPassword && (
              <label className="block text-sm text-slate-300">
                Your password
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500/50"
                />
              </label>
            )}

            {deleteError && (
              <p role="alert" className="text-sm text-red-400">{deleteError}</p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleDelete}
                disabled={!canDelete}
                className="flex items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
                {deleting ? "Deleting..." : "Permanently delete"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirming(false);
                  setTyped("");
                  setPassword("");
                  setDeleteError("");
                }}
                disabled={deleting}
                className="lf-ghost px-5 py-2.5 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}