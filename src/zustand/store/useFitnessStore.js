import { create } from "zustand";
import { generatePlan } from "../../utils/generatePlan";

// Starting values, reused by resetAll and hydrate
const initialState = {
    // User information
    weight: null,
    height: null,
    calories: null,

    // Calculated results
    bmi: null,
    bmiCategory: null,

    // Generated workout plan
    plan: null,

    // Completed workouts, keyed by date: { "2026-10-15": true }
    completedWorkouts: {},

    // Heart rate zones result: { method, age, maxHeartRate } or null
    heartZones: null,

    // Workout in progress, or null:
    // { dateKey, startedAt, done: { "Squat": true }, weights: { "Squat": "60" } }
    session: null,

    // Finished workouts
    workoutHistory: [],
};

export const useFitnessStore = create((set) => ({
    ...initialState,

    // Load a user's saved data (from Firestore) into the store.
    // Missing or null fields fall back to safe defaults.
    hydrate: (data = {}) =>
        set({
            weight: data.weight ?? null,
            height: data.height ?? null,
            calories: data.calories ?? null,
            bmi: data.bmi ?? null,
            bmiCategory: data.bmiCategory ?? null,
            plan: data.plan ?? null,
            completedWorkouts: data.completedWorkouts ?? {},
            heartZones: data.heartZones ?? null,
            session: data.session ?? null,
            workoutHistory: data.workoutHistory ?? [],
        }),

    // Save the calculated heart rate zones
    setHeartZones: (heartZones) => set({ heartZones }),

    // Save vitals and calculate BMI
    setVitals: ({ weight, height, calories }) => {
        const heightInMeters = height / 100;

        const bmi = Number(
            (weight / (heightInMeters * heightInMeters)).toFixed(1)
        );

        let bmiCategory;

        if (bmi < 18.5) {
            bmiCategory = "Underweight";
        } else if (bmi < 25) {
            bmiCategory = "Normal";
        } else if (bmi < 30) {
            bmiCategory = "Overweight";
        } else {
            bmiCategory = "Obesity range";
        }

        set({
            weight,
            height,
            calories,
            bmi,
            bmiCategory,
        });
    },

    // Build the plan from the selections and save it
    createPlan: (selections) =>
        set({ plan: generatePlan(selections) }),

    // Remove the saved plan
    clearPlan: () => set({ plan: null }),

    // Mark a day as completed / not completed
    toggleWorkout: (dateKey) =>
        set((state) => {
            const next = { ...state.completedWorkouts };

            if (next[dateKey]) {
                delete next[dateKey];
            } else {
                next[dateKey] = true;
            }

            return { completedWorkouts: next };
        }),

    // Save the weight typed for an exercise
    setExerciseWeight: (name, value) =>
        set((state) => {
            if (!state.session) return {};

            return {
                session: {
                    ...state.session,
                    weights: { ...state.session.weights, [name]: value },
                },
            };
        }),

    // Throw away the workout in progress
    cancelSession: () => set({ session: null }),

    // Save the finished workout, mark the day completed, end the session
    finishSession: (record) =>
        set((state) => ({
            workoutHistory: [
                ...state.workoutHistory.filter(
                    (item) => item.dateKey !== record.dateKey
                ),
                record,
            ],
            completedWorkouts: {
                ...state.completedWorkouts,
                [record.dateKey]: true,
            },
            session: null,
        })),

    // Reset vitals only
    clearVitals: () =>
        set({
            weight: null,
            height: null,
            calories: null,
            bmi: null,
            bmiCategory: null,
        }),

    // Reset everything (used when the user logs out or a new user signs in)
    resetAll: () => set({ ...initialState }),
}));