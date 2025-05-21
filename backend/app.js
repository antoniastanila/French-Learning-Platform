import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import exerciseRoutes from './routes/exerciseRoutes.js';
import lessonRoutes from './routes/lessonRoutes.js';
import testRoutes from './routes/testRoutes.js';
import { BeginnerLesson, IntermediateLesson, AdvancedLesson } from './models/lessons.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.use('/api/users', userRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/test', testRoutes);

app.get("/api/lessons", async (req, res) => {
  try {
    const beginnerLessons = await BeginnerLesson.find();
    const intermediateLessons = await IntermediateLesson.find();
    const advancedLessons = await AdvancedLesson.find();

    const lessons = [
      ...beginnerLessons.map((lesson) => ({ ...lesson.toObject(), level: "beginner" })),
      ...intermediateLessons.map((lesson) => ({ ...lesson.toObject(), level: "intermediate" })),
      ...advancedLessons.map((lesson) => ({ ...lesson.toObject(), level: "advanced" })),
    ];

    res.json(lessons);
  } catch (err) {
    console.error("❌ Error fetching lessons:", err);
    res.status(500).json({ error: "Error fetching lessons", details: err.message });
  }
});

export default app;
