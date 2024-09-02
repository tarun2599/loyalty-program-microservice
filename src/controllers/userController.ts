// src/controllers/userController.ts
import { Request, Response, NextFunction } from 'express';
import database from '../models/database';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import Cache from '../utils/cache';
import { User } from '../types';
import logger from '../utils/logger';

// Zod schemas for validation
const registerUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
});

const recordTransactionSchema = z.object({
    userId: z.string().uuid("Invalid user ID"),
    type: z.enum(["earn", "spend"]),
    amount: z.number().positive("Amount must be a positive number"),
});

// Create an instance of Cache with a 5-minute TTL
const userCache = new Cache<User>(5 * 60 * 1000);

class UserController {
    registerUser(req: Request, res: Response, next: NextFunction) {
        const result = registerUserSchema.safeParse(req.body);

        if (!result.success) {
            logger.error('User registration failed', { errors: result.error.errors });
            return res.status(400).json({ errors: result.error.errors });
        }

        const { name, email } = result.data;

        if (database.getUserByEmail(email)) {
            logger.warn('Registration attempt with existing email', { email });
            return res.status(400).json({ error: 'Email is already registered' });
        }

        const userId = uuidv4();
        const newUser: User = {
            id: userId,
            name,
            email,
            balance: 0,
            transactions: []
        };

        database.createUser(userId, name, email);
        userCache.set(userId, newUser); // Cache the new user

        logger.info('New user registered', { userId, name, email });
        res.status(201).json(newUser);
    }

    getBalance(req: Request, res: Response, next: NextFunction) {
        const { userId } = req.params;

        // Check cache first
        const cachedUser = userCache.get(userId);

        if (cachedUser) {
            logger.info('Fetched balance from cache', { userId });
            return res.json({ userId: cachedUser.id, name: cachedUser.name, email: cachedUser.email, balance: cachedUser.balance });
        }

        const user = database.getUser(userId);

        if (!user) {
            logger.error('User not found', { userId });
            return res.status(404).json({ error: 'User not found' });
        }

        userCache.set(userId, user); // Cache the user
        logger.info('Fetched balance from database', { userId });

        res.json({ userId: user.id, name: user.name, email: user.email, balance: user.balance });
    }

    recordTransaction(req: Request, res: Response, next: NextFunction) {
        const result = recordTransactionSchema.safeParse(req.body);

        if (!result.success) {
            logger.error('Transaction recording failed', { errors: result.error.errors });
            return res.status(400).json({ errors: result.error.errors });
        }

        const { userId, type, amount } = result.data;
        let user = database.getUser(userId);

        if (!user) {
            logger.error('User not found', { userId });
            return res.status(404).json({ error: 'User not found' });
        }

        const transaction = {
            id: uuidv4(),
            type,
            amount,
            date: new Date(),
        };

        if (type === 'earn') {
            user.balance += amount;
        } else if (type === 'spend' && user.balance >= amount) {
            user.balance -= amount;
        } else {
            logger.error('Insufficient balance for transaction', { userId, amount });
            return res.status(400).json({ error: 'Insufficient balance' });
        }

        user.transactions.push(transaction);
        database.updateUser(user);

        userCache.set(userId, user); // Update the cache

        logger.info('Transaction recorded', { userId, transaction });
        res.json(transaction);
    }

    getTransactions(req: Request, res: Response, next: NextFunction) {
        const { userId } = req.params;

        // Check cache first
        const cachedUser = userCache.get(userId);

        if (cachedUser) {
            logger.info('Fetched transactions from cache', { userId });
            return res.json(cachedUser.transactions);
        }

        const user = database.getUser(userId);

        if (!user) {
            logger.error('User not found', { userId });
            return res.status(404).json({ error: 'User not found' });
        }

        userCache.set(userId, user); // Cache the user

        logger.info('Fetched transactions from database', { userId });
        res.json(user.transactions);
    }
}

export default new UserController();
