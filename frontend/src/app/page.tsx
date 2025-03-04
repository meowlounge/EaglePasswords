'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Lock, Key, Shield, Clock, Menu, X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const LandingPage = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [scrollPosition, setScrollPosition] = useState(0);

	useEffect(() => {
		const handleScroll = () => {
			setScrollPosition(window.scrollY);
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const scrollToSection = (id: string) => {
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
			setIsMenuOpen(false);
		}
	};

	const navigationItems = ['Features', 'Pricing', 'Contact'];

	return (
		<main className='min-h-screen bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100'>
			<header
				className={`fixed top-0 left-0 right-0 transition-all duration-300 ${
					scrollPosition > 150
						? 'bg-neutral-100/95 dark:bg-neutral-900/95 border-b border-neutral-500/25 dark:border-neutral-700/45'
						: 'bg-transparent'
				} backdrop-blur-md z-50 py-4`}
			>
				<div className='max-w-6xl mx-auto flex items-center justify-between px-4 lg:px-6'>
					<h1 className='text-xl md:text-2xl font-medium tracking-tight z-50'>
						EAGLE
						<span className='text-neutral-600 dark:text-neutral-400 hover:text-'>
							PASSWORDS
						</span>
					</h1>

					<button
						className='lg:hidden z-50'
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						aria-label='Toggle menu'
					>
						{isMenuOpen ? (
							<X className='h-6 w-6' />
						) : (
							<Menu className='h-6 w-6' />
						)}
					</button>

					<nav className='hidden lg:flex space-x-12 text-sm font-medium'>
						{navigationItems.map((item) => (
							<button
								key={item}
								onClick={() =>
									scrollToSection(item.toLowerCase())
								}
								className='relative group py-2 px-1'
							>
								<span className='relative z-10 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors'>
									{item}
								</span>
								<span className='absolute bottom-0 left-0 w-0 h-0.5 bg-neutral-600 dark:bg-neutral-400 transition-all duration-300 group-hover:w-full'></span>
							</button>
						))}
					</nav>

					<div
						className={`
            			lg:hidden
            			absolute top-full left-0 right-0
            			bg-neutral-100 dark:bg-neutral-900
            			border-b border-neutral-200 dark:border-neutral-800
            			shadow-lg
            			transition-all duration-300 ease-in-out
            			${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}
          				`}
					>
						<nav className='max-w-6xl mx-auto'>
							{navigationItems.map((item, index) => (
								<button
									key={item}
									onClick={() =>
										scrollToSection(item.toLowerCase())
									}
									className={`
                    				w-full text-left px-6 py-4
                    				text-lg font-medium
                    				hover:bg-neutral-200 dark:hover:bg-neutral-800
                    				transition-colors
                    				flex items-center justify-between
                    				${index !== navigationItems.length - 1 ? 'border-b border-neutral-200 dark:border-neutral-800' : ''}
                  				`}
								>
									<span>{item}</span>
									<ChevronRight className='h-4 w-4 text-neutral-500' />
								</button>
							))}
						</nav>
					</div>
				</div>
			</header>

			<section className='min-h-screen flex items-center pt-16 px-4 lg:px-6'>
				<div className='max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center'>
					<div className='space-y-6 lg:space-y-8 text-center lg:text-left'>
						<h2 className='text-4xl md:text-5xl lg:text-6xl font-medium italic tracking-tight leading-none'>
							Swiss-Grade
							<br />
							<span className='text-neutral-600 font-medium not-italic dark:text-neutral-400'>
								Password Security
							</span>
						</h2>
						<p className='text-lg md:text-xl text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-xl mx-auto lg:mx-0'>
							Experience military-grade encryption with Swiss
							precision. Your digital fortress for the modern age.
						</p>
						<div className='flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start'>
							<Button
								onClick={() => scrollToSection('features')}
								className='px-8 py-4 group'
							>
								<span>Explore Features</span>
								<ChevronRight className='ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform' />
							</Button>
							<Button
								onClick={() => scrollToSection('pricing')}
								className='px-8 py-4'
								variant='border'
							>
								View Pricing
							</Button>
						</div>
					</div>
					<div className='relative aspect-video rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300'>
						<Image
							src='https://kappa.lol/MlEXp'
							alt='Password management illustration'
							className='object-cover'
							width={640}
							height={320}
							unoptimized
						/>
						<div className='absolute inset-0 bg-gradient-to-tr from-neutral-600/20 to-transparent'></div>
					</div>
				</div>
			</section>

			<section
				id='features'
				className='py-24 bg-neutral-50 dark:bg-neutral-800/20'
			>
				<div className='max-w-6xl mx-auto px-4 lg:px-6'>
					<h3 className='text-3xl md:text-4xl font-semibold text-center mb-16'>
						Uncompromising{' '}
						<span className='text-neutral-600 font-medium dark:text-neutral-400'>
							Security
						</span>
					</h3>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'>
						{[
							{
								title: 'Zero-Knowledge Encryption',
								description:
									'Your data is encrypted before it leaves your device. We never see your passwords.',
								icon: (
									<Lock className='h-8 w-8 text-neutral-600 dark:text-neutral-400' />
								),
							},
							{
								title: 'Biometric Authentication',
								description:
									'Unlock your vault instantly with Face ID or Touch ID on supported devices.',
								icon: (
									<Key className='h-8 w-8 text-neutral-600 dark:text-neutral-400' />
								),
							},
							{
								title: 'Advanced 2FA',
								description:
									'Add an extra layer of security with built-in two-factor authentication.',
								icon: (
									<Shield className='h-8 w-8 text-neutral-600 dark:text-neutral-400' />
								),
							},
						].map(({ title, description, icon }) => (
							<div
								key={title}
								className='group p-6 lg:p-8 rounded-2xl bg-neutral-100 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-600 dark:hover:border-neutral-400 transition-all duration-700 hover:shadow-lg'
							>
								<div className='flex flex-col h-full'>
									<div className='p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/40 w-fit mb-6 group-hover:scale-110 group-hover:-translate-y-2 transition-all'>
										{icon}
									</div>
									<h4 className='text-xl font-medium mb-4'>
										{title}
									</h4>
									<p className='text-neutral-600 dark:text-neutral-300'>
										{description}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			<section id='pricing' className='py-24'>
				<div className='max-w-6xl mx-auto px-4 lg:px-6 text-center'>
					<h3 className='text-3xl md:text-4xl font-semibold mb-16'>
						Simple{' '}
						<span className='text-neutral-600 font-medium dark:text-neutral-400'>
							Pricing
						</span>
					</h3>
					<div className='max-w-xl mx-auto'>
						<div className='rounded-2xl bg-neutral-100 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 p-6 lg:p-8 hover:shadow-xl transition-shadow'>
							<div className='flex items-center justify-center gap-4 mb-8'>
								<h4 className='text-3xl md:text-4xl font-medium'>
									Free Plan
								</h4>
								<p className='text-sm italic '>Forever</p>
							</div>
							<ul className='space-y-4 text-base lg:text-lg mb-8'>
								{[
									'Unlimited Passwords',
									'End-to-End Encryption',
									'Secure Password Generator',
									'Basic Autofill',
									'Single Device Sync',
								].map((feature) => (
									<li
										key={feature}
										className='flex items-center justify-center gap-2'
									>
										<svg
											className='w-5 h-5 text-neutral-600 dark:text-neutral-400 flex-shrink-0'
											fill='none'
											stroke='currentColor'
											viewBox='0 0 24 24'
										>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth='2'
												d='M5 13l4 4L19 7'
											/>
										</svg>
										<span>{feature}</span>
									</li>
								))}
							</ul>
							<Button
								disabled
								className='w-full'
								variant='border'
							>
								<Clock className='mr-2 h-4 w-4' />
								<span>Coming Soon</span>
							</Button>
						</div>
					</div>
				</div>
			</section>

			<footer
				id='contact'
				className='py-32 bg-linear-to-b from-neutral-100 to-neutral-400 dark:from-neutral-900 dark:to-neutral-950 text-neutral-100'
			>
				<div className='max-w-6xl mx-auto px-4 lg:px-6 text-center'>
					<p className='text-neutral-700 dark:text-neutral-200'>
						© {new Date().getFullYear()} @prodbyeagle. All rights
						reserved.
					</p>
				</div>
			</footer>
		</main>
	);
};

export default LandingPage;
