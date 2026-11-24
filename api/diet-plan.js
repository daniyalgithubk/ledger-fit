import { verifyUser, callGemini } from "./_lib/gemini.js";

const GOALS = ["lose", "maintain", "gain"];
const PREFERENCES = ["none", "halal", "vegetarian", "vegan"];
const CUISINES = ["any", "desi", "western", "mediterranean"];
const CATEGORIES = ["Underweight", "Normal", "Overweight", "Obesity range"];

const SYSTEM = `You are a nutrition planner. Create a one-day meal plan.
Return ONLY valid JSON in this shape:
{"meals":[{"name":"Breakfast","items":["..."],"calories":0,"protein":0,"carbs":0,"fat":0}],"tips":["..."]}
Include breakfast, lunch, dinner and one or two snacks.
The total calories must be within 5% of the target.
Use common, affordable foods and give portion sizes in each item.
Respect the diet preference and cuisine.
Give at most 3 short, general tips. Do not give medical advice or diagnose anything.`;

const num = (v) => Math.max(0, Math.round(Number(v) || 0));
const str = (v, n) => String(v || "").slice(0, n);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const idToken = (req.headers.authorization || "").replace("Bearer ", "");
  if (!idToken || !(await verifyUser(idToken))) {
    return res.status(401).json({ error: "Please log in." });
  }

  const b = req.body || {};
  const calories = Number(b.calories);
  const bmi = Number(b.bmi);

  if (
    !(calories >= 1200 && calories <= 5000) ||
    !(bmi >= 10 && bmi <= 60) ||
    !GOALS.includes(b.goal) ||
    !PREFERENCES.includes(b.preference) ||
    !CUISINES.includes(b.cuisine) ||
    !CATEGORIES.includes(b.category)
  ) {
    return res.status(400).json({ error: "Invalid input." });
  }

  const prompt = `Daily calorie target: ${Math.round(calories)} kcal.
Goal: ${b.goal}.
BMI: ${bmi} (${b.category}).
Diet preference: ${b.preference}.
Cuisine: ${b.cuisine}.`;

  try {
    const { r, data } = await callGemini({
      systemInstruction: { parts: [{ text: SYSTEM }] },
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" },
    });

    if (!r.ok) {
      console.error("Gemini error:", r.status, JSON.stringify(data));
      const busy = r.status === 503 || r.status === 429;
      return res.status(busy ? 503 : 502).json({
        error: busy
          ? "The AI is busy right now. Please try again in a moment."
          : data?.error?.message || `AI request failed (${r.status}).`,
      });
    }

    const output = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!output) {
      return res.status(502).json({ error: "AI returned no result." });
    }

    const parsed = JSON.parse(output.replace(/```json|```/g, "").trim());

    const meals = (parsed.meals || [])
      .slice(0, 7)
      .map((m) => ({
        name: str(m.name, 40),
        items: (Array.isArray(m.items) ? m.items : [])
          .slice(0, 8)
          .map((i) => str(i, 120))
          .filter(Boolean),
        calories: num(m.calories),
        protein: num(m.protein),
        carbs: num(m.carbs),
        fat: num(m.fat),
      }))
      .filter((m) => m.name && m.items.length);

    if (!meals.length) {
      return res.status(502).json({ error: "AI returned an empty plan. Try again." });
    }

    const totals = meals.reduce(
      (t, m) => ({
        calories: t.calories + m.calories,
        protein: t.protein + m.protein,
        carbs: t.carbs + m.carbs,
        fat: t.fat + m.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    const tips = (Array.isArray(parsed.tips) ? parsed.tips : [])
      .slice(0, 3)
      .map((t) => str(t, 200))
      .filter(Boolean);

    return res.json({ meals, totals, tips });
  } catch (e) {
    console.error("diet-plan failed:", e);
    return res.status(500).json({ error: "Could not read the AI response." });
  }
}