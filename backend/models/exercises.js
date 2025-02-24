const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true }, 
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: String, required: true } 
});

module.exports = mongoose.model('Exercise', ExerciseSchema, 'beginner_exercises');
