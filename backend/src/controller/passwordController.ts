import { Request, Response } from 'express';
import { decrypt, encrypt } from '../utils/crypto';
import { Database } from '../config/db';
import { Password } from '../types';
import { ulid } from 'ulid';

/**
 * Retrieves all stored passwords from the user's "passwords" array and decrypts them.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @returns {Promise<void>} - Sends a response containing the decrypted passwords.
 */
export const getPasswords = async (
	req: Request,
	res: Response
): Promise<void> => {
	const userId = req.user?.id;
	const db = Database.getInstance();

	if (!userId) {
		res.status(403).send('Unauthorized');
		return;
	}

	try {
		const user = await db.query('users', { id: userId });

		if (!user || !user[0]?.passwords) {
			res.status(410).send('No passwords found');
			return;
		}

		const passwords = user[0].passwords.map((pwd: any) => ({
			...pwd,
			title: decrypt(pwd.title),
			username: decrypt(pwd.username),
			password: decrypt(pwd.password),
			url: decrypt(pwd.url || ''),
			note: decrypt(pwd.note || ''),
			isFavorite: pwd.isFavorite || false,
		}));

		res.json(passwords);
	} catch (error) {
		console.error('Error retrieving passwords:', error);
		res.status(500).send('Error retrieving passwords');
	}
};

/**
 * Adds a new password to the user's "passwords" array after encrypting it.
 *
 * @param req - The Express request object, containing the password details.
 * @param res - The Express response object.
 * @returns {Promise<void>} - Sends a response indicating whether the password was successfully added.
 */
export const addPassword = async (
	req: Request,
	res: Response
): Promise<void> => {
	const userId = req.user?.username;
	if (!userId) {
		console.log('Unauthorized access attempt');
		res.status(401).send('Unauthorized');
		return;
	}

	const { title, username, password, url, note } = req.body;

	if (!title || !username || !password) {
		console.log('Missing required fields', { title, username, password });
		res.status(400).send('Missing required fields');
		return;
	}

	const db = Database.getInstance();

	try {
		console.log('Encrypting password data...');
		const newPassword: Password = {
			id: ulid(),
			title: encrypt(title),
			username: encrypt(username),
			password: encrypt(password),
			url: encrypt(url || '') || undefined,
			note: encrypt(note || '') || undefined,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			isFavorite: false,
		};

		console.log('New password object created:', newPassword);

		const user = await db.query('users', { username: userId });

		if (!user || !user[0]) {
			console.log('User not found:', userId);
			res.status(404).send('User not found');
			return;
		}

		console.log('User found, updating passwords...');
		const updatedPasswords = [...user[0].passwords, newPassword];

		console.log('Updated passwords array:', updatedPasswords);

		await db.update(
			'users',
			{ passwords: updatedPasswords },
			{ username: userId }
		);

		console.log('Password successfully added to the database');
		res.status(201).json({
			message: 'Password added',
			password: newPassword,
		});
	} catch (error) {
		console.error('Error adding password:', error);
		res.status(500).send('Error adding password');
	}
};

/**
 * Updates an existing password in the user's "passwords" array.
 *
 * @param req - The Express request object, containing the password ID and updated fields.
 * @param res - The Express response object.
 * @returns {Promise<void>} - Sends a response indicating whether the password was successfully updated.
 */
export const updatePassword = async (
	req: Request,
	res: Response
): Promise<void> => {
	const userId = req.user?.username;
	if (!userId) {
		console.log('Unauthorized access attempt: No user ID found');
		res.status(401).send('Unauthorized');
		return;
	}

	const { id } = req.params;
	const { title, username, password, url, note, isFavorite } = req.body;

	console.log(`Request to update password with ID: ${id}`);
	console.log('Request Body:', req.body);

	if (
		!title &&
		!username &&
		!password &&
		!url &&
		!note &&
		isFavorite === undefined
	) {
		console.log('No fields to update');
		res.status(400).send('No fields to update');
		return;
	}

	const db = Database.getInstance();

	try {
		const user = await db.query('users', { username: userId });

		if (!user || !user[0]) {
			console.log(`User not found: ${userId}`);
			res.status(404).send('User not found');
			return;
		}

		const targetPassword = user[0].passwords.find(
			(pwd: any) => pwd.id === id
		);

		if (!targetPassword) {
			console.log(`Password with ID ${id} not found for user ${userId}`);
			res.status(404).send('Password not found');
			return;
		}

		console.log('Original Password Entry:', targetPassword);

		const updateData: any = {};
		if (title) updateData.title = encrypt(title);
		if (username) updateData.username = encrypt(username);
		if (password) updateData.password = encrypt(password);
		if (url) updateData.url = encrypt(url);
		if (note) updateData.note = encrypt(note);

		if (isFavorite !== undefined) {
			updateData.isFavorite =
				isFavorite === null ? !targetPassword.isFavorite : isFavorite;
		}

		updateData.updatedAt = new Date().toISOString();

		console.log('Update Data:', updateData);

		const updatedPasswords = user[0].passwords.map((pwd: any) =>
			pwd.id === id ? { ...pwd, ...updateData } : pwd
		);

		console.log('Updated Passwords:', updatedPasswords);

		await db.update(
			'users',
			{ passwords: updatedPasswords },
			{ username: userId }
		);

		console.log(`Password with ID ${id} successfully updated`);
		res.json({ message: 'Password updated' });
	} catch (error) {
		console.error('Error updating password:', error);
		res.status(500).send('Error updating password');
	}
};

/**
 * Deletes a password from the user's "passwords" array.
 *
 * @param req - The Express request object, containing the password ID.
 * @param res - The Express response object.
 * @returns {Promise<void>} - Sends a response indicating whether the password was successfully deleted.
 */
export const deletePassword = async (
	req: Request,
	res: Response
): Promise<void> => {
	const userId = req.user?.username;
	if (!userId) {
		res.status(401).send('Unauthorized');
		return;
	}

	const { id } = req.params;

	const db = Database.getInstance();

	try {
		const user = await db.query('users', { username: userId });

		if (!user || !user[0]) {
			res.status(404).send('User not found');
			return;
		}

		const updatedPasswords = user[0].passwords.filter(
			(pwd: any) => pwd.id !== id
		);

		await db.update(
			'users',
			{ passwords: updatedPasswords },
			{ username: userId }
		);

		res.json({ message: 'Password deleted' });
	} catch (error) {
		console.error(error);
		res.status(500).send('Error deleting password');
	}
};
