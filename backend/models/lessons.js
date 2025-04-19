import mongoose from 'mongoose';

const cheatSheetEntrySchema = new mongoose.Schema({
  term: { type: String, required: true },
  definition: { type: String, required: true }
});

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: [
    {
      type: { type: String, enum: ['text', 'example', 'list', 'table'], required: true },
      text: String,
      phrase: String,
      translation: String,
      items: [String],
      headers: [String],
      rows: [[String]]
    }
  ],
  difficulty: { type: String, enum: ['A1', 'A2', 'B1', 'B2'], required: true },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
  isUnlocked: { type: Boolean, default: false },
  cheatSheet: {
    headers: [String],
    rows: [[String]]
  }
}, { timestamps: true });

const BeginnerLesson = mongoose.model('BeginnerLesson', lessonSchema, 'beginner_lessons');
const IntermediateLesson = mongoose.model('IntermediateLesson', lessonSchema, 'intermediate_lessons');
const AdvancedLesson = mongoose.model('AdvancedLesson', lessonSchema, 'advanced_lessons');

export { BeginnerLesson, IntermediateLesson, AdvancedLesson };
