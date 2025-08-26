"use client";

import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardNav from '@/components/dashboard/DashboardNav';
import { Heart, Calendar, Clock } from 'lucide-react';

const sessions = [
  { id: 1, title: 'Morning Prayer', schedule: 'Mon - Fri', time: '6:00 AM' },
  { id: 2, title: 'Intercessory Prayer', schedule: 'Wednesdays', time: '7:00 PM' },
  { id: 3, title: 'Night Vigil', schedule: 'Last Friday of the month', time: '10:00 PM' },
];

export default function PrayerPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <DashboardNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Heart className="h-7 w-7 text-blue-600 mr-2" />
              Pray with Us
            </h1>
            <p className="mt-2 text-gray-600">Join prayer sessions or submit a prayer request.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {sessions.map((s) => (
              <div key={s.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900">{s.title}</h3>
                <p className="mt-1 text-sm text-gray-600 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" /> {s.schedule}
                </p>
                <p className="mt-1 text-sm text-gray-600 flex items-center">
                  <Clock className="h-4 w-4 mr-1" /> {s.time}
                </p>
                <button className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Submit Prayer Request
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
