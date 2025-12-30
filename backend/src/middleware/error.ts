
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let error = err;

    if (!(error instanceof AppError)) {
        const message = error.message || 'Internal Server Error';
        const statusCode = error.statusCode || 500;
        error = new AppError(message, statusCode);
    }

    const statusCode = error.statusCode || 500;
    const message = error.message || 'Something went wrong';

    logger.error(message, {
        method: req.method,
        url: req.originalUrl,
        stack: err.stack
    });

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};
