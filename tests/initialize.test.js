const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/db');

describe('POST /initialize', () => {
    beforeAll(async () => {
        console.log('Running migrations...');
        try {
            await db.migrate.latest();
            console.log('Migrations complete.');
        } catch (e) {
            console.error('Migration failed:', e);
        }
    });

    afterAll(async () => {
        console.log('Destroying DB connection...');
        await db.destroy();
        console.log('DB connection destroyed.');
    });

    beforeEach(async () => {
        console.log('Truncating events...');
        await db('events').truncate();
    });

    it('should initialize a new event with tickets', async () => {
        const res = await request(app)
            .post('/initialize')
            .send({
                total_tickets: 100
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('id');
        expect(res.body.total_tickets).toEqual(100);
        expect(res.body.available_tickets).toEqual(100);

        const event = await db('events').where({ id: res.body.id }).first();
        expect(event).toBeTruthy();
        expect(event.total_tickets).toEqual(100);
    });

    it('should return 400 if total_tickets is missing or invalid', async () => {
        const res = await request(app)
            .post('/initialize')
            .send({});

        expect(res.statusCode).toEqual(400);
    });
});
