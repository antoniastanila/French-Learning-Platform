const express = require('express');
const Exercise = require('../models/exercises');
const mongoose = require('mongoose');
const router = express.Router();

// 🔹 Obține toate exercițiile pentru o lecție
router.get('/:lessonId', async (req, res) => {
    try {
        const lessonId = new mongoose.Types.ObjectId(req.params.lessonId); // 🔹 Convertim în ObjectId
        const exercises = await Exercise.find({ lessonId: lessonId });
        
        if (exercises.length === 0) {
            return res.status(404).json({ message: 'Nu există exerciții pentru această lecție.' });
        }
        
        res.json(exercises);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/:exerciseId/validate', async (req, res) => {
    try {
        const { userAnswer } = req.body; // Răspunsul trimis de utilizator
        const exercise = await Exercise.findById(req.params.exerciseId);

        if (!exercise) {
            return res.status(404).json({ message: 'Exercițiul nu a fost găsit.' });
        }

        // 🔹 Comparăm răspunsul utilizatorului cu cel corect
        const isCorrect = exercise.correctAnswer === userAnswer;
        console.log("🔍 Verificare răspuns:", { userAnswer, correctAnswer: exercise.correctAnswer, isCorrect });

        res.json({ 
            isCorrect, 
            correctAnswer: exercise.correctAnswer,
            message: isCorrect ? 'Răspuns corect!' : 'Răspuns greșit. Răspunsul corect este: ' + exercise.correctAnswer 
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// 🔹 Adaugă un exercițiu nou
router.post('/', async (req, res) => {
    try {
        const { lessonId, question, options, correctAnswer } = req.body;
        const newExercise = new Exercise({ lessonId, question, options, correctAnswer });
        await newExercise.save();
        res.status(201).json(newExercise);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 🔹 Șterge un exercițiu după ID
router.delete('/:exerciseId', async (req, res) => {
    try {
        await Exercise.findByIdAndDelete(req.params.exerciseId);
        res.json({ message: 'Exercițiul a fost șters' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
