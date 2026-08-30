import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

describe('Authentication & Authorization Suite', () => {
  it('GET /api/health returns 200 OK and healthy status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('healthy');
  });

  it('POST /api/auth/register successfully registers a new student', async () => {
    const uniqueEmail = `test.student.${Date.now()}@campuscare.com`;
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test Student',
      email: uniqueEmail,
      password: 'Password@123',
      confirmPassword: 'Password@123',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(uniqueEmail);
    expect(res.body.data.user.role).toBe('STUDENT');
    expect(res.body.data.token).toBeDefined();
  });

  it('POST /api/auth/register fails on duplicate email registration', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Duplicate Student',
      email: 'student@campuscare.com',
      password: 'Student@123',
      confirmPassword: 'Student@123',
    });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/auth/login succeeds with valid student credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'student@campuscare.com',
      password: 'Student@123',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('student@campuscare.com');
    expect(res.body.data.token).toBeDefined();
  });

  it('POST /api/auth/login succeeds with valid admin credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'admin@campuscare.com',
      password: 'Admin@123',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.role).toBe('ADMIN');
    expect(res.body.data.token).toBeDefined();
  });

  it('POST /api/auth/login fails on invalid password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'student@campuscare.com',
      password: 'WrongPassword!',
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/auth/me returns 401 Unauthorized without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
