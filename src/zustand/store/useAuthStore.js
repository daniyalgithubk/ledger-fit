import { create } from "zustand";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useFitnessStore } from "./useFitnessStore";
import { startFitnessSync, stopFitnessSync } from "./fitnessSync";

// Turn Firebase error codes into readable messages
export const authErrorMessage = (error) => {
    switch (error.code) {
        case "auth/email-already-in-use":
            return "An account with this email already exists.";
        case "auth/invalid-email":
            return "Enter a valid email address.";
        case "auth/weak-password":
            return "Password must be at least 6 characters.";
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
            return "Incorrect email or password.";
        case "auth/too-many-requests":
            return "Too many attempts. Try again later.";
        default:
            return "Something went wrong. Please try again.";
    }
};

export const useAuthStore = create((set, get) => ({
    user: null,
    profile: null,
    loading: true,

    // Call once when the app starts.
    initAuth: () =>
        onAuthStateChanged(auth, async (firebaseUser) => {
            if (!firebaseUser) {
                try {
                    stopFitnessSync();
                    useFitnessStore.getState().resetAll();
                } catch (error) {
                    console.error("Cleanup failed:", error);
                }
                set({ user: null, profile: null, loading: false });
                return;
            }

            try {
                await startFitnessSync(firebaseUser.uid);
            } catch (error) {
                console.error("Could not load fitness data:", error);
            }

            let profile = get().profile;

            try {
                const snap = await getDoc(doc(db, "users", firebaseUser.uid));
                if (snap.exists()) profile = snap.data();
            } catch (error) {
                console.error("Could not load profile:", error);
            }

            set({
                user: {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    createdAt: firebaseUser.metadata.creationTime,
                },
                profile,
                loading: false,
            });
        }),

    signup: async ({ name, email, password }) => {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName: name });

        const profile = { age: null };
        await setDoc(doc(db, "users", result.user.uid), profile);

        set((state) => ({
            user: { ...state.user, displayName: name },
            profile,
        }));
    },

    login: ({ email, password }) =>
        signInWithEmailAndPassword(auth, email, password),

    logout: async () => {
        await signOut(auth);
        useFitnessStore.getState().resetAll();
    },

    updateProfileData: async ({ name, age }) => {
        const { user } = get();

        if (name !== user.displayName) {
            await updateProfile(auth.currentUser, { displayName: name });
        }

        await setDoc(doc(db, "users", user.uid), { age }, { merge: true });

        set((state) => ({
            user: { ...state.user, displayName: name },
            profile: { ...state.profile, age },
        }));
    },
}));