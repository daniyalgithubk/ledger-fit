import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useSettingsStore = create(
  persist(
    (set) => ({
      theme: "dark", // dark | light | system
      units: "metric", // metric | imperial
      duration: "45 min",
      level: "Intermediate",
      reminders: true,
      updates: true,
      update: (patch) => set(patch),
    }),
    {
      name: "ledger-fit-settings",
      storage: createJSONStorage(() => localStorage),
    }
  )
);