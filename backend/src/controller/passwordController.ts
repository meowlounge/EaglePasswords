import { Request, Response } from "express";
import { decrypt, encrypt } from "../utils/crypto";
import { Database } from "../config/db";
import { Password } from "../types";
import { ulid } from "ulid";

const getUserPasswordsCollection = (username: string, db: any) => db.collection(`passwords_${username}`);

/**
 * Retrieves all stored passwords from the database and decrypts them.
 * Ensures the "passwords" collection exists before querying it.
 * 
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @returns {Promise<void>} - Sends a response containing the decrypted passwords.
 */
export const getPasswords = async (req: Request, res: Response): Promise<void> => {
    const username = req.user?.username;
    const db = await Database.getInstance().connect();

    if (!username) {
        res.status(403).send("Unauthorized");
        return;
    }

    try {
        const userPasswordsCollection = getUserPasswordsCollection(username, db);

        const passwords = await userPasswordsCollection.find({}).toArray();

        res.json(passwords.map((pwd: any) => ({
            ...pwd,
            title: decrypt(pwd.title),
            username: decrypt(pwd.username),
            password: decrypt(pwd.password),
            url: decrypt(pwd.url || ""),
            note: decrypt(pwd.note || "")
        })));
    } catch (error) {
        console.error("Error retrieving passwords:", error);
        res.status(500).send("Error retrieving passwords");
    }
};

/**
 * Adds a new password to the database after encrypting it.
 * 
 * @param req - The Express request object, containing the password details.
 * @param res - The Express response object.
 * @returns {Promise<void>} - Sends a response indicating whether the password was successfully added.
 */
export const addPassword = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.username; // Assuming user ID is attached to `req.user`
    if (!userId) {
        res.status(401).send("Unauthorized");
        return;
    }

    const { title, username, password, url, note } = req.body;

    if (!title || !username || !password) {
        res.status(400).send("Missing required fields");
        return;
    }

    const db = await Database.getInstance().connect();

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

        const userPasswordsCollection = getUserPasswordsCollection(userId, db);
        const result = await userPasswordsCollection.insertOne(newPassword);

        newPassword.id = result.insertedId.toString();

        res.status(201).json({ message: "Password added", password: newPassword });
    } catch (error) {
        console.error("Error adding password:", error);
        res.status(500).send("Error adding password");
    }
};


/**
 * Updates an existing password in the database.
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

    const db = await Database.getInstance().connect();

    try {
        const updateData: any = {};
        if (title) updateData.title = title;
        if (username) updateData.username = username;
        if (password) updateData.password = encrypt(password);
        if (url) updateData.url = url;
        if (note) updateData.note = note;
        updateData.updatedAt = new Date().toISOString();

        const userPasswordsCollection = getUserPasswordsCollection(userId, db);
        const result = await userPasswordsCollection.updateOne(
            { id },
            { $set: updateData }
        );

        if (result.modifiedCount === 0) {
            res.status(404).send("Password not found");
            return;
        }

        res.json({ message: "Password updated" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating password");
    }
};

/**
 * Deletes a password from the database.
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

    const db = await Database.getInstance().connect();

    try {
        const userPasswordsCollection = getUserPasswordsCollection(userId, db);
        const result = await userPasswordsCollection.deleteOne({ id });

        if (result.deletedCount === 0) {
            res.status(404).send("Password not found");
            return;
        }

        res.json({ message: "Password deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting password");
    }
};