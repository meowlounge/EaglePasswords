'use client';

import { useHomePageLogic } from '@/hooks/useHomePage';
import { Button } from '@/components/ui/Button';
import { DeleteDialog } from '@/components/Dialogs/DeleteDialog';
import { LoginPrompt } from '@/components/LoginPrompt';
import { PasswordDialog } from '@/components/Dialogs/PasswordDialog';
import { SearchBar } from '@/components/ui/SearchBar';
import { PasswordList } from '@/components/Password/PasswordList';
import Navbar from '@/components/Navbar';

const HomePage = () => {
	const {
		loading,
		error,
		isLoggedIn,
		sortedPasswords,
		isDialogOpen,
		setIsDialogOpen,
		setSearchTerm,
		setSortOptions,
		handleEdit,
		handleDelete,
		handleFavorite,
		handleCloseDialog,
		handleAddOrUpdatePassword,
		isDeleteDialogOpen,
		setIsDeleteDialogOpen,
		selectedPassword,
		showPassword,
		setShowPassword,
		showUsername,
		setshowUsername,
		searchTerm,
		setSelectedPassword,
		newPassword,
		setNewPassword,
		sortOptions,
	} = useHomePageLogic();

	if (!isLoggedIn) {
		return <LoginPrompt />;
	}

	const favoritePasswords = sortedPasswords.filter(
		(password) => password.isFavorite
	);
	const normalPasswords = sortedPasswords.filter(
		(password) => !password.isFavorite
	);

	return (
		<div className='min-h-screen bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 mt-16'>
			<Navbar />
			<main className='container mx-auto'>
				<SearchBar
					searchTerm={searchTerm}
					setSearchTerm={setSearchTerm}
					sortOptions={sortOptions}
					setSortOptions={setSortOptions}
					setIsDialogOpen={setIsDialogOpen}
				/>

				{loading ? (
					<div className='bg-red-900/20 border border-red-800 text-red-400 p-4 rounded-lg'>
						{error}
					</div>
				) : error ? (
					<div className='bg-red-900/20 border border-red-800 text-red-400 p-4 rounded-lg'>
						{error}
					</div>
				) : (
					<>
						{favoritePasswords.length > 0 && (
							<div className='mb-8 border-b border-neutral-300 transition-all duration-300 dark:border-neutral-600/50'>
								<PasswordList
									passwords={favoritePasswords}
									showPassword={showPassword}
									setShowPassword={setShowPassword}
									showUsername={showUsername}
									setshowUsername={setshowUsername}
									handleEdit={handleEdit}
									handleFavorite={handleFavorite}
									handleDelete={(password) => {
										setSelectedPassword(password);
										setIsDeleteDialogOpen(true);
									}}
								/>
							</div>
						)}

						{normalPasswords.length > 0 ? (
							<PasswordList
								passwords={normalPasswords}
								showPassword={showPassword}
								setShowPassword={setShowPassword}
								showUsername={showUsername}
								setshowUsername={setshowUsername}
								handleEdit={handleEdit}
								handleFavorite={handleFavorite}
								handleDelete={(password) => {
									setSelectedPassword(password);
									setIsDeleteDialogOpen(true);
								}}
							/>
						) : (
							<div className='text-center py-12'>
								<div className='text-neutral-400 mb-2'>
									No passwords found
								</div>
								<Button onClick={() => setIsDialogOpen(true)}>
									Add your first password
								</Button>
							</div>
						)}
					</>
				)}
			</main>

			<PasswordDialog
				isOpen={isDialogOpen}
				onClose={handleCloseDialog}
				onSubmit={handleAddOrUpdatePassword}
				newPassword={newPassword}
				setNewPassword={(value) =>
					setNewPassword((prev) => ({ ...prev, ...value }))
				}
				selectedPassword={selectedPassword}
			/>

			<DeleteDialog
				isOpen={isDeleteDialogOpen}
				onClose={() => setIsDeleteDialogOpen(false)}
				onConfirm={handleDelete}
				itemName={selectedPassword?.title}
				itemType='Password'
			/>
		</div>
	);
};

export default HomePage;
