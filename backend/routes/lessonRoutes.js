const express = require('express');
const Lesson = require('../models/Lesson');

const router = express.Router();

// Obține toate lecțiile
router.get('/', async (req, res) => {
    try {
        const lessons = await Lesson.find();
        res.json(lessons);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Adaugă o lecție nouă
router.post('/', async (req, res) => {
    try {
        const { title, content, level } = req.body;
        const newLesson = new Lesson({ title, content, level });
        await newLesson.save();
        res.status(201).json(newLesson);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
