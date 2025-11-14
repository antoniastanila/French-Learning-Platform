import mongoose from 'mongoose';
import fs from 'fs';
import https from 'https';
import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

// vedem dacă suntem în producție (Render, etc.)
const isProd = process.env.NODE_ENV === 'production';

// alegem URI-ul: dacă există MONGODB_URI -> Atlas, altfel MONGO_URI/local
const mongoUri =
  process.env.MONGODB_URI ||                 // Atlas (cloud)
  process.env.MONGO_URI ||                   // local din .env
  'mongodb://127.0.0.1:27017/FrenchLessonDB';

console.log('NODE_ENV is:', process.env.NODE_ENV);
console.log('Using mongoUri:', mongoUri);

mongoose
  .connect(mongoUri)
  .then(() => {
    const source = mongoUri.startsWith('mongodb+srv') ? 'Atlas' : 'local';
    console.log(`✅ Connected to MongoDB (${source})`);

    const PORT = process.env.PORT || 5000;

    if (isProd) {
      // în producție (Render) – fără HTTPS manual; providerul are deja HTTPS
      app.listen(PORT, () => {
        console.log(`✅ Server is running on port ${PORT}`);
      });
    } else {
      // local – cu HTTPS folosind key.pem și cert.pem
      const sslOptions = {
        key: fs.readFileSync('key.pem'),
        cert: fs.readFileSync('cert.pem'),
      };

      https.createServer(sslOptions, app).listen(PORT, () => {
        console.log(`✅ Server is running securely on https://localhost:${PORT}`);
      });
    }
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });
