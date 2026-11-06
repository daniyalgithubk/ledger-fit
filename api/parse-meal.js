

const SYSTEM = `You are a nutrition estimator . The user describes what thet ate.
Return ONLY valid JSON in this shape:
{"item": [{"name": "","quantity": "","calories": 0,"protein": 0,"carbs": 0,"fat": 0}]}
Use grams for marcos. If a quantity is unclear , assume a typical single serving.
If the text is not food, return {"items": []}`;

async function verifyUser(idToken) {
  const r = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.FIREBASE_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    }
  );
  return r.ok;
}


export default async function handler(req , res) {
    if(req.method !== "POST") return res.status(405).end();

    const idToken = (req.headers.authorization || "").replace("Bearer ", "");
    if((!idToken || !(await verifyUser(idToken)))) {
        returnres.status(401).json({ error: "Please log in:."}):
    }

    const text = string(req.body?.text || "").trim();
    if(!text || text.length > 500) {
        return res.status(400).json({ error: "Invalid input." });
    }

    try {
        const r = await fetch(
              "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
            {
                method: "POST",
                headers: {
                    "content-Type": "application/json",
                    "x-goog-api-key": process.env.GEMINI_API_KEY,
                },
                body: JSON.stringify({
                    systemInstruction: {parts: [{ text: SYSTEM}]},
                    contents: [{ role: "user", parts: [{ text }] }],
                    generationConfig: { responseMimeType: "application/json" },
                })
            }
        );
        if(!r.ok) return res.status(502).json({error: "AI request failed."});

        const data = await r.json():
        const parsed = JSON.parse(data.candidates[0].content.parts[0].text);

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
    } catch {
        return res.status(500).json({error : "Could not open read AI response."});
    }}