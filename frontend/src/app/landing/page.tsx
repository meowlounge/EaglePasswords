'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import { Lock, Key, Shield } from 'lucide-react';

const SwissLandingPage = () => {
	return (
		<main className='min-h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 font-sans'>
			{/* Header */}
			<header className='py-6 border-b border-neutral-200 dark:border-neutral-800'>
				<div className='max-w-7xl mx-auto flex items-center justify-between px-6'>
					<h1 className='text-xl font-bold uppercase tracking-wide'>
						EaglePasswords
					</h1>
					<nav className='flex space-x-8 font-medium'>
						<a href='#features' className='hover:underline'>
							Features
						</a>
						<a href='#pricing' className='hover:underline'>
							Pricing
						</a>
						<a href='#contact' className='hover:underline'>
							Contact
						</a>
					</nav>
				</div>
			</header>

			<section className='py-20'>
				<div className='max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
					<div>
						<h2 className='text-5xl font-bold tracking-tight leading-tight'>
							Simple Password Management.
							<br />
							Swiss-Level Precision.
						</h2>
						<p className='mt-6 text-lg'>
							Experience secure, seamless, and stress-free
							password management. Built for professionals,
							designed for everyone.
						</p>
						<div className='mt-8 space-x-4'>
							<Button
								onClick={() => {
									const contactElement =
										document.getElementById('features');
									if (contactElement) {
										contactElement.scrollIntoView({
											behavior: 'smooth',
										});
									}
								}}
								content='Get Started'
								variant='primary'
							/>
							<Button
								content='Learn More'
								variant='ghost'
								onClick={() => {
									const contactElement =
										document.getElementById('pricing');
									if (contactElement) {
										contactElement.scrollIntoView({
											behavior: 'smooth',
										});
									}
								}}
							/>
						</div>
					</div>
					<div className='rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-2xl'>
						<Image
							src='https://kappa.lol/MlEXp'
							width={640}
							height={320}
							alt='Password management illustration'
							className='w-full h-full object-cover'
							unoptimized
						/>
					</div>
				</div>
			</section>

			<section id='features' className='py-20'>
				<div className='max-w-7xl mx-auto px-6 text-center'>
					<h3 className='text-4xl font-semibold mb-12'>
						Key Features
					</h3>
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12'>
						{[
							{
								title: 'Encrypted Security',
								description:
									'Passwords are stored with the highest level of encryption for total peace of mind.',
								icon: (
									<Lock className='h-12 w-12 mb-4 mx-auto text-neutral-600 dark:text-neutral-300' />
								),
							},
							{
								title: 'Cross-Platform Autofill',
								description:
									'Fill in passwords seamlessly across all your devices.',
								icon: (
									<Key className='h-12 w-12 mb-4 mx-auto text-neutral-600 dark:text-neutral-300' />
								),
								badge: 'Coming Soon!',
							},
							{
								title: 'Two-Factor Authentication',
								description:
									'Add another layer of security with integrated 2FA support.',
								icon: (
									<Shield className='h-12 w-12 mb-4 mx-auto text-neutral-600 dark:text-neutral-300' />
								),
							},
						].map(({ title, description, icon, badge }) => (
							<div
								key={title}
								className='border p-8 rounded-3xl border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-all'
							>
								<div>{icon}</div>
								<h4 className='text-xl font-bold'>{title}</h4>
								{badge && (
									<p className='text-sm italic text-neutral-400 dark:text-neutral-200'>
										({badge})
									</p>
								)}
								<p className='mt-2 text-neutral-600 dark:text-neutral-300'>
									{description}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section
				id='pricing'
				className='py-20 border-t border-neutral-200 dark:border-neutral-800 bg-gradient-to-b from-neutral-100 to-neutral-50 dark:from-neutral-900 dark:to-neutral-950'
			>
				<div className='max-w-7xl mx-auto px-6 text-center'>
					<h3 className='text-4xl font-semibold text-neutral-800 dark:text-neutral-100 mb-6'>
						Simple Pricing
					</h3>
					<p className='text-lg text-neutral-600 dark:text-neutral-300 mb-12'>
						Transparent plans with no hidden costs. Choose the best
						plan for you.
					</p>
					<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-12'>
						<div className='border p-8 rounded-3xl border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 shadow-xl'>
							<h4 className='text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-4'>
								Free
							</h4>
							<h4 className='text-lg font-normal italic text-neutral-400 dark:text-neutral-300 mb-6'>
								(Forever)
							</h4>
							<p className='text-neutral-600 dark:text-neutral-300 mb-6'>
								Perfect for individuals with basic needs. Manage
								your passwords securely and easily.
							</p>
							<ul className='mt-6 space-y-2 text-neutral-600 dark:text-neutral-300'>
								<li>Unlimited Passwords</li>
								<li>Basic Autofill for your passwords</li>
								<li>Single Device Sync</li>
								<li>End-to-End Encryption for your data</li>
								<li>
									Secure Password Storage with no compromises
								</li>
								<li>More Features Coming Soon!</li>
							</ul>
							<Button
								disabled
								content='Sign Up (Coming Soon!)'
								variant='primary'
								className='mt-6 w-full py-3'
							/>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer
				id='contact'
				className='py-12 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-950'
			>
				<div className='max-w-7xl mx-auto px-6 text-center'>
					<p className='font-medium text-neutral-800 dark:text-neutral-300'>
						Have questions? Reach out to us at{' '}
						<a
							href='mailto:support@eaglepasswords.com'
							className='underline'
						>
							support@eaglepasswords.com
						</a>
					</p>
					<p className='mt-4 text-sm text-neutral-600 dark:text-neutral-400'>
						© {new Date().getFullYear()} EaglePasswords. All rights
						reserved.
					</p>
				</div>
			</footer>
		</main>
	);
};

export default SwissLandingPage;
