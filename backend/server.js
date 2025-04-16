require('dotenv').config(); 
console.log("🔐 JWT_SECRET:", process.env.JWT_SECRET);
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const https = require("https");

// Importă rutele
const userRoutes = require("./routes/userRoutes");
const exerciseRoutes = require("./routes/exerciseRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const testRoutes = require('./routes/testRoutes');

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Folosirea rutelor
app.use("/api/users", userRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use('/api/test', testRoutes);

// Conectare la MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/FrenchLessonDB")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Definirea modelelor de lecții
const { BeginnerLesson, IntermediateLesson, AdvancedLesson } = require("./models/lessons");

// Endpoint: Obține toate lecțiile
app.get("/api/lessons", async (req, res) => {
  try {
    const beginnerLessons = await BeginnerLesson.find();
    const intermediateLessons = await IntermediateLesson.find();
    const advancedLessons = await AdvancedLesson.find();

    const lessons = [
      ...beginnerLessons.map((lesson) => ({ ...lesson, level: "beginner" })),
      ...intermediateLessons.map((lesson) => ({ ...lesson, level: "intermediate" })),
      ...advancedLessons.map((lesson) => ({ ...lesson, level: "advanced" })),
    ];

    res.json(lessons);
  } catch (err) {
    console.error("❌ Error fetching lessons:", err);
    res.status(500).json({ error: "Error fetching lessons", details: err.message });
  }
});

// Endpoint: Obține o lecție după ID
app.get("/api/lessons/:id", async (req, res) => {
  try {
    let lesson = await BeginnerLesson.findById(req.params.id);
    if (!lesson) lesson = await IntermediateLesson.findById(req.params.id);
    if (!lesson) lesson = await AdvancedLesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ error: "Error fetching lesson", details: err.message });
  }
});

// 🔹 Încarcă certificatele SSL
const sslOptions = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
};

// 🔹 Pornirea serverului pe HTTPS
const PORT = 5000;
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`✅ Server is running securely on https://localhost:${PORT}`);
});
