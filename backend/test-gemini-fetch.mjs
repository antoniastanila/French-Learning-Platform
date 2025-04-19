import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
console.log("🔐 Using key:", apiKey);

const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`;

const requestBody = {
  contents: [
    {
      parts: [
        {
          text: "Say hello in French",
        },
      ],
    },
  ],
};

const headers = {
  "Content-Type": "application/json",
};

try {
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(requestBody),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("❌ Gemini error:", JSON.stringify(data, null, 2));
  } else {
    console.log("✅ Gemini response:", JSON.stringify(data, null, 2));
  }
} catch (err) {
  console.error("❌ Request failed:", err);
}
