import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import { Error } from './errorMiddleware';

dotenv.config();

const { TOKEN_SECRET } = process.env;

export const createToken = (user_name: string): string => {
    return jwt.sign(
        { user_name: user_name },
        TOKEN_SECRET as unknown as string
    );
};

const unauthedError = (next: NextFunction) => {
    const error: Error = new Error('Login Error, Please login again');
    error.status = 401;
    next(error);
};
export const verifyToken = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const headerAuth = req.headers.authorization;
        if (headerAuth) {
            const bearer = headerAuth.split(' ')[0].toLowerCase();
            const token = headerAuth.split(' ')[1];
            if (token && bearer === 'bearer') {
                const decoded = jwt.verify(
                    token,
                    TOKEN_SECRET as unknown as string
                );
                if (decoded) {
                    next();
                } else {
                    unauthedError(next);
                }
            } else {
                unauthedError(next);
            }
        } else {
            unauthedError(next);
        }
    } catch (err) {
        unauthedError(next);
    }
};