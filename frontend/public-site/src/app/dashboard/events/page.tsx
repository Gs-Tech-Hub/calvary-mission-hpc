"use client";

import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardNav from '@/components/dashboard/DashboardNav';
import { Calendar, MapPin, Clock } from 'lucide-react';

const events = [
  { id: 1, name: 'Youth Conference 2025', date: '2025-03-12', time: '10:00 AM', location: 'Main Auditorium' },
  { id: 2, name: 'Community Outreach', date: '2025-02-05', time: '09:00 AM', location: 'City Park' },
  { id: 3, name: 'Worship Night', date: '2025-01-30', time: '06:00 PM', location: 'Chapel' },
];

export default function EventsPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <DashboardNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Calendar className="h-7 w-7 text-blue-600 mr-2" />
              Events
            </h1>
            <p className="mt-2 text-gray-600">See upcoming and past church events.</p>
          </div>

          <div className="space-y-4">
            {events.map((e) => (
              <div key={e.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900">{e.name}</h3>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-600">
                  <div className="flex items-center"><Calendar className="h-4 w-4 mr-1" /> {new Date(e.date).toLocaleDateString()}</div>
                  <div className="flex items-center"><Clock className="h-4 w-4 mr-1" /> {e.time}</div>
                  <div className="flex items-center"><MapPin className="h-4 w-4 mr-1" /> {e.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
