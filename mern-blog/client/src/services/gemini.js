

const GEMINI_KEY_STORAGE = "gemini_api_key";
const MODEL = "gemini-2.5-flash";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

export const getGeminiKey = () => localStorage.getItem(GEMINI_KEY_STORAGE) || "";
export const saveGeminiKey = (key) => localStorage.setItem(GEMINI_KEY_STORAGE, key.trim());
export const clearGeminiKey = () => localStorage.removeItem(GEMINI_KEY_STORAGE);
export const hasGeminiKey = () => !!getGeminiKey();


export const callGemini = async (prompt, options = {}) => {
  const key = getGeminiKey();
  if (!key) throw new Error("No Gemini API key found. Please add your key first.");

  const res = await fetch(`${ENDPOINT}?key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: options.temperature ?? 0.85,
        maxOutputTokens: options.maxTokens ?? 1024,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = err?.error?.message || `HTTP ${res.status}`;
    if (res.status === 400) throw new Error("Invalid request. Check your API key restrictions.");
    if (res.status === 403) throw new Error("API key rejected. Make sure it's restricted to Gemini API only.");
    if (res.status === 429) throw new Error("Rate limit hit. Wait a moment and try again (free tier: 10 req/min).");
    throw new Error(msg);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("No response from Gemini. Please try again.");
  return text.trim();
};


export const geminiPrompts = {
  generate: (title) =>
    `Write a detailed, engaging blog post about: "${title}".
Return ONLY the blog body content — no title line, no markdown headers, no intro like "Here is...".
Write ~300 words in clear, well-structured paragraphs.`,

  improve: (content) =>
    `Improve the following blog content. Make it more engaging, fix grammar, improve flow and clarity.
Return ONLY the improved content — no commentary, no preamble.

---
${content}
---`,

  outline: (title) =>
    `Create a structured outline for a blog post titled: "${title}".
Use numbered sections (1. 2. 3.) with 2–3 bullet sub-points each.
Keep it practical and actionable. Return only the outline.`,

  intro: (title) =>
    `Write a compelling 2–3 sentence introduction paragraph for a blog post titled: "${title}".
Hook the reader immediately. Return only the intro paragraph.`,

  conclusion: (content) =>
    `Write a strong 2–3 sentence conclusion for this blog post:

---
${content}
---

Return only the conclusion paragraph.`,

  tags: (title, content) =>
    `Suggest 5 relevant tags/keywords for this blog post.
Title: "${title}"
Content preview: "${content.slice(0, 300)}"
Return ONLY a comma-separated list of tags, nothing else.`,
};