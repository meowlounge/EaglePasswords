import { Request, Response } from "express";
import { Database } from "../config/db";
import { decrypt, encrypt } from "../utils/crypto";
import type { User } from "../types";

/**
 * Retrieves a user by their username from the database.
 * 
 * @param req - The Express request object, containing the username as a parameter.
 * @param res - The Express response object.
 * @returns {Promise<void>} - Sends a response containing the user details if found, or an error message.
 */
export const getUserByUsername = async (req: Request, res: Response): Promise<void> => {
    const { username } = req.params;

    if (!username) {
        res.status(400).send("Username is required");
        return;
    }

    const db = await Database.getInstance().connect();

    try {
        const user = await db.collection("users").findOne({ username });

        if (!user) {
            res.status(404).send("User not found");
            return;
        }

        if (user.twoFactorSecret) {
            user.twoFactorSecret = decrypt(user.twoFactorSecret);
        }

        res.json(user);
    } catch (error) {
        console.error("Error retrieving user by username:", error);
        res.status(500).send("Error retrieving user");
    }
};

/**
 * Retrieves a user by their ID from the database.
 * 
 * @param req - The Express request object, containing the user ID as a parameter.
 * @param res - The Express response object.
 * @returns {Promise<void>} - Sends a response containing the user details if found, or an error message.
 */
export const getUserById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id) {
        res.status(400).send("ID is required");
        return;
    }

    const db = await Database.getInstance().connect();

    try {
        const user = await db.collection("users").findOne({ id });

        if (!user) {
            res.status(404).send("User not found");
            return;
        }

        if (user.twoFactorSecret) {
            user.twoFactorSecret = decrypt(user.twoFactorSecret);
        }

        res.json(user);
    } catch (error) {
        console.error("Error retrieving user by ID:", error);
        res.status(500).send("Error retrieving user");
    }
};

/**
 * Deletes a user by their ID from the database.
 * 
 * @param req - The Express request object, containing the user ID as a parameter.
 * @param res - The Express response object.
 * @returns {Promise<void>} - Sends a response indicating the success or failure of the deletion.
 */
export const deleteUserById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id) {
        res.status(400).send("ID is required");
        return;
    }

    const db = await Database.getInstance().connect();

    try {
        const result = await db.collection("users").deleteOne({ id });

        if (result.deletedCount === 0) {
            res.status(404).send("User not found");
            return;
        }

        res.status(200).send("User deleted successfully");
    } catch (error) {
        console.error("Error deleting user by ID:", error);
        res.status(500).send("Error deleting user");
    }
};

/**
 * Updates a user's information dynamically based on the `User` type.
 * Handles specific cases like updating the master password and two-factor authentication secret.
 *
 * @param req - The Express request object, containing the user ID in params and fields to update in the body.
 * @param res - The Express response object.
 */
export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const updates: Partial<User> = req.body;

    if (!id) {
        res.status(400).json({ message: "User ID is required." });
        return;
    }

    if (!updates || Object.keys(updates).length === 0) {
        res.status(400).json({ message: "No valid fields to update." });
        return;
    }

    const db = await Database.getInstance().connect();

    try {
        const user = await db.collection<User>("users").findOne({ id });
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }

        if (updates.twoFactorSecret) {
            updates.twoFactorSecret = encrypt(updates.twoFactorSecret);
        }

        if (updates.masterPassword) {
            updates.twoFactorSecret = encrypt(updates.masterPassword);
        }

        if (updates.passwords) {
            res.status(400).json({ message: "Passwords cannot be updated directly through this endpoint." });
            return;
        }

        const result = await db.collection<User>("users").updateOne({ id }, { $set: updates });

        if (result.matchedCount === 0) {
            res.status(404).json({ message: "User not found." });
            return;
        }

        res.status(200).json({ message: "User updated successfully." });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "An error occurred while updating the user." });
    }
};
