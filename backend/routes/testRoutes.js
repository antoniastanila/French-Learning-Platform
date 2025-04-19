import express from 'express';
import { generateTestWithGemini } from '../services/gemini.mjs';

const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    const lessons = req.body.lessons;
    const testText = await generateTestWithGemini(lessons);
    res.json({ test: testText });
  } catch (err) {
    res.status(500).json({ message: "Failed to generate test", error: err.message });
  }
});

export default router;
