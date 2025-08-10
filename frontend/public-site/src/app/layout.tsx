import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/navbar';
import { org } from '@/lib/org';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: org.name,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="overflow-x-hidden min-h-screen pt-0 px-0">{children}</main>
      </body>
    </html>
  );
}
