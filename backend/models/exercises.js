import mongoose from 'mongoose';

// 🔹 Schema pentru un singur exercițiu (fără lessonId individual)
const SingleExerciseSchema = new mongoose.Schema({
  question: { type: String, required: true },
  questionType: {
    type: String,
    required: true,
    enum: ['multipleChoice', 'fillInTheBlank', 'readingComprehension', 'listening']
  },
  options: { type: [String], required: false },
  correctAnswer: { type: String, required: true },
  expectedAnswer: { type: String, required: false },
  passage: { type: String, required: false },
  audioUrl: { type: String, required: false }
});

// 🔹 Schema principală, unde `lessonId` este la nivel de document
const ExerciseSchema = new mongoose.Schema({
  lessonId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'lessonRef' },
  lessonRef: {
    type: String,
    required: true,
    enum: ['BeginnerLesson', 'IntermediateLesson', 'AdvancedLesson']
  },
  exercises: { type: [SingleExerciseSchema], required: true }
});

// 🔹 Modelele pentru fiecare colecție
const BeginnerExercise = mongoose.model('BeginnerExercise', ExerciseSchema, 'beginner_exercises');
const IntermediateExercise = mongoose.model('IntermediateExercise', ExerciseSchema, 'intermediate_exercises');
const AdvancedExercise = mongoose.model('AdvancedExercise', ExerciseSchema, 'advanced_exercises');

export { BeginnerExercise, IntermediateExercise, AdvancedExercise };
