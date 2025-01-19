import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

/**
 * Middleware to authenticate a token and set the user in the request.
 * @param req - The request object containing the incoming HTTP request.
 * @param res - The response object used to send a response to the client.
 * @param next - The next function to pass control to the next middleware.
 * @returns {void}
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.error("No token found in authorization header.");
        res.status(401).send('Unauthorized.');
        return;
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            res.status(403).send('Invalid token.');
            return;
        }

        req.user = user as User;
        next();
    });
};
