import { Password } from '@/types';

// lib/csvParser.ts
export const parseCSV = (file: File): Promise<Password[]> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (event) => {
			const text = event.target?.result as string;
			const rows = text.split('\n').map((row) => row.split(','));
			const passwords = rows.map((row) => ({
				id: '',
				title: row[0],
				username: row[1],
				password: row[2],
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			}));
			resolve(passwords);
		};
		reader.onerror = (error) => reject(error);
		reader.readAsText(file);
	});
};
