import { Button } from '@/components/ui/Button';
import { ChevronUp, ChevronDown, Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

interface SearchBarProps {
	searchTerm: string;
	setSearchTerm: (value: string) => void;
	setIsDialogOpen: (value: boolean) => void;
	sortOptions: {
		field: 'title' | 'username' | 'createdAt' | 'updatedAt' | 'strength';
		order: 'asc' | 'desc';
	};
	setSortOptions: (options: {
		field: 'title' | 'username' | 'createdAt' | 'updatedAt' | 'strength';
		order: 'asc' | 'desc';
	}) => void;
}

export const SearchBar = ({
	searchTerm,
	setSearchTerm,
	sortOptions,
	setSortOptions,
	setIsDialogOpen,
}: SearchBarProps) => {
	const toggleSortOrder = () => {
		setSortOptions({
			...sortOptions,
			order: sortOptions.order === 'asc' ? 'desc' : 'asc',
		});
	};

	return (
		<div className='flex space-x-2 pt-4 px-4'>
			<Button
				onClick={() => setIsDialogOpen(true)}
				icon={Plus}
				variant='border'
			/>
			<Input
				type='search'
				placeholder='Search passwords...'
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				icon={Search}
				className='w-full'
			/>
			<Select
				value={sortOptions.field}
				onChange={(field) => setSortOptions({ ...sortOptions, field })}
				options={[
					{ value: 'title', label: 'Title' },
					{ value: 'username', label: 'Username' },
					{ value: 'createdAt', label: 'Created At' },
					{ value: 'updatedAt', label: 'Updated At' },
					{ value: 'strength', label: 'Strength' },
				]}
				className='w-48'
			/>
			<Button
				icon={sortOptions.order === 'asc' ? ChevronUp : ChevronDown}
				onClick={toggleSortOrder}
				variant='border'
			/>
		</div>
	);
};
