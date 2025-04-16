const express = require('express');
const mongoose = require('mongoose');
const { BeginnerLesson, IntermediateLesson, AdvancedLesson } = require('../models/lessons');

const router = express.Router();

// 🔹 Endpoint care primește colecția (beginner/intermediate)
router.get('/', async (req, res) => {
    try {
        const { level } = req.query;

        // 🔹 Mapăm nivelurile la modelele corespunzătoare
        const levelMap = {
            beginner: BeginnerLesson,
            intermediate: IntermediateLesson,
            advanced: AdvancedLesson
        };

        let lessons = [];

        if (level) {
            // ✅ Căutăm lecțiile doar pentru nivelul specificat
            if (!levelMap[level]) {
                return res.status(400).json({ error: 'Nivel invalid' });
            }
            lessons = await levelMap[level].find().lean();
            lessons = lessons.map(lesson => ({ ...lesson, level })); // ✅ Adaugă level în fiecare obiect
        } else {
            // ✅ Căutăm toate lecțiile din toate nivelurile
            const beginnerLessons = await BeginnerLesson.find().lean();
            const intermediateLessons = await IntermediateLesson.find().lean();
            const advancedLessons = await AdvancedLesson.find().lean();

            lessons = [
                ...beginnerLessons.map(lesson => ({ ...lesson, level: 'beginner' })), 
                ...intermediateLessons.map(lesson => ({ ...lesson, level: 'intermediate' })), 
                ...advancedLessons.map(lesson => ({ ...lesson, level: 'advanced' }))
            ];
        }

        res.json(lessons);
    } catch (err) {
        console.error("❌ Error fetching lessons:", err);
        res.status(500).json({ error: 'Error fetching lessons', details: err.message });
    }
});


router.get('/', async (req, res) => {
    try {
        const { level } = req.query;
        let lessons = [];

        if (level === 'beginner') {
            lessons = await BeginnerLesson.find().lean();
            lessons = lessons.map(lesson => ({ ...lesson, level: 'beginner' })); 
        } else if (level === 'intermediate') {
            lessons = await IntermediateLesson.find().lean();
            lessons = lessons.map(lesson => ({ ...lesson, level: 'intermediate' })); 
        } else if (level === 'advanced') {  // ✅ Adăugat suport pentru advanced
            lessons = await AdvancedLesson.find().lean();
            lessons = lessons.map(lesson => ({ ...lesson, level: 'advanced' })); 
        } else {
            const beginnerLessons = await BeginnerLesson.find().lean();
            const intermediateLessons = await IntermediateLesson.find().lean();
            const advancedLessons = await AdvancedLesson.find().lean();  // ✅ Adăugat advanced

            lessons = [
                ...beginnerLessons.map(lesson => ({ ...lesson, level: 'beginner' })), 
                ...intermediateLessons.map(lesson => ({ ...lesson, level: 'intermediate' })), 
                ...advancedLessons.map(lesson => ({ ...lesson, level: 'advanced' }))  // ✅ Adăugat lecțiile de advanced
            ];
        }

        res.json(lessons);
    } catch (err) {
        console.error("❌ Error fetching lessons:", err);
        res.status(500).json({ error: 'Error fetching lessons', details: err.message });
    }
});



// Adaugă o lecție nouă
router.post('/', async (req, res) => {
    try {
        const { title, description, content, level, difficulty } = req.body;
        
        let model;
        if (level === 'beginner') {
            model = BeginnerLesson;
        } else if (level === 'intermediate') {
            model = IntermediateLesson;
        } else if (level === 'advanced') { // ✅ Suport pentru advanced
            model = AdvancedLesson;
        } else {
            return res.status(400).json({ error: 'Invalid lesson level' });
        }

        const newLesson = new model({ title, description, content, level, difficulty });
        await newLesson.save();
        
        res.status(201).json(newLesson);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/:level/:id', async (req, res) => {
    try {
        const { level, id } = req.params;
        let model;

        if (level === 'beginner') {
            model = BeginnerLesson;
        } else if (level === 'intermediate') {
            model = IntermediateLesson;
        } else if (level === 'advanced') {
            model = AdvancedLesson;
        } else {
            return res.status(400).json({ error: 'Invalid level' });
        }

        const lesson = await model.findById(id);

        if (!lesson) {
            return res.status(404).json({ error: 'Lesson not found' });
        }

        res.json(lesson);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching lesson', details: err.message });
    }
});

// POST /api/lessons/by-ids
router.post('/by-ids', async (req, res) => {
    const { ids } = req.body;
  
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'No lesson IDs provided.' });
    }
  
    try {
      const lessons = [];
  
      for (const id of ids) {
        let lesson = await BeginnerLesson.findById(id);
        if (!lesson) lesson = await IntermediateLesson.findById(id);
        if (!lesson) lesson = await AdvancedLesson.findById(id);
        if (lesson) lessons.push(lesson);
      }
  
      res.json({ lessons });
    } catch (err) {
      console.error('❌ Error fetching lessons by IDs:', err);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });
  

module.exports = router;
