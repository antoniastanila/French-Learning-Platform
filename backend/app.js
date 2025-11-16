import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import exerciseRoutes from './routes/exerciseRoutes.js';
import lessonRoutes from './routes/lessonRoutes.js';
import testRoutes from './routes/testRoutes.js';
import { BeginnerLesson, IntermediateLesson, AdvancedLesson } from './models/lessons.js';

const app = express();

// 🔹 1. Definești origin-urile permise
const allowedOrigins = [
  'http://localhost:4200',                         // dev local
  'https://baguette-talk-frontend.onrender.com'   // frontend pe Render
];

// 🔹 2. CORS înainte de rute
app.use(cors({
  origin: (origin, callback) => {
    // permite și request-urile fără origin (ex: Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// preflight pentru toate rutele (OPTIONS)
app.options('*', cors());

// 🔹 3. Middleware pentru JSON
app.use(express.json({ limit: '5mb' }));

// 🔹 4. Rutele API
app.use('/api/users', userRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/test', testRoutes);

// 🔹 5. Endpoint pentru toate lecțiile (cum aveai)
app.get('/api/lessons', async (req, res) => {
  try {
    const beginnerLessons = await BeginnerLesson.find();
    const intermediateLessons = await IntermediateLesson.find();
    const advancedLessons = await AdvancedLesson.find();

    const lessons = [
      ...beginnerLessons.map((lesson) => ({ ...lesson.toObject(), level: 'beginner' })),
      ...intermediateLessons.map((lesson) => ({ ...lesson.toObject(), level: 'intermediate' })),
      ...advancedLessons.map((lesson) => ({ ...lesson.toObject(), level: 'advanced' })),
    ];

    res.json(lessons);
  } catch (err) {
    console.error('❌ Error fetching lessons:', err);
    res.status(500).json({ error: 'Error fetching lessons', details: err.message });
  }
});

// 🔹 6. Răspuns frumos pe /
app.get('/', (req, res) => {
  res.send('🥖 Baguette Talk backend is running and connected to MongoDB Atlas!');
});

export default app;
