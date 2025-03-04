import { Pen, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { useState } from 'react';

interface DeleteAccountDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	itemName?: string;
	itemType?: string;
}

export const DeleteAccountDialog: React.FC<DeleteAccountDialogProps> = ({
	isOpen,
	onClose,
	onConfirm,
	itemName,
	itemType = 'item',
}) => {
	const [confirmationText, setConfirmationText] = useState('');

	const handleDelete = () => {
		if (confirmationText.trim().toUpperCase() === 'DELETE') {
			onConfirm();
			setConfirmationText('');
		}
	};

	return (
		<Dialog isOpen={isOpen} onClose={onClose} title={`Delete ${itemType}`}>
			<div className='space-y-6'>
				<p className='text-neutral-600 dark:text-neutral-400'>
					This action cannot be undone. This will permanently delete
					{itemName
						? ` the ${itemType} "${itemName}"`
						: ` this ${itemType} `}
					and remove its data from our servers.
				</p>
				<Input
					icon={Pen}
					type='text'
					placeholder="Type 'DELETE' to confirm"
					value={confirmationText}
					onChange={(e) => setConfirmationText(e.target.value)}
				/>
				<div className='flex justify-end gap-3'>
					<Button
						onClick={handleDelete}
						className='w-full'
						variant='danger'
						disabled={confirmationText.trim() !== 'DELETE'}
						icon={Trash2}
					>
						Delete {itemType}
					</Button>
				</div>
			</div>
		</Dialog>
	);
};
