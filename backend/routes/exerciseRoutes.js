const express = require('express');
const mongoose = require('mongoose');
const { BeginnerExercise, IntermediateExercise } = require('../models/exercises');
const { BeginnerLesson, IntermediateLesson } = require('../models/lessons');

const router = express.Router();

// 🔹 Obține toate exercițiile pentru o lecție (în funcție de nivel)
router.get('/:lessonId', async (req, res) => {
    try {
        const lessonId = new mongoose.Types.ObjectId(req.params.lessonId);
        const level = req.query.level; // 🔹 Preluăm nivelul din query param
        
        console.log(`🔹 Request API -> lessonId=${lessonId}, level=${level}`);

        // 🔹 Alegem colecția corectă
        let ExerciseModel;
        if (level === 'intermediate') {
            ExerciseModel = IntermediateExercise;
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
        console.error("❌ Eroare la preluarea exercițiilor:", err);
        res.status(500).json({ error: err.message });
    }
});


// 🔹 Endpoint pentru validarea răspunsului la exerciții
router.post('/:exerciseId/validate', async (req, res) => {
    try {
        const { userAnswer } = req.body;
        const exercise = await BeginnerExercise.findById(req.params.exerciseId) || await IntermediateExercise.findById(req.params.exerciseId);

        if (!exercise) {
            return res.status(404).json({ message: 'Exercițiul nu a fost găsit.' });
        }

        const isCorrect = exercise.correctAnswer === userAnswer;
        res.json({ 
            isCorrect, 
            correctAnswer: exercise.correctAnswer,
            message: isCorrect ? 'Răspuns corect!' : `Răspuns greșit. Corect: ${exercise.correctAnswer}`
        });

    } catch (error) {
        res.status(500).json({ message: 'Eroare la validarea răspunsului.', error });
    }
});

// 🔹 Adaugă un exercițiu nou în colecția corespunzătoare
router.post('/', async (req, res) => {
    try {
        const { lessonId, question, options, correctAnswer, level } = req.body;

        let ExerciseModel;
        if (level === 'beginner') {
            ExerciseModel = BeginnerExercise;
        } else if (level === 'intermediate') {
            ExerciseModel = IntermediateExercise;
        } else {
            return res.status(400).json({ message: 'Nivel invalid. Alege beginner sau intermediate.' });
        }

        const newExercise = new ExerciseModel({ lessonId, question, options, correctAnswer, lessonRef: `${level.charAt(0).toUpperCase() + level.slice(1)}Lesson` });
        await newExercise.save();
        res.status(201).json(newExercise);
    } catch (error) {
        res.status(400).json({ message: 'Eroare la salvarea exercițiului.', error });
    }
});

// 🔹 Șterge un exercițiu după ID
router.delete('/:exerciseId', async (req, res) => {
    try {
        await BeginnerExercise.findByIdAndDelete(req.params.exerciseId) || await IntermediateExercise.findByIdAndDelete(req.params.exerciseId);
        res.json({ message: 'Exercițiul a fost șters' });
    } catch (error) {
        res.status(500).json({ message: 'Eroare la ștergerea exercițiului.', error });
    }
});

module.exports = router;
