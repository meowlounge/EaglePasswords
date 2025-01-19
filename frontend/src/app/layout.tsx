import "./globals.css";
import { AuthProvider } from "@/context/AuthProvider";
import { DM_Sans } from "next/font/google";
import { Sidebar } from "@/components/Sidebar";

const font_sans = DM_Sans({ fallback: ["system-ui"], subsets: ["latin"] });

export const metadata = {
  icons: {
    icon: "/icon.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className="cursor-default select-none dark:bg-neutral-900 bg-neutral-100"
      lang="en"
    >
      <body className={`${font_sans.className} antialiased`}>
        <link rel="icon" href={metadata.icons.icon} />
        <AuthProvider>
          <Sidebar />
          <div className="xl:ml-72 md:ml-72 lg:ml-72 max-sm:mt-16 max-md:mt-16">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
