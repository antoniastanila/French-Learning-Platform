import request from 'supertest';
import assert from 'assert';
import mongoose from 'mongoose';
import app from '../app.js';
import User from '../models/user.model.js';

describe('User API - Register (Supertest)', function () {
  this.timeout(10000);

  before(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/FrenchLessonTestDB');
  });

beforeEach(async () => {
  await User.deleteMany({});
});

  after(async () => {
    await mongoose.connection.close();
  });

  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.message, 'User registered successfully!');
    assert.ok(res.body.token);
    assert.strictEqual(res.body.user.email, 'testuser@example.com');
  });
  it('should login an existing user successfully', async () => {
  // Creează userul mai întâi
  await new User({
    username: 'loginuser',
    email: 'login@example.com',
    password: 'abc123',
  }).save();

  const res = await request(app)
    .post('/api/users/login')
    .send({
      email: 'login@example.com',
      password: 'abc123',
    });

  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.message, 'Login successful');
  assert.ok(res.body.token);
  assert.strictEqual(res.body.user.email, 'login@example.com');
});
it('should return 401 for incorrect password', async () => {
  await new User({
    username: 'wrongpass',
    email: 'wrong@example.com',
    password: 'correctpass',
  }).save();

  const res = await request(app)
    .post('/api/users/login')
    .send({
      email: 'wrong@example.com',
      password: 'wrongpass',
    });

  assert.strictEqual(res.status, 401);
  assert.strictEqual(res.body.message, 'Parola este incorectă.');
});
it('should update user level to intermediate', async () => {
  const user = await new User({
    username: 'leveluser',
    email: 'level@example.com',
    password: 'abc123',
    level: 'beginner',
  }).save();

  const res = await request(app)
    .patch(`/api/users/${user._id}/update-level`)
    .send({ level: 'intermediate' });

  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.message, 'Nivel actualizat cu succes.');
  assert.strictEqual(res.body.user.level, 'intermediate');
});
it('should update user level to advanced', async () => {
  const user = await new User({
    username: 'leveluser2',
    email: 'level2@example.com',
    password: 'abc123',
    level: 'intermediate',
  }).save();

  const res = await request(app)
    .patch(`/api/users/${user._id}/update-level`)
    .send({ level: 'advanced' });

  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.user.level, 'advanced');
});
it('should mark a lesson as completed', async () => {
  const user = await new User({
    username: 'lessonuser',
    email: 'lesson@example.com',
    password: 'abc123',
    progress: {},
  }).save();

  const res = await request(app)
    .post(`/api/users/${user._id}/complete-lesson`)
    .send({ lessonId: 'L001', level: 'beginner' });

  assert.strictEqual(res.status, 200);
  assert.ok(res.body.completedLessons.includes('L001'));
});
it('should update user theme successfully', async () => {
  const user = await new User({
    username: 'themeuser',
    email: 'theme@example.com',
    password: 'abc123',
    theme: 'theme-light',
  }).save();

  const res = await request(app)
    .patch(`/api/users/${user._id}/update-theme`)
    .send({ theme: 'theme-dark' });

  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.theme, 'theme-dark');
});

});
