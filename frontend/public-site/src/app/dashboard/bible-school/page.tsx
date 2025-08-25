"use client";

import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardNav from '@/components/dashboard/DashboardNav';
import { GraduationCap, BookOpen, Clock } from 'lucide-react';

const lessons = [
  { id: 1, title: 'Foundations of Faith', duration: '35 min', level: 'Beginner' },
  { id: 2, title: 'Walking in the Spirit', duration: '42 min', level: 'Intermediate' },
  { id: 3, title: 'Understanding Grace', duration: '50 min', level: 'Intermediate' },
  { id: 4, title: 'Book of James', duration: '45 min', level: 'Advanced' },
  { id: 5, title: 'Parables of Jesus', duration: '38 min', level: 'Beginner' },
  { id: 6, title: 'Prayer and Fasting', duration: '55 min', level: 'Advanced' },
];

export default function BibleSchoolPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <DashboardNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <GraduationCap className="h-7 w-7 text-blue-600 mr-2" />
              Bible School
            </h1>
            <p className="mt-2 text-gray-600">Browse lessons and study at your pace.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {lessons.map((l) => (
              <div key={l.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-gray-500" />
                  {l.title}
                </h3>
                <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" /> {l.duration}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">{l.level}</span>
                </div>
                <button className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Start Lesson
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
