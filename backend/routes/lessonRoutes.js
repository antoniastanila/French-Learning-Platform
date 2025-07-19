import express from 'express';
import mongoose from 'mongoose';
import { BeginnerLesson, IntermediateLesson, AdvancedLesson } from '../models/lessons.js';

const router = express.Router();

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
    } else if (level === 'advanced') {
      lessons = await AdvancedLesson.find().lean();
      lessons = lessons.map(lesson => ({ ...lesson, level: 'advanced' }));
    } else {
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
    console.error('❌ Error fetching lessons:', err);
    res.status(500).json({ error: 'Error fetching lessons', details: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, content, level, difficulty } = req.body;

    let model;
    if (level === 'beginner') {
      model = BeginnerLesson;
    } else if (level === 'intermediate') {
      model = IntermediateLesson;
    } else if (level === 'advanced') {
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

router.post('/by-ids', async (req, res) => {
  console.log("a fost accesat post by ids din lesson routes!!!");
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

export default router;
