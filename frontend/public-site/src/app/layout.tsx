import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/navbar';
import { org } from '@/lib/org';
import { AuthProvider } from '@/lib/auth-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: org.name,
  description: org.description,
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <AuthProvider>
          <Navbar />

          <main className="flex-1 overflow-x-hidden pt-0 px-0">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
