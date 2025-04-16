const express = require('express');
const { Configuration, OpenAIApi } = require('openai');
const router = express.Router();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

router.post('/generate', async (req, res) => {
  const { lessons } = req.body;

  if (!lessons || !Array.isArray(lessons) || lessons.length === 0) {
    return res.status(400).json({ message: 'Lessons are required' });
  }

  const prompt = `You are a French language tutor. Based on the following lessons, generate a test for an A1/A2 level learner with a mix of multiple choice and fill-in-the-blank exercises. Keep the format structured and consistent. Lessons:\n\n` +
    lessons.map((lesson, index) => `Lesson ${index + 1}: ${lesson.title}\n${lesson.content || lesson.description || ''}`).join('\n\n');

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful assistant specialized in French learning." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    });

    const test = completion.data.choices[0].message.content;
    res.json({ test });
  } catch (error) {
    console.error('❌ Error generating test with ChatGPT:', error.message);
    res.status(500).json({ message: 'Failed to generate test', error: error.message });
  }
});

module.exports = router;
