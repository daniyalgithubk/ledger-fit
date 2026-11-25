import { useState } from "react";

export function useLocalSetting(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(`lf-${key}`);
      return raw === null ? initial : JSON.parse(raw);
    } catch {
      return initial;
    }
  });

  const update = (next) => {
    setValue(next);
    try {
      localStorage.setItem(`lf-${key}`, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  return [value, update];
}