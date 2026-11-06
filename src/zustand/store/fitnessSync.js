import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useFitnessStore } from "./useFitnessStore";

const DATA_KEYS = [
    "weight",
    "height",
    "calories",
    "bmi",
    "bmiCategory",
    "plan",
    "completedWorkouts",
    "heartZones",
    "session",
    "workoutHistory",
];

const pickData = (state) =>
    Object.fromEntries(DATA_KEYS.map((key) => [key, state[key] ?? null]));

let unsubscribe = null;
let timer = null;

export async function startFitnessSync(uid) {
    stopFitnessSync();

    const ref = doc(db, "users", uid, "data", "fitness");

    // 1. Load this user's saved data first
    const snap = await getDoc(ref);

    if (snap.exists()) {
        useFitnessStore.getState().hydrate(snap.data());
    } else {
        useFitnessStore.getState().resetAll();
    }

    // 2. Only after loading, save changes (debounced)
    unsubscribe = useFitnessStore.subscribe((state) => {
        clearTimeout(timer);

        timer = setTimeout(() => {
            setDoc(ref, pickData(state)).catch(console.error);
        }, 800);
    });
}

export function stopFitnessSync() {
    clearTimeout(timer);

    if (unsubscribe) unsubscribe();

    unsubscribe = null;
}