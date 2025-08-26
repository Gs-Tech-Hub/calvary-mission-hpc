import type { Metadata } from 'next';
import Script from 'next/script';
import Image from 'next/image';
import Link from 'next/link';
import { org } from '@/lib/org';

export const revalidate = 86400;

const pageTitle = `Annual Convention | ${org.name}`;
const pageDescription = `Join ${org.name} for our Annual Convention — days of powerful worship, inspiring messages, and life-changing encounters. Register now and invite a friend!`;
const canonicalPath = '/convention';

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: canonicalPath },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    title: pageTitle,
    description: pageDescription,
    url: canonicalPath,
    siteName: org.name,
    images: [
      {
        url: org.heroImage || '/logo.svg',
        width: 1200,
        height: 630,
        alt: `${org.name} Convention`,
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: pageTitle,
    description: pageDescription,
    images: [org.heroImage || '/logo.svg'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

function JsonLd() {
  const startDate = '2025-10-10T09:00:00+01:00';
  const endDate = '2025-10-13T18:00:00+01:00';
  const eventSchema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `${org.name} Annual Convention`,
    description: pageDescription,
    startDate,
    endDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    organizer: {
      '@type': 'Organization',
      name: org.name,
      url: canonicalPath,
      logo: org.logo,
      email: org.email,
      telephone: org.phone,
    },
    location: {
      '@type': 'Place',
      name: org.name,
      address: org.address,
    },
    image: [org.heroImage || '/logo.svg'],
    url: canonicalPath,
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Where is the convention holding?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${org.address}.`,
        },
      },
      {
        '@type': 'Question',
        name: 'Is registration required?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Please register using the button on this page to help us plan seating and resources.',
        },
      },
      {
        '@type': 'Question',
        name: 'Will there be live streaming?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, selected sessions will be streamed via our YouTube channel.',
        },
      },
    ],
  };

  const jsonLd = JSON.stringify([eventSchema, faqSchema]);

  return (
    <Script
      id="convention-jsonld"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: jsonLd }}
    />
  );
}

export default function ConventionPage() {
  return (
    <>
      <JsonLd />
      <section className="relative isolate overflow-hidden bg-gray-900">
        <div className="absolute inset-0 -z-10">
          <Image
            src={org.heroImage || '/logo.svg'}
            alt={`${org.name} Convention hero image`}
            fill
            priority
            className="object-cover opacity-50"
            sizes="100vw"
          />
        </div>
        <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-300">Annual Convention</p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">Arise & Shine Convention 2025</h1>
          <p className="mt-6 text-lg leading-8 text-gray-200 max-w-2xl mx-auto">
            {pageDescription}
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="#register" className="rounded-md bg-emerald-500 px-6 py-3 text-base font-semibold text-white shadow hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-gray-900">
              Register Now
            </Link>
            <a href={org.socials.youtube} target="_blank" rel="noopener noreferrer" className="rounded-md bg-white/10 px-6 py-3 text-base font-semibold text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50">
              Watch Online
            </a>
          </div>
          <div className="mt-6 text-gray-300">August 28–31, 2025 • {org.address}</div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-8" aria-label="Key highlights">
        <div className="rounded-2xl border border-gray-200 p-6 shadow-sm bg-white">
          <h2 className="text-xl font-semibold">Powerful Worship</h2>
          <p className="mt-2 text-gray-600">Experience heartfelt worship that lifts Jesus high and prepares hearts for the Word.</p>
        </div>
        <div className="rounded-2xl border border-gray-200 p-6 shadow-sm bg-white">
          <h2 className="text-xl font-semibold">Transforming Word</h2>
          <p className="mt-2 text-gray-600">Be equipped by seasoned ministers with messages of faith, hope, and revival.</p>
        </div>
        <div className="rounded-2xl border border-gray-200 p-6 shadow-sm bg-white">
          <h2 className="text-xl font-semibold">Family Friendly</h2>
          <p className="mt-2 text-gray-600">Dedicated sessions and facilities for youths and children throughout the convention.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-8" aria-labelledby="schedule-heading">
        <h2 id="schedule-heading" className="text-2xl font-bold">Schedule Overview</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-lg border border-gray-200 p-5 bg-white">
            <h3 className="font-semibold">Day 1 — Friday</h3>
            <ul className="mt-2 list-disc pl-5 text-gray-700">
              <li>Opening Rally & Worship — 5:00 PM</li>
              <li>Keynote: The Light Has Come</li>
              <li>Altar Ministry</li>
            </ul>
          </div>
          <div className="rounded-lg border border-gray-200 p-5 bg-white">
            <h3 className="font-semibold">Day 2 — Saturday</h3>
            <ul className="mt-2 list-disc pl-5 text-gray-700">
              <li>Morning Prayer — 8:00 AM</li>
              <li>Workshops & Breakout Sessions</li>
              <li>Evening Revival Service</li>
            </ul>
          </div>
          <div className="rounded-lg border border-gray-200 p-5 bg-white">
            <h3 className="font-semibold">Day 3 — Sunday</h3>
            <ul className="mt-2 list-disc pl-5 text-gray-700">
              <li>Celebration Service — 9:00 AM</li>
              <li>Thanksgiving & Testimonies</li>
              <li>Commissioning & Closing</li>
            </ul>
          </div>
          <div className="rounded-lg border border-gray-200 p-5 bg-white">
            <h3 className="font-semibold">Location & Directions</h3>
            <p className="mt-2 text-gray-700">{org.address}</p>
            <p className="mt-1 text-gray-700">Call: <a href={`tel:${org.phone}`} className="text-emerald-700 underline">{org.phone}</a></p>
            <p className="mt-1 text-gray-700">Email: <a href={`mailto:${org.email}`} className="text-emerald-700 underline">{org.email}</a></p>
          </div>
        </div>
      </section>

      <section id="register" className="mx-auto max-w-3xl px-6 py-16" aria-labelledby="registration-heading">
        <h2 id="registration-heading" className="text-2xl font-bold text-center">Register Your Attendance</h2>
        <p className="mt-3 text-gray-700 text-center">Help us plan seating and hospitality. Admission is free.</p>
        <div className="mt-8">
          <form className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input id="name" name="name" type="text" required className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500" placeholder="Jane Doe" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input id="email" name="email" type="email" required className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500" placeholder="you@example.com" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
              <input id="phone" name="phone" type="tel" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500" placeholder="+234 ..." />
            </div>
            <div className="flex items-center justify-center">
              <button type="submit" className="mt-4 inline-flex justify-center rounded-md bg-emerald-600 px-6 py-3 text-base font-semibold text-white shadow hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500">Submit</button>
            </div>
          </form>
        </div>
        <p className="mt-6 text-center text-sm text-gray-600">By registering you agree to receive event updates by email/SMS.</p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-2xl font-bold">Frequently Asked Questions</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-lg border border-gray-200 p-5 bg-white">
            <h3 className="font-semibold">What should I bring?</h3>
            <p className="mt-2 text-gray-700">Bring your Bible, a notepad, and a friend. Child care is available for select sessions.</p>
          </div>
          <div className="rounded-lg border border-gray-200 p-5 bg-white">
            <h3 className="font-semibold">Is there parking?</h3>
            <p className="mt-2 text-gray-700">Yes, on-site and overflow parking will be available with ushers to guide you.</p>
          </div>
        </div>
      </section>
    </>
  );
}


