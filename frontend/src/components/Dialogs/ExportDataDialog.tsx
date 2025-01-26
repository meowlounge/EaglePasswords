import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import Papa from 'papaparse';
import { Password } from '@/types';
import { Select } from '../ui/Select';

/**
 * DataExporter is a component that allows exporting password data
 * in either JSON or CSV format.
 *
 * @param {boolean} isOpen - Determines if the dialog is open.
 * @param {() => void} onClose - Callback to close the dialog.
 * @param {Password[]} passwords - Array of password data to be exported.
 * @returns JSX.Element
 */
export const DataExporter = ({
	isOpen,
	onClose,
	passwords,
}: {
	isOpen: boolean;
	onClose: () => void;
	passwords: Password[];
}) => {
	const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');
	const [error, setError] = useState<string | null>(null);

	/**
	 * Handles exporting passwords in the selected format (CSV or JSON).
	 */
	const handleExport = () => {
		try {
			if (exportFormat === 'csv') {
				const csvData = Papa.unparse(
					passwords.map((password) => ({
						Name: password.title,
						Website: password.url,
						Username: password.username,
						Password: password.password,
						Notes: password.note,
						CreatedAt: password.createdAt,
						UpdatedAt: password.updatedAt,
					}))
				);

				const blob = new Blob([csvData], { type: 'text/csv' });
				const link = document.createElement('a');
				link.href = URL.createObjectURL(blob);
				link.download = 'passwords.csv';
				link.click();
			} else if (exportFormat === 'json') {
				const jsonData = JSON.stringify(passwords, null, 2);
				const blob = new Blob([jsonData], {
					type: 'application/json',
				});
				const link = document.createElement('a');
				link.href = URL.createObjectURL(blob);
				link.download = 'passwords.json';
				link.click();
			}

			onClose();
		} catch (err) {
			setError('Failed to export data. Please try again.');
			console.error('Error exporting data:', err);
		}
	};

	return (
		<Dialog isOpen={isOpen} onClose={onClose} title='Export Passwords'>
			<div className='space-y-4'>
				<div>
					<label className='block text-sm text-neutral-700 dark:text-neutral-100'>
						Choose Export Format
					</label>
					<Select
						value={exportFormat}
						onChange={(value) =>
							setExportFormat(value as 'csv' | 'json')
						}
						options={[
							{ value: 'csv', label: 'CSV' },
							{ value: 'json', label: 'JSON' },
						]}
						className='mt-2'
					/>
				</div>

				{error && <div className='text-red-500 text-sm'>{error}</div>}

				<div className='flex justify-end space-x-2 pt-4'>
					<Button
						onClick={handleExport}
					>{`Export as ${exportFormat.toUpperCase()}`}</Button>
				</div>
			</div>
		</Dialog>
	);
};
