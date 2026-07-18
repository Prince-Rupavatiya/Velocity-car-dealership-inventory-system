const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');

describe('Auth API', () => {
  describe('POST /api/auth/register', () => {
    it('registers a new user and returns a token', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Prince Rupavatiya',
        email: 'prince@example.com',
        password: 'password123',
        phone: '+911234567890',
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe('prince@example.com');
      expect(res.body.user.password).toBeUndefined();
      expect(res.body.user.role).toBe('user');
    });

    it('rejects registration with a duplicate email', async () => {
      await User.create({ name: 'A', email: 'dup@example.com', password: 'password123' });

      const res = await request(app).post('/api/auth/register').send({
        name: 'B',
        email: 'dup@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it('rejects registration with missing required fields', async () => {
      const res = await request(app).post('/api/auth/register').send({ email: 'nofields@example.com' });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await User.create({
        name: 'Login User',
        email: 'login@example.com',
        password: 'password123',
      });
    });

    it('logs in with correct credentials', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'login@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
    });

    it('rejects login with an incorrect password', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'login@example.com',
        password: 'wrongpassword',
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('rejects login for a non-existent email', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'ghost@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    it('rejects requests without a token', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
    });

    it('returns the current user profile with a valid token', async () => {
      const registerRes = await request(app).post('/api/auth/register').send({
        name: 'Me User',
        email: 'me@example.com',
        password: 'password123',
      });

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${registerRes.body.token}`);

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe('me@example.com');
    });
  });
});
