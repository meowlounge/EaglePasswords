import './globals.css';
import { AuthProvider } from '@/context/AuthProvider';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/context/ThemeProvider';
import localFont from 'next/font/local';

const Font = localFont({
	src: '../../public/fonts/GeneralSans-Variable.woff2',
	display: 'swap',
});

export const metadata = {
	icons: {
		icon: '/icon.webp',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			className='cursor-default select-none dark:bg-neutral-900 not-dark:bg-neutral-100'
			lang='en'
		>
			<body className={`${Font.className} antialiased`}>
				<link rel='icon' href={metadata.icons.icon} />
				<ThemeProvider>
					{' '}
					<AuthProvider>
						<div>
							{children}
							<Toaster
								richColors
								visibleToasts={5}
								position='top-left'
							/>
						</div>
					</AuthProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
