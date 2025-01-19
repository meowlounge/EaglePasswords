import crypto from "crypto";

const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY || SECRET_KEY.length !== 64) {
    throw new Error("SECRET_KEY must be a 64-character string.");
}

const keyBuffer = Buffer.from(SECRET_KEY, "hex");
const ALGORITHM = "aes-256-cbc";

/**
 * Encrypts any given data using AES-256-CBC encryption.
 * 
 * @param {string} data - The data to encrypt.
 * @returns {string} The encrypted data in the format `iv:encryptedData`.
 */
export const encrypt = (data: string): string => {
    try {
        const iv = crypto.randomBytes(16);

        const cipher = crypto.createCipheriv(ALGORITHM, keyBuffer, iv);
        const encrypted = Buffer.concat([cipher.update(data, "utf-8"), cipher.final()]);
        return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
    } catch (error) {
        console.error("Error encrypting data:", error);
        throw new Error("Failed to encrypt the data.");
    }
};

/**
 * Decrypts the encrypted data back to its original form.
 * 
 * @param {string} encryptedData - The encrypted data in the format `iv:encryptedData`.
 * @returns {string} The decrypted original data.
 */
export const decrypt = (encryptedData: string): string => {
    try {
        if (!encryptedData.includes(":")) {
            console.warn("No colon found in the encrypted data, returning as is.");
            return encryptedData;
        }

        const [ivHex, encrypted] = encryptedData.split(":");
        if (!ivHex || !encrypted) {
            throw new Error("Invalid encrypted data format.");
        }

        const iv = Buffer.from(ivHex, "hex");
        if (iv.length !== 16) {
            throw new Error("IV length is incorrect. It should be 16 bytes.");
        }

        const decipher = crypto.createDecipheriv(ALGORITHM, keyBuffer, iv);
        const decrypted = Buffer.concat([decipher.update(Buffer.from(encrypted, "hex")), decipher.final()]);
        return decrypted.toString("utf-8");
    } catch (error) {
        console.error("Error decrypting data:", error);
        throw new Error("Failed to decrypt the data.");
    }
};