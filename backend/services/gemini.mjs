import dotenv from "dotenv";
dotenv.config();

export async function generateTestWithGemini(lessons) {
  console.log("📦 Lessons trimise la Gemini:", lessons);
  console.log("🔐 GEMINI_API_KEY:", process.env.GEMINI_API_KEY);

  const prompt = `You are a French language tutor. Based on the following lessons, generate an A1/A2 level test with a mix of multiple choice and fill-in-the-blank exercises. Each question should be clear and educational.

  First, list all the questions without showing the correct answers.
  
  After all the questions, write a new section titled "Great job! Here are the correct answers so you can correct yourself." In that section, list each question number followed by the correct answer.
  
  The structure should look like this:
  
  1. [Question]
    a) ...
    b) ...
    c) ...
    d) ...
  
  ...
  
  10. [Question]
    a) ...
    b) ...
    c) ...
    d) ...
  
  ---
  
  Great job! Here are the correct answers so you can correct yourself:
  
  1. b  
  2. Salut  
  3. a  
  ...
  
  Now use the following lessons as source material to create the test:
  
  ${lessons.map((l, i) => `Lesson ${i + 1}: ${l.title}
  ${l.description || ''}
  ${(l.content || []).map(block => block.text || block.phrase || '').join('\n')}`).join('\n\n')}
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
