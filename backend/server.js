import mongoose from 'mongoose';
import fs from 'fs';
import https from 'https';
import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();


if (process.env.NODE_ENV !== 'test') {
  mongoose.connect("mongodb://127.0.0.1:27017/FrenchLessonDB")
    .then(() => {
      console.log("✅ Connected to MongoDB");

      const sslOptions = {
        key: fs.readFileSync("key.pem"),
        cert: fs.readFileSync("cert.pem"),
      };
      const PORT = process.env.PORT || 5000;
      https.createServer(sslOptions, app).listen(PORT, () => {
        console.log(`✅ Server is running securely on https://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err);
    });
}


