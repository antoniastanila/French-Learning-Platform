const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: [
        {
            phrase: String,
            translation: String
        }
    ],
    difficulty: { type: String, enum: ['A1', 'A2', 'B1', 'B2'], required: true },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
    isUnlocked: { type: Boolean, default: false } 
}, { timestamps: true });

module.exports = mongoose.model('Lesson', lessonSchema);
