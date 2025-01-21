import { Request, Response } from "express";
import { authenticator } from "otplib";
import { Database } from "../config/db";
import { encrypt, decrypt } from "../utils/crypto";

/**
 * Enables 2FA for the user by generating and storing a secret.
 * 
 * @param req - The Express request object, containing the user ID as a parameter.
 * @param res - The Express response object.
 * @returns {Promise<void>} - Sends a response containing the status of enabling 2FA.
 */
export const enableTwoFactorAuth = async (req: Request, res: Response): Promise<void> => {
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

        const twoFactorSecret = authenticator.generateSecret();
        const encryptedSecret = encrypt(twoFactorSecret);

        await db.collection("users").updateOne({ id }, {
            $set: { twoFactorEnabled: true, twoFactorSecret: encryptedSecret }
        });

        const otpauthUrl = authenticator.keyuri(user.username, "EaglePasswords", twoFactorSecret);

        res.json({ message: "2FA enabled", otpauthUrl });
    } catch (error) {
        console.error("enableTwoFactorAuth - Error enabling 2FA:", error);
        res.status(500).send("Error enabling 2FA");
    }
};

/**
 * Verifies the 2FA code entered by the user.
 * 
 * @param req - The Express request object, containing the user ID and code as parameters.
 * @param res - The Express response object.
 * @returns {Promise<void>} - Sends a response indicating whether the 2FA code is valid.
 */
export const verifyTwoFactorCode = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { code } = req.body;
    console.log("------------------------------")
    console.log("verifyTwoFactorCode - Received request:", { id, code });

    if (!id || !code) {
        console.log("verifyTwoFactorCode - Missing id or code", { id, code });
        res.status(400).send("ID and code are required");
        return;
    }

    const db = await Database.getInstance().connect();

    try {
        console.log("verifyTwoFactorCode - Fetching user from database with id:", id);
        const user = await db.collection("users").findOne({ id });

        if (!user || !user.twoFactorEnabled) {
            console.log("verifyTwoFactorCode - User not found or 2FA not enabled:", { id });
            res.status(404).send("User not found or 2FA not enabled");
            return;
        }

        const secret = decrypt(user.twoFactorSecret);
        console.log("verifyTwoFactorCode - Decrypted 2FA secret:", secret);

        const isValid = authenticator.verify({ token: code, secret });
        console.log("verifyTwoFactorCode - 2FA code verification result:", isValid, { token: code, secret });

        if (!isValid) {
            console.log("verifyTwoFactorCode - Invalid 2FA code", { code, secret });
            res.status(400).send("Invalid 2FA code");
            return;
        }

        console.log("verifyTwoFactorCode - 2FA code verified successfully");
        res.json({ message: "2FA code verified successfully" });
    } catch (error) {
        console.error("verifyTwoFactorCode - Error verifying 2FA code:", error);
        res.status(500).send("Error verifying 2FA code");
    }
};


/**
 * Disables 2FA for the user.
 * 
 * @param req - The Express request object, containing the user ID as a parameter.
 * @param res - The Express response object.
 * @returns {Promise<void>} - Sends a response indicating whether 2FA was disabled successfully.
 */
export const disableTwoFactorAuth = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id) {
        console.log("disableTwoFactorAuth - ID is required");
        res.status(400).send("ID is required");
        return;
    }

    const db = await Database.getInstance().connect();

    try {
        console.log(`disableTwoFactorAuth - Fetching user with ID: ${id}`);
        const user = await db.collection("users").findOne({ id });

        if (!user) {
            console.log(`disableTwoFactorAuth - User with ID ${id} not found`);
            res.status(404).send("User not found");
            return;
        }

        console.log("disableTwoFactorAuth - Disabling 2FA and clearing secret");
        await db.collection("users").updateOne({ id }, {
            $set: { twoFactorEnabled: false, twoFactorSecret: "" }
        });

        console.log("disableTwoFactorAuth - 2FA disabled successfully");
        res.json({ message: "2FA disabled successfully" });
    } catch (error) {
        console.error("disableTwoFactorAuth - Error disabling 2FA:", error);
        res.status(500).send("Error disabling 2FA");
    }
};