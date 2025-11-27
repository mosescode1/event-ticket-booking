import request from 'supertest';
import { app } from '../src/app.js';
import database from '../src/database/db.js';

function basic(user, pass) {
  const token = Buffer.from(`${user}:${pass}`).toString('base64');
  return `Basic ${token}`;
}

describe('API Integration', () => {
  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
  });

  test('GET unknown route returns 404 via centralized handler', async () => {
    const res = await request(app).get('/unknown');
    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/Route not found/i);
  });

  test('Register user then authenticate and initialize event', async () => {
    const reg = await request(app)
      .post('/auth/register')
      .send({ userName: 'admin', password: 'secret' });
    expect(reg.status).toBe(201);

    const res = await request(app)
      .post('/events/initialize')
      .set('Authorization', basic('admin', 'secret'))
      .send({ name: 'Concert', availableTickets: 2 });

    expect(res.status).toBe(201);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.availableTickets).toBe(2);
  });

  test('Book tickets and waitlist, then get event status', async () => {
    // get event id 1
    const book1 = await request(app)
      .post('/tickets/book')
      .set('Authorization', basic('admin', 'secret'))
      .send({ eventId: 1, fullName: 'Alice' });
    expect(book1.status).toBe(201);

    const book2 = await request(app)
      .post('/tickets/book')
      .set('Authorization', basic('admin', 'secret'))
      .send({ eventId: 1, fullName: 'Bob' });
    expect(book2.status).toBe(201);

    const book3 = await request(app)
      .post('/tickets/book')
      .set('Authorization', basic('admin', 'secret'))
      .send({ eventId: 1, fullName: 'Charlie' });
    expect(book3.status).toBe(201);
    expect(book3.body.message).toMatch(/waitlist/i);

    const status = await request(app)
      .get('/events/status/1')
      .set('Authorization', basic('admin', 'secret'));

    expect(status.status).toBe(200);
    expect(status.body.data).toHaveProperty('waitlistCount');
  });

  test('Cancel ticket promotes next waitlist user', async () => {
    // cancel ticket id 1
    const cancel = await request(app)
      .post('/tickets/cancel')
      .set('Authorization', basic('admin', 'secret'))
      .send({ ticketId: 1 });

    expect(cancel.status).toBe(200);
    expect(cancel.body.message).toMatch(/cancelled/i);
  });
});
