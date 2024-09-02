// src/utils/logger.ts
import winston from 'winston';

const { combine, timestamp, printf, errors, json } = winston.format;

// Define the format for logging
const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
});

// Create the logger
const logger = winston.createLogger({
    level: 'info',
    format: combine(
        timestamp(),
        errors({ stack: true }),
        logFormat
    ),
    transports: [
        new winston.transports.Console({
            format: combine(
                timestamp(),
                json()
            )
        }),
        new winston.transports.File({ filename: 'combined.log' }),
        new winston.transports.File({ filename: 'errors.log', level: 'error' })
    ],
});

export default logger;
