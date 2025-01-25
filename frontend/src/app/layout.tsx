import './globals.css';
import { AuthProvider } from '@/context/AuthProvider';
import { DM_Sans } from 'next/font/google';
import { Toaster } from 'sonner';
import Navbar from '@/components/Navbar';

const font_sans = DM_Sans({ fallback: ['system-ui'], subsets: ['latin'] });

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
               <body className={`${font_sans.className} antialiased`}>
                    <link rel='icon' href={metadata.icons.icon} />
                    <AuthProvider>
                         <Navbar />
                         <div>
                              {children}
                              <Toaster richColors />
                         </div>
                    </AuthProvider>
               </body>
          </html>
     );
}
