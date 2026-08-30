import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

let adminToken: string;
let studentToken: string;

beforeAll(async () => {
  const adminRes = await request(app).post('/api/auth/login').send({
    email: 'admin@campuscare.com',
    password: 'Admin@123',
  });
  adminToken = adminRes.body.data.token;

  const studentRes = await request(app).post('/api/auth/login').send({
    email: 'student@campuscare.com',
    password: 'Student@123',
  });
  studentToken = studentRes.body.data.token;
});

describe('Admin Management Suite', () => {
  it('GET /api/admin/dashboard returns telemetry and chart breakdowns', async () => {
    const res = await request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.summary.total).toBeDefined();
    expect(res.body.data.charts.categories).toBeDefined();
    expect(res.body.data.charts.status).toBeDefined();
  });

  it('GET /api/admin/dashboard returns 403 Forbidden for student tokens', async () => {
    const res = await request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/admin/complaints returns all campus complaints with filters', async () => {
    const res = await request(app)
      .get('/api/admin/complaints?status=PENDING')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('PATCH /api/admin/complaints/:id updates complaint status and priority', async () => {
    // 1. Student creates a complaint
    const newComp = await request(app)
      .post('/api/complaints')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        title: 'Ceiling light flickering in Room 101',
        description: 'Fluorescent bulb blinks rapidly causing eye strain during lectures.',
        category: 'ELECTRICAL',
        location: 'Block A – Room 101',
        priority: 'MEDIUM',
      });

    const compId = newComp.body.data.id;

    // 2. Admin moves PENDING -> IN_PROGRESS
    const updateProgress = await request(app)
      .patch(`/api/admin/complaints/${compId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'IN_PROGRESS', priority: 'HIGH' });

    expect(updateProgress.status).toBe(200);
    expect(updateProgress.body.data.status).toBe('IN_PROGRESS');
    expect(updateProgress.body.data.priority).toBe('HIGH');

    // 3. Admin moves IN_PROGRESS -> RESOLVED
    const updateResolved = await request(app)
      .patch(`/api/admin/complaints/${compId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'RESOLVED' });

    expect(updateResolved.status).toBe(200);
    expect(updateResolved.body.data.status).toBe('RESOLVED');

    // 4. Student now successfully submits 5-star feedback
    const feedbackRes = await request(app)
      .post(`/api/complaints/${compId}/feedback`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        rating: 5,
        comment: 'Technician replaced the ballast within 2 hours. Excellent work!',
      });

    expect(feedbackRes.status).toBe(201);
    expect(feedbackRes.body.success).toBe(true);
    expect(feedbackRes.body.data.rating).toBe(5);
  });
});
