import request from 'supertest';
import assert from 'assert';
import mongoose from 'mongoose';
import app from '../app.js';
import { BeginnerLesson, IntermediateLesson, AdvancedLesson } from '../models/lessons.js';

describe('Lesson API (Supertest)', function () {
  this.timeout(10000);

  let createdLessonId;

  before(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/FrenchLessonTestDB');
  });

  beforeEach(async () => {
    await BeginnerLesson.deleteMany({});
    await IntermediateLesson.deleteMany({});
    await AdvancedLesson.deleteMany({});
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it('should create a new beginner lesson', async () => {
    const res = await request(app)
      .post('/api/lessons')
      .send({
        title: 'Basic Greetings',
        description: 'Learn how to greet in French',
        content: [
          {
            type: 'text',
            text: 'Bonjour, Salut...'
          }
        ],
        level: 'beginner',
        difficulty: 'A1'
      });
      
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.title, 'Basic Greetings');
    assert.strictEqual(res.body.level, 'beginner');
    createdLessonId = res.body._id;
  });

  it('should fetch all lessons including the created one', async () => {
    await new BeginnerLesson({
    title: 'A1 Intro',
    description: 'Test Lesson',
    content: [{ type: 'text', text: 'Salut!' }],
    level: 'beginner',
    difficulty: 'A1'
    }).save();

    const res = await request(app).get('/api/lessons');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body));
    assert.ok(res.body.some(lesson => lesson.level === 'beginner'));
  });

  it('should fetch beginner lessons only', async () => {
    await new BeginnerLesson({
      title: 'B1',
      description: 'Desc',
      content: [{ type: 'text', text: 'Test' }],
      level: 'beginner',
      difficulty: 'A1'
    }).save();
    const res = await request(app).get('/api/lessons?level=beginner');

    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body));
    assert.ok(res.body.every(l => l.level === 'beginner'));
  });

  it('should fetch a lesson by ID and level', async () => {
    const created = await new IntermediateLesson({
      title: 'Interrogatives',
      description: 'How to ask questions',
      content: [{ type: 'text', text: 'Qui, Que, Où...' }],
      level: 'intermediate',
      difficulty: 'B1'
    }).save();


    const res = await request(app).get(`/api/lessons/intermediate/${created._id}`);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body._id.toString(), created._id.toString());
  });

  it('should fetch lessons by multiple IDs', async () => {
   const l1 = await new BeginnerLesson({
     title: 'L1',
     description: '...',
     content: [{ type: 'text', text: 'Test1' }],
     level: 'beginner',
     difficulty: 'A1'
   }).save();

    const l2 = await new AdvancedLesson({
      title: 'L2',
      description: '...',
      content: [{ type: 'text', text: 'Test2' }],
      level: 'advanced',
      difficulty: 'B2'
    }).save();

    const res = await request(app)
      .post('/api/lessons/by-ids')
      .send({ ids: [l1._id, l2._id] });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.lessons.length, 2);
  });
});
