export const MODELS = ["openai/gpt-oss-120b", "llama-3.3-70b-versatile"];

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
    if (!r.ok) console.error("verifyUser failed:", r.status, await r.text());
    return r.ok;
  } catch (e) {
    console.error("verifyUser error:", e);
    return false;
  }
}

// Returns { ok, status, text, error }. Tries the next model on 404, 429 or 503.
export async function callAI(system, user, maxTokens = 2000) {
  let last = { ok: false, status: 500, text: "", error: "AI request failed." };

  for (const model of MODELS) {
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        max_tokens: maxTokens,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });

    const data = await r.json().catch(() => ({}));

    if (r.ok) {
      return { ok: true, status: 200, text: data?.choices?.[0]?.message?.content || "" };
    }

    console.error("Groq error:", model, r.status, JSON.stringify(data));
    last = {
      ok: false,
      status: r.status,
      text: "",
      error: data?.error?.message || `AI request failed (${r.status}).`,
    };

    if (![404, 429, 503].includes(r.status)) break;
  }
  return last;
}