import dotenv from "dotenv";
dotenv.config();

export async function generateTestWithGemini(lessons) {
  console.log("📦 Lessons trimise la Gemini:", lessons);
  console.log("🔐 GEMINI_API_KEY:", process.env.GEMINI_API_KEY);

  const prompt = `You are a French language tutor. Based on the following lessons, generate an A1/A2 level test with a mix of multiple choice and fill-in-the-blank exercises. Each question should be clear and educational.

${lessons.map((l, i) => `Lesson ${i + 1}: ${l.title}
${l.description || ''}
${(l.content || []).map(block => block.text || block.phrase || '').join('\n')}`).join('\n\n')}

Return the test as a text block like:
1. [Question]
  a) ...
  b) ...
  c) ...
  d) ...
Correct answer: [letter or word]
`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`;

  const requestBody = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ]
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Gemini error:", JSON.stringify(data, null, 2));
      throw new Error("Gemini API error");
    }

    return data.candidates?.[0]?.content?.parts?.[0]?.text || "❌ No response text";
  } catch (err) {
    console.error("❌ Request failed:", err);
    throw err;
  }
}
