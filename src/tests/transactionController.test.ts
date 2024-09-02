// tests/transactionController.test.ts
import request from 'supertest';
import app from '../app';
import database from '../models/database';

describe('TransactionController', () => {
    let userId: string;

    beforeEach(async () => {
        // Reset the in-memory database before each test
        (database as any).users.clear();

        // Create a new user for each test
        const userResponse = await request(app)
            .post('/api/v1/register')
            .send({ name: 'Tarun Lakhmani', email: 'tarun@example.com' });

        userId = userResponse.body.id;
    });

    it('should record an earning transaction and update the balance', async () => {
        const response = await request(app)
            .post('/api/v1/transaction')
            .send({ userId, type: 'earn', amount: 100 });

        expect(response.status).toBe(200);
        expect(response.body.type).toBe('earn');
        expect(response.body.amount).toBe(100);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('date');

        const balanceResponse = await request(app).get(`/api/v1/balance/${userId}`);
        expect(balanceResponse.body.balance).toBe(100);
    });

    it('should record a spending transaction and update the balance', async () => {
        // First, earn some points
        await request(app)
            .post('/api/v1/transaction')
            .send({ userId, type: 'earn', amount: 100 });

        // Now, spend some points
        const response = await request(app)
            .post('/api/v1/transaction')
            .send({ userId, type: 'spend', amount: 50 });

        expect(response.status).toBe(200);
        expect(response.body.type).toBe('spend');
        expect(response.body.amount).toBe(50);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('date');

        const balanceResponse = await request(app).get(`/api/v1/balance/${userId}`);
        expect(balanceResponse.body.balance).toBe(50);
    });

    it('should return 400 if spending amount exceeds balance', async () => {
        // Earn points first
        await request(app)
            .post('/api/v1/transaction')
            .send({ userId, type: 'earn', amount: 100 });

        // Attempt to spend more points than available
        const response = await request(app)
            .post('/api/v1/transaction')
            .send({ userId, type: 'spend', amount: 150 });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Insufficient balance');

        const balanceResponse = await request(app).get(`/api/v1/balance/${userId}`);
        expect(balanceResponse.body.balance).toBe(100); // Balance should remain unchanged
    });

    it('should return 400 if user id not uuid', async () => {
        const response = await request(app)
            .post('/api/v1/transaction')
            .send({ userId: 'non-existent-user-id', type: 'earn', amount: 100 });

        expect(response.status).toBe(400);
    });

    it('should return 400 for invalid transaction data', async () => {
        // Missing amount field
        let response = await request(app)
            .post('/api/v1/transaction')
            .send({ userId, type: 'earn' });

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();

        // Invalid transaction type
        response = await request(app)
            .post('/api/v1/transaction')
            .send({ userId, type: 'invalid-type', amount: 100 });

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

    it('should retrieve transaction history', async () => {
        await request(app)
            .post('/api/v1/transaction')
            .send({ userId, type: 'earn', amount: 100 });

        await request(app)
            .post('/api/v1/transaction')
            .send({ userId, type: 'spend', amount: 50 });

        const response = await request(app).get(`/api/v1/transactions/${userId}`);

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);

        // Check the first transaction (earn)
        expect(response.body[0].type).toBe('earn');
        expect(response.body[0].amount).toBe(100);
        expect(response.body[0]).toHaveProperty('id');
        expect(response.body[0]).toHaveProperty('date');

        // Check the second transaction (spend)
        expect(response.body[1].type).toBe('spend');
        expect(response.body[1].amount).toBe(50);
        expect(response.body[1]).toHaveProperty('id');
        expect(response.body[1]).toHaveProperty('date');
    });
});
