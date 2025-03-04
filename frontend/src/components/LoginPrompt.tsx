import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { LogInIcon } from 'lucide-react';
import { getBaseApiUrl } from '@/lib/api';

export const LoginPrompt: React.FC = () => {
	const loginUrl = `${getBaseApiUrl()}/api/auth`;

	return (
		<div className='flex bg-neutral-900 items-center justify-center p-8 min-h-screen'>
			<div className='w-full max-w-md bg-neutral-800 rounded-2xl p-8 shadow-xl border border-neutral-700/50'>
				<div className='text-center space-y-3 mb-8'>
					<h1 className='text-2xl font-bold text-neutral-100'>
						Willkommen zurück!
					</h1>
					<p className='text-neutral-400'>
						Melde dich an, um die Plattform zu nutzen.
					</p>
				</div>

				<Link href={loginUrl}>
					<Button
						size='lg'
						className='w-full'
						content='Anmelden'
						icon={LogInIcon}
						variant='secondary'
					></Button>
				</Link>
			</div>
		</div>
	);
};
