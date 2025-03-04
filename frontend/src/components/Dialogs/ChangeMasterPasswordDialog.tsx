/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { toast } from 'sonner';
import {
	updateMasterPassword,
	fetchUserById,
	getUserIdFromToken,
} from '@/lib/api';
import { Input } from '../ui/Input';
import { KeyRound } from 'lucide-react';

interface Props {
	isOpen: boolean;
	onClose: () => void;
}

export const ChangeMasterPasswordDialog: React.FC<Props> = ({
	isOpen,
	onClose,
}) => {
	const [formData, setFormData] = useState({
		currentMasterPassword: '',
		newMasterPassword: '',
		confirmPassword: '',
	});
	const [loading, setLoading] = useState(false);
	const [isCreatingMasterPassword, setIsCreatingMasterPassword] =
		useState(false);

	// Fetch user data when dialog is opened
	const fetchUserData = useCallback(async () => {
		try {
			const userId = getUserIdFromToken();
			const userData = await fetchUserById(userId || '');
			setIsCreatingMasterPassword(!userData?.masterPassword);
		} catch (error) {
			toast.error('Failed to load user data.');
		}
	}, []);

	useEffect(() => {
		if (isOpen) fetchUserData();
	}, [isOpen, fetchUserData]);

	// Handle input changes
	const handleInputChange =
		(field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
			setFormData((prev) => ({ ...prev, [field]: e.target.value }));
		};

	// Handle form submission
	const handleSubmit = async () => {
		const { currentMasterPassword, newMasterPassword, confirmPassword } =
			formData;

		if (!isCreatingMasterPassword && currentMasterPassword.trim() === '') {
			toast.error('Please enter your current master password.');
			return;
		}

		if (newMasterPassword !== confirmPassword) {
			toast.error('New passwords do not match.');
			return;
		}

		try {
			setLoading(true);
			const result = await updateMasterPassword(
				currentMasterPassword,
				newMasterPassword
			);

			if (result.success) {
				toast.success(
					isCreatingMasterPassword
						? 'Master password created successfully.'
						: 'Master password changed successfully.'
				);
				onClose();
			} else {
				toast.error(
					result.message || 'Failed to update master password.'
				);
			}
		} catch (err) {
			toast.error(
				'An error occurred while updating the master password.'
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog
			isOpen={isOpen}
			onClose={onClose}
			title={
				isCreatingMasterPassword
					? 'Create Your Master Password'
					: 'Change Master Password'
			}
		>
			<div className='space-y-4'>
				{!isCreatingMasterPassword && (
					<>
						<label
							htmlFor='currentMasterPassword'
							className='block text-sm text-neutral-400 mb-1'
						>
							Current Master Password
						</label>
						<Input
							type='password'
							placeholder='Current Master Password'
							value={formData.currentMasterPassword}
							onChange={handleInputChange(
								'currentMasterPassword'
							)}
							icon={KeyRound}
						/>
					</>
				)}
				<label
					htmlFor='newMasterPassword'
					className='block text-sm text-neutral-400 mb-1'
				>
					{isCreatingMasterPassword
						? 'Master Password'
						: 'New Master Password'}
				</label>
				<Input
					type='password'
					placeholder={
						isCreatingMasterPassword
							? 'Master Password'
							: 'New Master Password'
					}
					value={formData.newMasterPassword}
					onChange={handleInputChange('newMasterPassword')}
					icon={KeyRound}
				/>
				<label
					htmlFor='confirmPassword'
					className='block text-sm text-neutral-400 mb-1'
				>
					Confirm Password
				</label>
				<Input
					type='password'
					placeholder='Confirm Password'
					value={formData.confirmPassword}
					onChange={handleInputChange('confirmPassword')}
					icon={KeyRound}
				/>
				<Button
					content={
						isCreatingMasterPassword
							? 'Create Password'
							: 'Change Password'
					}
					onClick={handleSubmit}
					disabled={loading}
					className='w-full'
				/>
			</div>
		</Dialog>
	);
};
