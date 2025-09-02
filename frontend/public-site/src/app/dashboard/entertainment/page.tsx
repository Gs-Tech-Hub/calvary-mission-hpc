"use client";

import { useAuth } from '@/lib/auth-context';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardNav from '@/components/dashboard/DashboardNav';
import { Play, Calendar, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

type Entertainment = {
  id: number;
  title: string;
  category?: string;
  publishedAt?: string;
  duration?: string;
};

export default function EntertainmentPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Entertainment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch('/api/strapi?endpoint=entertainments&sort[0]=publishedAt:desc&pagination[page]=1&pagination[pageSize]=12', { cache: 'no-store' });
        const json = await res.json();
        const mapped: Entertainment[] = (json?.data || []).map((it: any) => ({
          id: it.id,
          title: it.title || it.attributes?.title,
          category: it.category || it.attributes?.category,
          publishedAt: it.publishedAt || it.attributes?.publishedAt,
          duration: it.duration || it.attributes?.duration,
        }));
        if (!cancelled) setItems(mapped);
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

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
          {loading && (<div className="text-center py-12 text-gray-500">Loading...</div>)}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
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
                      {item.duration || ''}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : ''}
                    </span>
                    
                    <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <Play className="h-4 w-4 mr-2" />
                      Watch
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
