
import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from '../utils/AppError';

export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            const messages = (error as any).errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ');
            next(new AppError(`Validation Error: ${messages}`, 400));
        } else {
            next(error);
        }
    }
};
