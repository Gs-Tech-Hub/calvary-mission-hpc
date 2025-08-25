"use client";

import { useAuth } from '@/lib/auth-context';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardNav from '@/components/dashboard/DashboardNav';
import { Play, Music, Video, Calendar, Clock } from 'lucide-react';

const entertainmentContent = [
  {
    id: 1,
    title: 'Gospel Music Collection',
    type: 'Music',
    duration: '45 min',
    category: 'Worship',
    thumbnail: '/api/placeholder/300/200',
    description: 'A curated collection of uplifting gospel music for spiritual growth.',
    date: '2024-01-15',
  },
  {
    id: 2,
    title: 'Christian Comedy Show',
    type: 'Video',
    duration: '30 min',
    category: 'Entertainment',
    thumbnail: '/api/placeholder/300/200',
    description: 'Family-friendly comedy with Christian values and positive messages.',
    date: '2024-01-14',
  },
  {
    id: 3,
    title: 'Youth Dance Performance',
    type: 'Video',
    duration: '15 min',
    category: 'Performance',
    thumbnail: '/api/placeholder/300/200',
    description: 'Inspiring dance performance by our youth ministry.',
    date: '2024-01-13',
  },
  {
    id: 4,
    title: 'Instrumental Worship',
    type: 'Music',
    duration: '60 min',
    category: 'Worship',
    thumbnail: '/api/placeholder/300/200',
    description: 'Peaceful instrumental music for prayer and meditation.',
    date: '2024-01-12',
  },
  {
    id: 5,
    title: 'Children\'s Story Time',
    type: 'Video',
    duration: '20 min',
    category: 'Education',
    thumbnail: '/api/placeholder/300/200',
    description: 'Biblical stories told in an engaging way for children.',
    date: '2024-01-11',
  },
  {
    id: 6,
    title: 'Praise Team Practice',
    type: 'Music',
    duration: '90 min',
    category: 'Worship',
    thumbnail: '/api/placeholder/300/200',
    description: 'Behind-the-scenes look at our praise team preparing for service.',
    date: '2024-01-10',
  },
];

export default function EntertainmentPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <DashboardNav />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Entertainment</h1>
            <p className="mt-2 text-gray-600">
              Access uplifting Christian entertainment, music, and media content.
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {entertainmentContent.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-video bg-gray-200 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="h-16 w-16 text-white opacity-80" />
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.category === 'Worship' ? 'bg-blue-100 text-blue-800' :
                      item.category === 'Entertainment' ? 'bg-green-100 text-green-800' :
                      item.category === 'Performance' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.category}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {item.duration}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                    
                    <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <Play className="h-4 w-4 mr-2" />
                      {item.type === 'Music' ? 'Listen' : 'Watch'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
