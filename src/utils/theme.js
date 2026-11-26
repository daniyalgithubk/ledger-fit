import { useSettingsStore } from "../zustand/store/useSettingsStore";

const query = window.matchMedia("(prefers-color-scheme: light)");

export function applyTheme(theme) {
  const light = theme === "light" || (theme === "system" && query.matches);
  document.documentElement.dataset.theme = light ? "light" : "dark";
}

export function initTheme() {
  applyTheme(useSettingsStore.getState().theme);
  useSettingsStore.subscribe((s) => applyTheme(s.theme));
  query.addEventListener("change", () =>
    applyTheme(useSettingsStore.getState().theme)
  );
}