import { Response, Request, NextFunction } from 'express';

export interface Error {
    status?: number;
    name?: string;
    message?: string;
    stack?: string;
}

const errorMiddleware = (
    error: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    const status = error.status || 500;
    const message =
        error.message || 'Oops, server is not apple to process your request';
    res.status(status).json({ status: 'error', message });
};

export default errorMiddleware;