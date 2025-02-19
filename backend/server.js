const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(cors());
app.use(express.json()); // 🔹 Permite trimiterea de JSON în request-uri
app.use('/api/users', userRoutes);

// Conectare la MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/FrenchLessonDB')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));
  
  const LessonSchema = new mongoose.Schema({
    title: String,
    description: String,
    content: Array,
    difficulty: String
  });

// 🔹 Definim o colecție MongoDB (Lesson)
const Lesson = mongoose.model('Lesson', LessonSchema, 'beginner_lessons');

// 🔹 GET: Obține toate lecțiile
app.get('/api/lessons', async (req, res) => {
  try {
    const lessons = await Lesson.find();
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching lessons' });
  }
});

app.get('/api/lessons/:id', async (req, res) => {
    try {
      const lesson = await Lesson.findById(req.params.id);
      if (!lesson) {
        return res.status(404).json({ error: 'Lesson not found' });
      }
      res.json(lesson);
    } catch (err) {
      res.status(500).json({ error: 'Error fetching lesson' });
    }
  });
  

// Pornirea serverului
const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
