import { Request, Response } from "express";
import axios from "axios";
import jwt from 'jsonwebtoken';
import { Database } from "../config/db";
import { User } from "../types";
import { authenticator } from "otplib";
import { encrypt } from "../utils/crypto";

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

/**
 * Handles the callback from Discord after user authentication.
 * @param req - The request object containing the incoming HTTP request.
 * @param res - The response object used to send a response to the client.
 * @returns {Promise<void>}
 */
export const loginCallback = async (req: Request, res: Response): Promise<void> => {
    const { error, error_code, error_description, access_token } = req.query;

    if (error) {
        res.status(400).json({
            error,
            error_code,
            error_description
        });
        return;
    }

    if (!access_token) {
        res.status(400).json({ message: 'No access token received.' });
        return;
    }
    try {
        const userInfoResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const { username, avatar, id } = userInfoResponse.data;

        const db = Database.getInstance();

        const existingUser = await db.query("users", { id });

        const newUser: User = {
            id,
            username,
            avatar,
            createdAt: new Date().toISOString(),
            twoFactorEnabled: false,
            twoFactorSecret: encrypt(authenticator.generateSecret()),
            masterPassword: "",
            passwords: [],
        };

        if (existingUser && existingUser.length > 0) {
            const updatedUserData: any = {
                username,
                avatar,
                createdAt: existingUser[0].createdAt || new Date().toISOString(),
                twoFactorEnabled: existingUser[0].twoFactorEnabled || false,
                twoFactorSecret: existingUser[0].twoFactorSecret || encrypt(authenticator.generateSecret()),
                masterPassword: existingUser[0].masterPassword || "",
            };

            await db.update("users", updatedUserData, { id });
        } else {
            await db.insert("users", newUser);
        }

        const token = jwt.sign({ username, avatar, id }, JWT_SECRET);

        const clientRedirectUrl = process.env.ENVIRONMENT === 'DEVELOPMENT'
            ? `${process.env.DEV_CLIENT_URL}/signin/callback?token=${token}`
            : `${process.env.CLIENT_URL}/signin/auth/callback?token=${token}`;

        res.redirect(clientRedirectUrl);

    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error('Error during authentication (Axios):', error.response?.data);
            res.status(500).json({ message: error.response?.data || 'Error during authentication (Axios)' });
        } else if (error instanceof Error) {
            console.error('Error during authentication:', error.message);
            res.status(500).json({ message: error.message || 'Error during authentication' });
        } else {
            console.error('Unexpected error during authentication:', String(error));
            res.status(500).json({ message: 'Unexpected error during authentication' });
        }
    }
};