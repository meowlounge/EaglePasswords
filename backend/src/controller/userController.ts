import { Request, Response } from "express";
import { Database } from "../config/db";
import { ObjectId } from "mongodb";

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
        const user = await db.collection("users").findOne({ _id: new ObjectId(id) });

        if (!user) {
            res.status(404).send("User not found");
            return;
        }

        res.json(user);
    } catch (error) {
        console.error("Error retrieving user by ID:", error);
        res.status(500).send("Error retrieving user");
    }
};
