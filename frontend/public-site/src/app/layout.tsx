import './globals.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import Navbar from '@/components/navbar';
import { org } from '@/lib/org';
import { AuthProvider } from '@/lib/auth-context';

const inter = Inter({ subsets: ['latin'] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: org.name,
    template: `%s | ${org.name}`,
  },
  description: org.description,
  keywords: ['Calvary Mission', 'HPC', 'church', 'sermons', 'worship', 'Agbor', 'Nigeria'],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: org.name,
    description: org.description,
    siteName: org.name,
    images: [
      {
        url: org.heroImage || '/img-1.jpg',
        width: 1200,
        height: 630,
        alt: org.name,
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: org.name,
    description: org.description,
    images: [org.heroImage || '/img-1.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  themeColor: '#ffffff',
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
