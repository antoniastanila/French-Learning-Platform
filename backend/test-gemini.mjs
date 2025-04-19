import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
console.log("🔐 Using key:", apiKey);

const sampleLessons = [
  {
    title: "Lesson 1: The French Alphabet",
    description: "Learn how to pronounce the 26 letters in French.",
    content: [
      { text: "A is pronounced /ah/" },
      { text: "B is pronounced /bay/" },
      { text: "C is pronounced /say/" }
    ]
  },
  {
    title: "Lesson 2: Greetings",
    description: "Common ways to say hello and goodbye in French.",
    content: [
      { text: "Bonjour - Hello" },
      { text: "Salut - Hi" },
      { text: "Au revoir - Goodbye" }
    ]
  }
];

const prompt = `You are a French language tutor. Based on the following lessons, generate an A1/A2 level test with a mix of multiple choice and fill-in-the-blank exercises. Each question should be clear and educational.

${sampleLessons.map((l, i) => `Lesson ${i + 1}: ${l.title}
${l.description}
${l.content.map(block => block.text).join('\n')}`).join('\n\n')}

Return the test as a text block like:
1. [Question]
  a) ...
  b) ...
  c) ...
  d) ...
Correct answer: [letter or word]
`;

const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`;
const requestBody = {
  contents: [{ parts: [{ text: prompt }] }]
};

const headers = {
  "Content-Type": "application/json"
};

try {
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(requestBody)
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("❌ Gemini error:", JSON.stringify(data, null, 2));
  } else {
    console.log("✅ Test generated:\n", data.candidates?.[0]?.content?.parts?.[0]?.text);
  }
} catch (err) {
  console.error("❌ Request failed:", err);
}
