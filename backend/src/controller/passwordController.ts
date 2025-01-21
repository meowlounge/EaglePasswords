import { Request, Response } from "express";
import { decrypt, encrypt } from "../utils/crypto";
import { Database } from "../config/db";
import { Password } from "../types";
import { ulid } from "ulid";

/**
 * Retrieves all stored passwords from the user's "passwords" array and decrypts them.
 * 
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @returns {Promise<void>} - Sends a response containing the decrypted passwords.
 */
export const getPasswords = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const db = Database.getInstance();

    if (!userId) {
        console.log("Unauthorized access attempt, no user ID found.");
        res.status(403).send("Unauthorized");
        return;
    }

    try {
        const user = await db.query("users", { id: userId });

        if (!user || !user[0]?.passwords) {
            console.log(`No passwords found for user: ${userId}`);
            res.status(410).send("No passwords found");
            return;
        }

        const passwords = user[0].passwords.map((pwd: any) => ({
            ...pwd,
            title: decrypt(pwd.title),
            username: decrypt(pwd.username),
            password: decrypt(pwd.password),
            url: decrypt(pwd.url || ""),
            note: decrypt(pwd.note || "")
        }));

        res.json(passwords);
    } catch (error) {
        console.error("Error retrieving passwords:", error);
        res.status(500).send("Error retrieving passwords");
    }
};


/**
 * Adds a new password to the user's "passwords" array after encrypting it.
 * 
 * @param req - The Express request object, containing the password details.
 * @param res - The Express response object.
 * @returns {Promise<void>} - Sends a response indicating whether the password was successfully added.
 */
export const addPassword = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.username;
    if (!userId) {
        res.status(401).send("Unauthorized");
        return;
    }

    const { title, username, password, url, note } = req.body;

    if (!title || !username || !password) {
        res.status(400).send("Missing required fields");
        return;
    }

    const db = Database.getInstance();

    try {
        const newPassword: Password = {
            id: ulid(),
            title: encrypt(title),
            username: encrypt(username),
            password: encrypt(password),
            url: encrypt(url || "") || undefined,
            note: encrypt(note || "") || undefined,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const user = await db.query("users", { username: userId });

        if (!user || !user[0]) {
            res.status(404).send("User not found");
            return;
        }

        const updatedPasswords = [...user[0].passwords, newPassword];

        await db.update("users", { passwords: updatedPasswords }, { username: userId });

        res.status(201).json({ message: "Password added", password: newPassword });
    } catch (error) {
        console.error("Error adding password:", error);
        res.status(500).send("Error adding password");
    }
};


/**
 * Updates an existing password in the user's "passwords" array.
 * 
 * @param req - The Express request object, containing the password ID and updated fields.
 * @param res - The Express response object.
 * @returns {Promise<void>} - Sends a response indicating whether the password was successfully updated.
 */
export const updatePassword = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.username;
    if (!userId) {
        res.status(401).send("Unauthorized");
        return;
    }

    const { id } = req.params;
    const { title, username, password, url, note } = req.body;

    if (!title && !username && !password && !url && !note) {
        res.status(400).send("No fields to update");
        return;
    }

    const db = Database.getInstance();

    try {
        const updateData: any = {};
        if (title) updateData.title = encrypt(title);
        if (username) updateData.username = encrypt(username);
        if (password) updateData.password = encrypt(password);
        if (url) updateData.url = encrypt(url);
        if (note) updateData.note = encrypt(note);
        updateData.updatedAt = new Date().toISOString();

        const user = await db.query("users", { username: userId });

        if (!user || !user[0]) {
            res.status(404).send("User not found");
            return;
        }

        const updatedPasswords = user[0].passwords.map((pwd: any) =>
            pwd.id === id ? { ...pwd, ...updateData } : pwd
        );

        await db.update("users", { passwords: updatedPasswords }, { username: userId });

        res.json({ message: "Password updated" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating password");
    }
};

/**
 * Deletes a password from the user's "passwords" array.
 * 
 * @param req - The Express request object, containing the password ID.
 * @param res - The Express response object.
 * @returns {Promise<void>} - Sends a response indicating whether the password was successfully deleted.
 */
export const deletePassword = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.username;
    if (!userId) {
        res.status(401).send("Unauthorized");
        return;
    }

    const { id } = req.params;

    const db = Database.getInstance();

    try {
        const user = await db.query("users", { username: userId });

        if (!user || !user[0]) {
            res.status(404).send("User not found");
            return;
        }

        const updatedPasswords = user[0].passwords.filter((pwd: any) => pwd.id !== id);

        await db.update("users", { passwords: updatedPasswords }, { username: userId });

        res.json({ message: "Password deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting password");
    }
};
