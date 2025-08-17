import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/navbar';


const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Navbar />

        <main className="flex-1 overflow-x-hidden pt-0 px-0">
          {children}
        </main>
      </body>
    </html>
  );
}
