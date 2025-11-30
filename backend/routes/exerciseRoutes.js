import express from 'express';
import mongoose from 'mongoose';
import { BeginnerExercise, IntermediateExercise, AdvancedExercise } from '../models/exercises.js';
import { BeginnerLesson, IntermediateLesson, AdvancedLesson } from '../models/lessons.js';

const router = express.Router();

router.get('/:lessonId', async (req, res) => {
  try {
    const lessonId = new mongoose.Types.ObjectId(req.params.lessonId);
    const level = req.query.level;

    console.log(`🔹 Request API -> lessonId=${lessonId}, level=${level}`);

    let ExerciseModel;
    if (level === 'intermediate') {
      ExerciseModel = IntermediateExercise;
    } else if (level === 'advanced') {
      ExerciseModel = AdvancedExercise;
    } else {
      ExerciseModel = BeginnerExercise;
    }

    const exercises = await ExerciseModel.find({ lessonId });

    if (!exercises.length) {
      console.log(`⚠️ Nu există exerciții pentru lecția ${lessonId} în colecția ${level}_exercises.`);
      return res.status(404).json({ message: 'Nu există exerciții pentru această lecție.' });
    }

    res.json(exercises);
  } catch (err) {
    console.error('❌ Eroare la preluarea exercițiilor:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/:exerciseId/validate', async (req, res) => {
  try {
    const { userAnswer, index = 0 } = req.body;

    const exercise =
      (await BeginnerExercise.findById(req.params.exerciseId)) ||
      (await IntermediateExercise.findById(req.params.exerciseId)) ||
      (await AdvancedExercise.findById(req.params.exerciseId));

    if (!exercise || !exercise.exercises?.[index]) {
      return res.status(404).json({ message: 'Exercițiul nu a fost găsit.' });
    }

    const actual = exercise.exercises[index];
    const isCorrect = actual.correctAnswer === userAnswer;

    res.json({
      isCorrect,
      correctAnswer: actual.correctAnswer,
      message: isCorrect ? 'Răspuns corect!' : `Răspuns greșit. Corect: ${actual.correctAnswer}`
    });
  } catch (error) {
    res.status(500).json({ message: 'Eroare la validarea răspunsului.', error });
  }
});


//neutilizata
router.post('/', async (req, res) => {
  try {
    const { lessonId, question, options, correctAnswer, level } = req.body;

    let ExerciseModel;
    if (level === 'beginner') {
      ExerciseModel = BeginnerExercise;
    } else if (level === 'intermediate') {
      ExerciseModel = IntermediateExercise;
    } else if (level === 'advanced') {
      ExerciseModel = AdvancedExercise;
    } else {
      return res.status(400).json({ message: 'Nivel invalid. Alege beginner, intermediate sau advanced.' });
    }

    const newExercise = new ExerciseModel({
      lessonId,
      question,
      options,
      correctAnswer,
      lessonRef: `${level.charAt(0).toUpperCase() + level.slice(1)}Lesson`
    });

    await newExercise.save();
    res.status(201).json(newExercise);
  } catch (error) {
    res.status(400).json({ message: 'Eroare la salvarea exercițiului.', error });
  }
});
//neutilizata
router.delete('/:exerciseId', async (req, res) => {
  try {
    const deletedExercise =
      (await BeginnerExercise.findByIdAndDelete(req.params.exerciseId)) ||
      (await IntermediateExercise.findByIdAndDelete(req.params.exerciseId)) ||
      (await AdvancedExercise.findByIdAndDelete(req.params.exerciseId));

    if (!deletedExercise) {
      return res.status(404).json({ message: 'Exercițiul nu a fost găsit.' });
    }

    res.json({ message: 'Exercițiul a fost șters.' });
  } catch (error) {
    res.status(500).json({ message: 'Eroare la ștergerea exercițiului.', error });
  }
});

router.get('/placement-test/:level', async (req, res) => {
  const level = req.params.level;

  try {
    let allExercises = [];

    if (level === 'intermediate') {
      const intermediateDocs = await IntermediateExercise.find({});
      const intermediateExercises = intermediateDocs.flatMap(doc => doc.exercises);

      const last5BeginnerDocs = await BeginnerExercise.find({})
        .sort({ _id: -1 })
        .limit(5);
      const beginnerTailExercises = last5BeginnerDocs.flatMap(doc => doc.exercises);

      allExercises = [...intermediateExercises, ...beginnerTailExercises];

    } else if (level === 'advanced') {
      const advancedDocs = await AdvancedExercise.find({});
      allExercises = advancedDocs.flatMap(doc => doc.exercises);
    } else if (level === 'advanced') {
      const advancedDocs = await AdvancedExercise.find({});
      const advancedExercises = advancedDocs.flatMap(doc => doc.exercises);

      const last5IntermediateDocs = await IntermediateExercise.find({})
        .sort({ _id: -1 })
        .limit(5);
      const intermediateTailExercises = last5IntermediateDocs.flatMap(doc => doc.exercises);

      allExercises = [...advancedExercises, ...intermediateTailExercises];
    } else {
      const beginnerDocs = await BeginnerExercise.find({});
      allExercises = beginnerDocs.flatMap(doc => doc.exercises);
    }


    const shuffled = allExercises.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 4);

    res.json(selected);
  } catch (err) {
    console.error('❌ Eroare la generarea testului:', err);
    res.status(500).json({ message: 'Eroare la generarea testului', error: err.message });
  }
});


export default router;
