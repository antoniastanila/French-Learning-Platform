import request from 'supertest';
import assert from 'assert';
import mongoose from 'mongoose';
import app from '../app.js';
import { BeginnerLesson } from '../models/lessons.js';
import { BeginnerExercise } from '../models/exercises.js';

describe('Exercise API (Supertest)', function () {
  this.timeout(10000);

  let lessonId;
  let exerciseId;
let testLesson;

before(async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/FrenchLessonTestDB');
  testLesson = await new BeginnerLesson({
    title: 'Test Lesson',
    description: 'For exercise tests',
    content: [],
    difficulty: 'A1',
    level: 'beginner',
  }).save();
});

  beforeEach(async () => {
    await BeginnerLesson.deleteMany({});
    await BeginnerExercise.deleteMany({});

    const lesson = await new BeginnerLesson({
      title: 'Unit Test Lesson',
      description: 'Test',
      content: [],
      difficulty: 'A1',
      level: 'beginner'
    }).save();

    lessonId = lesson._id;
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it('should create a new beginner exercise', async () => {
    const res = await request(app)
      .post('/api/exercises')
      .send({
        lessonId,
        level: 'beginner',
        question: 'What is "bonjour"?',
        questionType: 'multipleChoice',
        options: ['Hello', 'Goodbye'],
        correctAnswer: 'Hello'
      });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.lessonId, lessonId.toString());
    exerciseId = res.body._id;
  });

  it('should fetch exercises for a given lesson', async () => {
    const exerciseDoc = new BeginnerExercise({
      lessonId,
      lessonRef: 'BeginnerLesson',
      exercises: [{
        question: 'Test Q',
        questionType: 'multipleChoice',
        options: ['A', 'B'],
        correctAnswer: 'A'
      }]
    });
    await exerciseDoc.save();

    const res = await request(app).get(`/api/exercises/${lessonId}?level=beginner`);

    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body));
    assert.strictEqual(res.body.length, 1);
  });

 it('should validate a correct answer', async () => {
  const exerciseDoc = new BeginnerExercise({
    lessonId,
    lessonRef: 'BeginnerLesson',
    exercises: [
      {
        question: 'Capital of France?',
        questionType: 'multipleChoice',
        options: ['Paris', 'Rome'],
        correctAnswer: 'Paris'
      }
    ]
  });
  const saved = await exerciseDoc.save();

  const res = await request(app)
    .post(`/api/exercises/${saved._id}/validate`)
    .send({
      userAnswer: 'Paris',
      index: 0 // ✅ indicăm explicit că validăm primul exercițiu
    });

  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.isCorrect, true);
  assert.strictEqual(res.body.correctAnswer, 'Paris');
});



  it('should delete an exercise', async () => {
    const exercise = await new BeginnerExercise({
      lessonId,
      lessonRef: 'BeginnerLesson',
      exercises: [{
        question: 'To be or not to be',
        questionType: 'multipleChoice',
        options: ['A', 'B'],
        correctAnswer: 'A'
      }]
    }).save();

    const res = await request(app).delete(`/api/exercises/${exercise._id}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.message, 'Exercițiul a fost șters.');
  });

  it('should return placement test exercises', async () => {
    const beginner = new BeginnerExercise({
      lessonId,
      lessonRef: 'BeginnerLesson',
      exercises: [
        {
          question: 'Unit Q',
          questionType: 'multipleChoice',
          options: ['Yes', 'No'],
          correctAnswer: 'Yes'
        }
      ]
    });

    await beginner.save();

    const res = await request(app).get('/api/exercises/placement-test/beginner');

    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body));
  });

  it('should fetch exercises for a given lesson', async () => {
    await new BeginnerExercise({
      lessonId: testLesson._id,
      lessonRef: 'BeginnerLesson',
      exercises: [
        {
          question: 'How do you say thank you?',
          questionType: 'multipleChoice',
          options: ['Bonjour', 'Merci'],
          correctAnswer: 'Merci'
        }
      ]
    }).save();

    const res = await request(app).get(`/api/exercises/${testLesson._id}?level=beginner`);
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body));
  });

  it('should reject creating exercise with invalid level', async () => {
    const res = await request(app)
      .post('/api/exercises')
      .send({
        lessonId: testLesson._id,
        question: 'Invalid level test',
        questionType: 'multipleChoice',
        options: ['a', 'b'],
        correctAnswer: 'a',
        level: 'expert' // Invalid
      });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.message, 'Nivel invalid. Alege beginner, intermediate sau advanced.');
  });

  it('should return exercises for placement test (beginner)', async () => {
    const res = await request(app).get('/api/exercises/placement-test/beginner');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body));
  });
});
