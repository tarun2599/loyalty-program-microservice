// src/middleware/rateLimiter.ts
import { Request, Response, NextFunction } from 'express';

interface RateLimitInfo {
    count: number;
    lastRequestTime: number;
}

interface RateLimitStore {
    [key: string]: RateLimitInfo;
}

const rateLimitStore: RateLimitStore = {};
const MAX_REQUESTS = 50; // Maximum number of requests
const TIME_WINDOW = 60 * 1000; // Time window in milliseconds (e.g., 1 minute)

const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || 'unknown-ip'; // Use a default value if req.ip is undefined
    const currentTime = Date.now();

    if (!rateLimitStore[ip]) {
        rateLimitStore[ip] = { count: 1, lastRequestTime: currentTime };
        return next();
    }

    const { count, lastRequestTime } = rateLimitStore[ip];

    if (currentTime - lastRequestTime > TIME_WINDOW) {
        rateLimitStore[ip] = { count: 1, lastRequestTime: currentTime };
        return next();
    }

    if (count >= MAX_REQUESTS) {
        return res.status(429).json({ error: 'Too many requests, please try again later.' });
    }

    rateLimitStore[ip].count += 1;
    next();
};

export default rateLimiter;
