import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

let studentToken: string;
let createdComplaintId: number;

beforeAll(async () => {
  const loginRes = await request(app).post('/api/auth/login').send({
    email: 'student@campuscare.com',
    password: 'Student@123',
  });
  studentToken = loginRes.body.data.token;
});

describe('Student Complaint Lifecycle Suite', () => {
  it('POST /api/complaints creates a new complaint ticket with PENDING status', async () => {
    const res = await request(app)
      .post('/api/complaints')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        title: 'Projector HDMI port broken in Room 405',
        description: 'The multimedia podium projector HDMI cord is damaged and does not display laptops.',
        category: 'CLASSROOM_EQUIPMENT',
        location: 'Block 2 – Room 405',
        priority: 'MEDIUM',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.status).toBe('PENDING');
    expect(res.body.data.category).toBe('CLASSROOM_EQUIPMENT');
    createdComplaintId = res.body.data.id;
  });

  it('POST /api/complaints fails on validation when description is too short', async () => {
    const res = await request(app)
      .post('/api/complaints')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        title: 'Short',
        description: 'Short',
        category: 'PLUMBING',
        location: 'Washroom',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/complaints/my returns student complaints list', async () => {
    const res = await request(app)
      .get('/api/complaints/my')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('GET /api/complaints/:id returns full complaint details', async () => {
    const res = await request(app)
      .get(`/api/complaints/${createdComplaintId}`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(createdComplaintId);
    expect(res.body.data.title).toContain('Projector HDMI');
  });

  it('POST /api/complaints/:id/feedback fails if ticket is not yet RESOLVED', async () => {
    const res = await request(app)
      .post(`/api/complaints/${createdComplaintId}/feedback`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        rating: 5,
        comment: 'Great work!',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
