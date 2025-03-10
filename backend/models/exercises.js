const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
    lessonId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'lessonRef' },
    lessonRef: { type: String, required: true, enum: ['BeginnerLesson', 'IntermediateLesson'] }, // Referință dinamică
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: String, required: true } 
});

// 🔹 Definim modelele pentru fiecare colecție
const BeginnerExercise = mongoose.model('BeginnerExercise', ExerciseSchema, 'beginner_exercises');
const IntermediateExercise = mongoose.model('IntermediateExercise', ExerciseSchema, 'intermediate_exercises');

module.exports = { BeginnerExercise, IntermediateExercise };
