// src/middleware/loggerMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { method, url } = req;
    logger.info(`Incoming request`, { method, url });

    res.on('finish', () => {
        const { statusCode } = res;
        logger.info(`Response sent`, { method, url, statusCode });
    });

    next();
};

export default loggerMiddleware;
