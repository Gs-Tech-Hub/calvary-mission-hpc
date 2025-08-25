"use client";

import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardNav from '@/components/dashboard/DashboardNav';
import { MessageCircle, Calendar, User } from 'lucide-react';

const testimonies = [
  {
    id: 1,
    name: 'Sarah A.',
    title: 'Healed from chronic pain',
    content: 'After prayer during last Sunday service, my chronic back pain disappeared. Glory to God!',
    date: '2024-01-09',
  },
  {
    id: 2,
    name: 'Michael B.',
    title: 'New job opportunity',
    content: 'God opened a door for a new job after months of searching. Thank you for your prayers!',
    date: '2024-01-07',
  },
  {
    id: 3,
    name: 'Grace K.',
    title: 'Family restoration',
    content: 'God restored my relationship with my sister after years of division. Praise God!',
    date: '2024-01-03',
  },
];

export default function TestimoniesPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <DashboardNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <MessageCircle className="h-7 w-7 text-blue-600 mr-2" />
              Testimonies
            </h1>
            <p className="mt-2 text-gray-600">Read testimonies shared by members.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {testimonies.map((t) => (
              <div key={t.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900">{t.title}</h3>
                <p className="mt-1 text-sm text-gray-700">{t.content}</p>
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center">
                    <User className="h-4 w-4 mr-1" /> {t.name}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" /> {new Date(t.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
