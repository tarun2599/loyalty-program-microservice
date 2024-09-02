import request from 'supertest';
import app from '../app';
import database from '../models/database';

describe('UserController', () => {
    beforeEach(() => {
        // Reset the in-memory database before each test
        (database as any).users.clear();
    });

    it('should register a new user', async () => {
        const response = await request(app)
            .post('/api/v1/register')
            .send({ name: 'John Doe', email: 'john.doe@example.com' });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe('John Doe');
        expect(response.body.email).toBe('john.doe@example.com');
        expect(response.body.balance).toBe(0);
    });

    it('should not allow duplicate email registration', async () => {
        await request(app)
            .post('/api/v1/register')
            .send({ name: 'John Doe', email: 'john.doe@example.com' });

        const response = await request(app)
            .post('/api/v1/register')
            .send({ name: 'Jane Doe', email: 'john.doe@example.com' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Email is already registered');
    });

    it('should retrieve the user balance', async () => {
        const user = await request(app)
            .post('/api/v1/register')
            .send({ name: 'John Doe', email: 'john.doe@example.com' });

        const response = await request(app).get(`/api/v1/balance/${user.body.id}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('balance');
        expect(response.body.balance).toBe(0);
    });

    it('should return 404 if user is not found for balance retrieval', async () => {
        const response = await request(app).get('/api/v1/balance/non-existent-user-id');

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('User not found');
    });
});
