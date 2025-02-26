const express = require('express');
const mongoose = require('mongoose');
const { BeginnerLesson, IntermediateLesson } = require('../models/lessons');

const router = express.Router();

// 🔹 Endpoint care primește colecția (beginner/intermediate)
router.get('/:collection/:id', async (req, res) => {
    try {
        const { collection, id } = req.params;
        console.log(`🔍 Fetching lesson from ${collection} with ID ${id}`);

        let model;
        if (collection === 'intermediate_lessons') {
            model = IntermediateLesson;
        } else if (collection === 'beginner_lessons') {
            model = BeginnerLesson;
        } else {
            return res.status(400).json({ message: 'Invalid lesson collection' });
        }

        const lesson = await model.findById(id);
        if (!lesson) {
            console.log("⚠️ Lesson not found in database");
            return res.status(404).json({ message: 'Lesson not found' });
        }

        res.json(lesson);
    } catch (error) {
        console.error("❌ Error retrieving lesson:", error);
        res.status(500).json({ message: 'Error retrieving lesson', error });
    }
});

// Obține toate lecțiile
router.get('/', async (req, res) => {
    try {
        const beginnerLessons = await BeginnerLesson.find();
        const intermediateLessons = await IntermediateLesson.find();
        const lessons = [...beginnerLessons, ...intermediateLessons];

        res.json(lessons);
    } catch (err) {
        console.error("❌ Error fetching lessons:", err);
        res.status(500).json({ error: 'Error fetching lessons', details: err.message });
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
