const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const exerciseRoutes = require('./routes/exerciseRoutes');
const lessonRoutes = require('./routes/lessonRoutes');

const app = express();
app.use(cors());
app.use(express.json()); // 🔹 Permite trimiterea de JSON în request-uri
app.use('/api/users', userRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/lessons', lessonRoutes);

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

const { BeginnerLesson, IntermediateLesson } = require('./models/lessons');

// 🔹 GET: Obține toate lecțiile
app.get('/api/lessons', async (req, res) => {
  try {
    // 🔹 Caută lecții în ambele colecții
    const beginnerLessons = await BeginnerLesson.find();
    const intermediateLessons = await IntermediateLesson.find();

    // 🔹 Combină toate lecțiile într-un singur array
    const lessons = [...beginnerLessons, ...intermediateLessons];
    
    res.json(lessons);
  } catch (err) {
    console.error("❌ Error fetching lessons:", err);
    res.status(500).json({ error: 'Error fetching lessons', details: err.message });
  }
});app.get('/api/lessons', async (req, res) => {
  try {
    // 🔹 Caută lecții în toate cele trei colecții
    const beginnerLessons = await BeginnerLesson.find();
    const intermediateLessons = await IntermediateLesson.find();
    const advancedLessons = await AdvancedLesson.find(); // ✅ Adăugat AdvancedLesson

    // 🔹 Combină toate lecțiile într-un singur array
    const lessons = [
      ...beginnerLessons.map(lesson => ({ ...lesson, level: 'beginner' })),
      ...intermediateLessons.map(lesson => ({ ...lesson, level: 'intermediate' })),
      ...advancedLessons.map(lesson => ({ ...lesson, level: 'advanced' })) // ✅ Include advanced
    ];

    res.json(lessons);
  } catch (err) {
    console.error("❌ Error fetching lessons:", err);
    res.status(500).json({ error: 'Error fetching lessons', details: err.message });
  }
});



app.get('/api/lessons/:id', async (req, res) => {
  try {
      let lesson = await BeginnerLesson.findById(req.params.id);
      if (!lesson) {
          lesson = await IntermediateLesson.findById(req.params.id);
      }
      if (!lesson) {
          lesson = await AdvancedLesson.findById(req.params.id);
      }

      if (!lesson) {
          return res.status(404).json({ error: 'Lesson not found' });
      }
      res.json(lesson);
  } catch (err) {
      res.status(500).json({ error: 'Error fetching lesson', details: err.message });
  }
});

  

// Pornirea serverului
const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
