"use client";

import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardNav from '@/components/dashboard/DashboardNav';
import { Newspaper, Calendar, Clock } from 'lucide-react';

const newsItems = [
  {
    id: 1,
    title: 'Sanctuary Renovation Update',
    excerpt: 'Phase 2 begins next week with seating upgrades.',
    date: '2024-01-10',
  },
  {
    id: 2,
    title: 'New Midweek Service Time',
    excerpt: 'Wednesday services move to 6:30 PM starting February.',
    date: '2024-01-08',
  },
  {
    id: 3,
    title: 'Community Outreach Drive',
    excerpt: 'Join us in supporting local families this month.',
    date: '2024-01-05',
  },
];

export default function NewsPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <DashboardNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Newspaper className="h-7 w-7 text-blue-600 mr-2" />
              Church News
            </h1>
            <p className="mt-2 text-gray-600">Read the latest announcements and updates.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {newsItems.map((item) => (
              <article key={item.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{item.excerpt}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(item.date).toLocaleDateString()}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
