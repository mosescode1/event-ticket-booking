const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/db');

describe('Integration Test: Full Flow', () => {
    beforeAll(async () => {
        await db.migrate.latest();
    });

    afterAll(async () => {
        await db.destroy();
    });

    beforeEach(async () => {
        await db('waitlist').truncate();
        await db('bookings').truncate();
        await db('events').truncate();
    });

    it('should handle the full booking flow with waitlist', async () => {
        // 1. Initialize Event with 2 tickets
        const initRes = await request(app)
            .post('/initialize')
            .send({ total_tickets: 2 });
        expect(initRes.statusCode).toEqual(200);
        const eventId = initRes.body.id;

        // 2. Book 2 tickets (Full)
        await request(app).post('/book').send({ event_id: eventId, user_id: 'user1' }).expect(200);
        await request(app).post('/book').send({ event_id: eventId, user_id: 'user2' }).expect(200);

        // Check status: 0 available
        let statusRes = await request(app).get(`/status/${eventId}`);
        expect(statusRes.body.available_tickets).toEqual(0);

        // 3. Book 3rd ticket (Waitlist)
        const waitlistRes = await request(app)
            .post('/book')
            .send({ event_id: eventId, user_id: 'user3' });
        expect(waitlistRes.body.message).toContain('waitlist');

        // Check status: 1 in waitlist
        statusRes = await request(app).get(`/status/${eventId}`);
        expect(statusRes.body.waitlist_count).toEqual(1);

        // 4. Cancel user1 booking
        await request(app)
            .post('/cancel')
            .send({ event_id: eventId, user_id: 'user1' })
            .expect(200);

        // Check status: Still 0 available (user3 took the spot), 0 in waitlist
        statusRes = await request(app).get(`/status/${eventId}`);
        expect(statusRes.body.available_tickets).toEqual(0);
        expect(statusRes.body.waitlist_count).toEqual(0);

        // Verify user3 has a booking
        const booking = await db('bookings').where({ event_id: eventId, user_id: 'user3' }).first();
        expect(booking).toBeTruthy();
    });
});
