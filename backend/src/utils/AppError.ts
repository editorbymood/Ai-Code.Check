
export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // Marks error as trusted (i.e. we created it)

        Error.captureStackTrace(this, this.constructor);
    }
}
