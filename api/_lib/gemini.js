export const MODELS = ["gemini-3.8-flash", "gemini-flash-latest"];

export async function verifyUser(idToken) {
  if (!process.env.FIREBASE_API_KEY) {
    console.error("FIREBASE_API_KEY is not set");
    return false;
  }

  try {
    const r = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      }
    );

    if (!r.ok) {
      const body = await r.text();
      console.error("verifyUser failed:", r.status, body);
    }
    return r.ok;
  } catch (e) {
    console.error("verifyUser error:", e);
    return false;
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Tries each model. Retries only when Gemini is busy (503) or rate limited (429).
export async function callGemini(body) {
  let last = null;

  for (const model of MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      const r = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": process.env.GEMINI_API_KEY,
          },
          body: JSON.stringify(body),
        }
      );

      const data = await r.json().catch(() => ({}));
      if (r.ok) return { r, data };

      last = { r, data };

      if (r.status === 404) break;
      if (r.status !== 503 && r.status !== 429) return last;

      await sleep(1000 * (attempt + 1));
    }
  }
  return last;
}