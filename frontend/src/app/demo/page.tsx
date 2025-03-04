'use client';

import React, { useState } from 'react';
import { PasswordCard } from '@/components/Password/PasswordCard';
import { Rainbow } from 'lucide-react';
import { Password } from '@/types';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Spinner } from '@/components/ui/Spinner';
import { TimeStamp } from '@/components/ui/Timestamp';
import { UserAvatar } from '@/components/ui/UserAvatar';
import Navbar from '@/components/Navbar';

const DemoPage = () => {
	const [showPassword, setShowPassword] = useState<Record<string, boolean>>(
		{}
	);
	const [showUsername, setShowUsername] = useState<Record<string, boolean>>(
		{}
	);
	const [isOpen, setIsOpen] = useState(false);
	const [selected, setSelected] = useState<string>('option1');
	const [clickCount, setClickCount] = useState(0);

	const handleClick = () => {
		setClickCount((prevCount) => prevCount + 1);
		toast.info(`Clicked: ${clickCount + 1}x Times`);
	};

	const handleEdit = (password: Password) => {
		toast.success(`Edit password: ${password.title}`, {
			id: `edit-${Date.now()}`,
		});
	};

	const handleFavorite = (password: Password) => {
		toast.success(`Toggle favorite for: ${password.title}`, {
			id: `favorite-${Date.now()}`,
		});
	};

	const handleDelete = (password: Password) => {
		toast.success(`Delete password: ${password.title}`, {
			id: `delete-${Date.now()}`,
		});
	};

	const handleSelectChange = (value: string) => {
		setSelected(value);
		toast.info(`Selected: ${value}`, {
			id: `select-${Date.now()}`,
		});
	};

	const mockPassword: Password = {
		id: '1',
		title: 'Test Password',
		username: 'user@example.com',
		password: 'password123',
		url: 'example.com',
		note: 'A test password for demonstration purposes.',
		isFavorite: false,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	};

	// Dialog functions
	const openDialog = () => setIsOpen(true);
	const closeDialog = () => setIsOpen(false);

	return (
		<main className='p-8 mt-16'>
			<Navbar />
			<div className='max-w-screen-lg mx-auto px-4'>
				<h1 className='text-3xl font-semibold dark:text-neutral-100 text-neutral-800 mb-8'>
					Demo Page - UI Testing
				</h1>

				{/* Password Card */}
				<section className='mb-12'>
					<h2 className='text-2xl font-semibold dark:text-neutral-100 text-neutral-800 mb-4'>
						Password Card
					</h2>
					<PasswordCard
						password={mockPassword}
						showPassword={showPassword}
						setShowPassword={setShowPassword}
						showUsername={showUsername}
						setshowUsername={setShowUsername}
						handleEdit={handleEdit}
						handleFavorite={handleFavorite}
						handleDelete={handleDelete}
					/>
				</section>

				{/* Button Variants */}
				<section className='mb-12'>
					<h2 className='text-2xl font-semibold dark:text-neutral-100 text-neutral-800 mb-4'>
						Button Variants
					</h2>
					<div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
						<Button content='Button' onClick={openDialog} />
						<Button icon={Rainbow} onClick={openDialog} />
						<Button
							icon={Rainbow}
							content='Button with Icon'
							variant='secondary'
							onClick={openDialog}
						/>
						<Button
							content='(Ghost)'
							variant='ghost'
							onClick={openDialog}
						/>
						<Button
							content='(Border)'
							variant='border'
							onClick={openDialog}
						/>
						<Button
							content='(Danger)'
							variant='danger'
							onClick={openDialog}
						/>
						<Button content='(Disabled)' disabled />
						<Button content='(Loading)' loading />
					</div>
				</section>

				<section className='mb-12'>
					<Dialog
						isOpen={isOpen}
						onClose={closeDialog}
						title='Demo Dialog'
					>
						<div className='space-y-6 dark:text-neutral-100 text-neutral-800'>
							<p className='text-lg'>
								This is a demo dialog. You can add content here.
								For example, a button:
							</p>
							<div className='flex justify-center'>
								<Button
									content='Click me'
									onClick={handleClick}
									className='mb-4'
								/>
							</div>
							<p className='text-lg'>
								Or you can display a timestamp, like this:
							</p>
							<div>
								<TimeStamp timestamp={mockPassword.createdAt} />
							</div>
						</div>
					</Dialog>
				</section>

				{/* Input Component */}
				<section className='mb-12'>
					<h2 className='text-2xl font-semibold dark:text-neutral-100 text-neutral-800 mb-4'>
						Input Components
					</h2>
					<div className='space-y-4'>
						<Input
							label='Search'
							icon={Rainbow}
							placeholder='Input with Label'
						/>
						<Input
							disabled
							icon={Rainbow}
							placeholder='Disabled Input'
						/>
						<Input
							icon={Rainbow}
							placeholder='Error Input'
							error='Invalid email address'
						/>
					</div>
				</section>

				{/* Select Component */}
				<section className='mb-12'>
					<h2 className='text-2xl font-semibold dark:text-neutral-100 text-neutral-800 mb-4'>
						Select Component
					</h2>
					<Select
						value={selected}
						onChange={(e) => handleSelectChange(e)}
						options={Array.from({ length: 250 }, (_, index) => ({
							value: `option${index + 1}`,
							label: `Option ${index + 1}`,
						}))}
					/>
				</section>

				{/* Spinner */}
				<section className='mb-12'>
					<h2 className='text-2xl font-semibold dark:text-neutral-100 text-neutral-800 mb-4'>
						Spinner Component
					</h2>
					<Spinner size='w-8 h-8' speed='0.5s' />
				</section>

				{/* Timestamp Component */}
				<section className='mb-12'>
					<h2 className='text-2xl font-semibold dark:text-neutral-100 text-neutral-800 mb-4'>
						Timestamp Component
					</h2>
					<TimeStamp timestamp={mockPassword.createdAt} />
				</section>

				{/* User Avatar */}
				<section>
					<h2 className='text-2xl font-semibold dark:text-neutral-100 text-neutral-800 mb-4'>
						User Avatar Component
					</h2>
					<UserAvatar
						avatar='a_0e48ec466029664d674e5b3371d7c943'
						username='prodbyeagle'
						id='893759402832699392'
						size='lg'
						quality={64}
					/>
				</section>
			</div>
		</main>
	);
};

export default DemoPage;
