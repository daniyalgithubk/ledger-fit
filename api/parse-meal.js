import { verifyUser, callAI } from "./_lib/ai.js";

const SYSTEM = `You are a nutrition estimator. The user describes what they ate.
Return ONLY a JSON object in this shape:
{"items":[{"name":"","quantity":"","calories":0,"protein":0,"carbs":0,"fat":0}]}
Use grams for macros. If a quantity is unclear, assume a typical single serving.
If the text is not food, return {"items":[]}.`;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const idToken = (req.headers.authorization || "").replace("Bearer ", "");
  if (!idToken || !(await verifyUser(idToken))) {
    return res.status(401).json({ error: "Please log in." });
  }

  const text = String(req.body?.text || "").trim();
  if (!text || text.length > 500) {
    return res.status(400).json({ error: "Enter 1 to 500 characters." });
  }

  try {
    const ai = await callAI(SYSTEM, text, 1500);

    if (!ai.ok) {
      const busy = ai.status === 429 || ai.status === 503;
      return res.status(busy ? 503 : 502).json({
        error: busy
          ? "The AI is busy right now. Please try again in a moment."
          : ai.error,
      });
    }

    const parsed = JSON.parse(ai.text.replace(/```json|```/g, "").trim());

    const items = (parsed.items || [])
      .map((i) => ({
        name: String(i.name || "").slice(0, 80),
        quantity: String(i.quantity || "").slice(0, 40),
        calories: Math.max(0, Math.round(Number(i.calories) || 0)),
        protein: Math.max(0, Math.round(Number(i.protein) || 0)),
        carbs: Math.max(0, Math.round(Number(i.carbs) || 0)),
        fat: Math.max(0, Math.round(Number(i.fat) || 0)),
      }))
      .filter((i) => i.name);

    return res.json({ items });
  } catch (e) {
    console.error("parse-meal failed:", e);
    return res.status(500).json({ error: "Could not read the AI response." });
  }
}