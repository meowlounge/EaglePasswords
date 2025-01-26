import crypto from 'crypto';

const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
	throw new Error('SECRET_KEY is required.');
}

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 12;

const keyBuffer = crypto.scryptSync(SECRET_KEY, 'salt', KEY_LENGTH);

/**
 * Encrypts any given data using AES-256-GCM encryption.
 *
 * @param {string} data - The data to encrypt.
 * @returns {string} The encrypted data in the format `iv:encryptedData:tag`.
 */
export const encrypt = (data: string): string => {
	try {
		const iv = crypto.randomBytes(IV_LENGTH);

		const cipher = crypto.createCipheriv(ALGORITHM, keyBuffer, iv);
		const encrypted = Buffer.concat([
			cipher.update(data, 'utf-8'),
			cipher.final(),
		]);
		const tag = cipher.getAuthTag();

		return `${iv.toString('hex')}:${encrypted.toString('hex')}:${tag.toString('hex')}`;
	} catch (error) {
		console.error('Encryption failed:', error);
		throw new Error('Encryption failed.');
	}
};

/**
 * Decrypts the encrypted data back to its original form.
 *
 * @param {string} encryptedData - The encrypted data in the format `iv:encryptedData:tag`.
 * @returns {string} The decrypted original data.
 */
export const decrypt = (encryptedData: string): string => {
	try {
		const [ivHex, encrypted, tagHex] = encryptedData.split(':');
		if (!ivHex || !encrypted || !tagHex) {
			throw new Error('Invalid encrypted data format.');
		}

		const iv = Buffer.from(ivHex, 'hex');
		const tag = Buffer.from(tagHex, 'hex');

		if (iv.length !== IV_LENGTH) {
			throw new Error('Invalid IV length. It should be 12 bytes.');
		}

		const decipher = crypto.createDecipheriv(ALGORITHM, keyBuffer, iv);
		decipher.setAuthTag(tag);

		const decrypted = Buffer.concat([
			decipher.update(Buffer.from(encrypted, 'hex')),
			decipher.final(),
		]);
		return decrypted.toString('utf-8');
	} catch (error) {
		console.error('Decryption failed:', error);
		throw new Error('Decryption failed.');
	}
};
