/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { RefreshCcw } from 'lucide-react';
import { getBaseApiUrl, fetchUserById } from '@/lib/api';
import { User } from '@/types';

const DiscordCallback = () => {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const fetchToken = async () => {
			try {
				const token =
					new URLSearchParams(window.location.search).get('token') ||
					null;
				if (!token) {
					setError('Kein Authentifizierungstoken vorhanden.');
					return;
				}

				document.cookie = `eagletoken=${token}; Expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/; secure; SameSite=Strict`;

				const userData = await fetchUserById(token);
				setUser(userData);
				router.push('/');
			} catch (error) {
				setError(
					'Fehler beim Verarbeiten des Tokens. Bitte versuchen Sie es erneut.'
				);
			}
		};

		fetchToken();
	}, [router]);

	if (error) {
		return (
			<div className='flex h-screen items-center justify-center bg-neutral-900 text-center p-4'>
				<div className='w-full max-w-md bg-neutral-800 p-8 rounded-xl shadow-lg border border-neutral-600'>
					<h2 className='text-3xl font-bold text-red-500 mb-4'>
						Fehler!
					</h2>
					<p className='text-neutral-300 mb-6'>{error}</p>
					<Button
						onClick={() =>
							(window.location.href = `${getBaseApiUrl()}/api/auth`)
						}
						variant='danger'
						className='w-full'
						icon={RefreshCcw}
						content='Erneut Anmelden'
					></Button>
				</div>
			</div>
		);
	}

	return (
		<div className='flex h-screen items-center justify-center bg-neutral-900 text-center p-4'>
			<div className='w-full max-w-md bg-neutral-800 p-8 rounded-xl shadow-lg border border-neutral-600'>
				<h2 className='text-3xl font-bold text-neutral-100 mb-4'>
					Authentifizierung wird verarbeitet...
				</h2>
				<h1>Welcome {user?.username}</h1>
				<Spinner className='h-12 w-12 text-neutral-500 mx-auto mb-6' />
				<p className='text-neutral-300'>
					Bitte warten Sie einen Moment...
				</p>
			</div>
		</div>
	);
};

export default DiscordCallback;
