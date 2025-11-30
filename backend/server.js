import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const mongoUri =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  'mongodb://127.0.0.1:27017/FrenchLessonDB';

console.log('NODE_ENV is:', process.env.NODE_ENV);
console.log('Using mongoUri:', mongoUri);

mongoose
  .connect(mongoUri)
  .then(() => {
    const source = mongoUri.startsWith('mongodb+srv') ? 'Atlas' : 'local';
    console.log(`✅ Connected to MongoDB (${source})`);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });
