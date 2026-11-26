const KG_PER_LB = 0.45359237;
const CM_PER_IN = 2.54;
const round1 = (n) => Math.round(n * 10) / 10;

export const isImperial = (u) => u === "imperial";
export const weightUnit = (u) => (isImperial(u) ? "lb" : "kg");
export const heightUnit = (u) => (isImperial(u) ? "in" : "cm");

// Stored values are always metric. These convert for display and input.
export const toDisplayWeight = (kg, u) => round1(isImperial(u) ? kg / KG_PER_LB : kg);
export const toDisplayHeight = (cm, u) => round1(isImperial(u) ? cm / CM_PER_IN : cm);
export const fromDisplayWeight = (v, u) => (isImperial(u) ? v * KG_PER_LB : v);
export const fromDisplayHeight = (v, u) => (isImperial(u) ? v * CM_PER_IN : v);

export const formatWeight = (kg, u) => `${toDisplayWeight(kg, u)} ${weightUnit(u)}`;

export function formatHeight(cm, u) {
  if (!isImperial(u)) return `${cm} cm`;
  const totalIn = Math.round(cm / CM_PER_IN);
  return `${Math.floor(totalIn / 12)}′ ${totalIn % 12}″`;
}