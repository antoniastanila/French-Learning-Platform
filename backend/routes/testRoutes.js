const express = require('express');
const router = express.Router();

// Test local – fără OpenAI
router.post('/generate', async (req, res) => {
  const { lessons } = req.body;

  if (!lessons || !Array.isArray(lessons) || lessons.length === 0) {
    return res.status(400).json({ message: 'Lessons are required' });
  }

  // ✅ Generează test dummy
  const dummyTest = `
French Test - Based on ${lessons.length} selected lesson(s)

1. What is the French word for "hello"?
  a) Merci
  b) Bonjour
  c) Salut
  d) Au revoir
Correct answer: b

2. Fill in the blank:
Je ____ français. (I speak French)
Correct answer: parle

3. What does "au revoir" mean?
  a) Thank you
  b) Goodbye
  c) Please
  d) Hello
Correct answer: b

4. Fill in the blank:
Comment __-tu? (How are you?)
Correct answer: vas
`;

  res.json({ test: dummyTest });
});

module.exports = router;
