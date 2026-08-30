import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

let studentToken: string;
let adminToken: string;

beforeAll(async () => {
  const studentRes = await request(app).post('/api/auth/login').send({
    email: 'student@campuscare.com',
    password: 'Student@123',
  });
  studentToken = studentRes.body.data.token;

  const adminRes = await request(app).post('/api/auth/login').send({
    email: 'admin@campuscare.com',
    password: 'Admin@123',
  });
  adminToken = adminRes.body.data.token;
});

describe('AI Intelligent Services Suite', () => {
  it('POST /api/ai/analyze-complaint returns structured suggestion for plumbing issue', async () => {
    const res = await request(app)
      .post('/api/ai/analyze-complaint')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        title: 'Water leaking from bathroom ceiling',
        description: 'Water has been continuously leaking from the bathroom ceiling near room 215 since this morning.',
        location: 'Hostel C Block – Second Floor',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.suggestedCategory).toBe('PLUMBING');
    expect(res.body.data.suggestedPriority).toBe('HIGH');
    expect(res.body.data.summary).toBeDefined();
    expect(res.body.data.reason).toBeDefined();
    expect(res.body.data.suggestedDepartment).toBeDefined();
    expect(res.body.data.confidence).toBeGreaterThan(0.5);
  });

  it('POST /api/ai/admin-insights returns executive trends and recommended actions for admin', async () => {
    const res = await request(app)
      .post('/api/ai/admin-insights')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.overview).toBeDefined();
    expect(Array.isArray(res.body.data.keyTrends)).toBe(true);
    expect(Array.isArray(res.body.data.potentialRisks)).toBe(true);
    expect(Array.isArray(res.body.data.recommendedActions)).toBe(true);
  });

  it('POST /api/ai/admin-insights is restricted to admins only', async () => {
    const res = await request(app)
      .post('/api/ai/admin-insights')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });
});
