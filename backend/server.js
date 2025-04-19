import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import fs from 'fs';
import https from 'https';
import dotenv from 'dotenv';
dotenv.config();

// 🔁 importă rutele
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

mongoose
  .connect("mongodb://127.0.0.1:27017/FrenchLessonDB")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

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

const sslOptions = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
};

const PORT = process.env.PORT || 5000;
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`✅ Server is running securely on https://localhost:${PORT}`);
});
