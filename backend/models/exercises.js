const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
    lessonId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'lessonRef' },
    lessonRef: { type: String, required: true, enum: ['BeginnerLesson', 'IntermediateLesson', 'AdvancedLesson'] }, // ✅ Adăugat AdvancedLesson
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: String, required: true }
});

// 🔹 Definim modelele pentru fiecare colecție
const BeginnerExercise = mongoose.model('BeginnerExercise', ExerciseSchema, 'beginner_exercises');
const IntermediateExercise = mongoose.model('IntermediateExercise', ExerciseSchema, 'intermediate_exercises');
const AdvancedExercise = mongoose.model('AdvancedExercise', ExerciseSchema, 'advanced_exercises'); // ✅ Adăugat modelul

module.exports = { BeginnerExercise, IntermediateExercise, AdvancedExercise };
