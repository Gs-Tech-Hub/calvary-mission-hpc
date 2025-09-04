"use client";

import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardNav from '@/components/dashboard/DashboardNav';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

type EventItem = {
  id: number;
  title: string;
  date?: string;
  location?: string;
};

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch('/api/strapi?endpoint=events&sort[0]=date:asc&pagination[page]=1&pagination[pageSize]=20', { cache: 'no-store' });
        const json = await res.json();
        const mapped: EventItem[] = (json?.data || []).map((it: any) => ({
          id: it.id,
          title: it.title || it.attributes?.title,
          date: it.date || it.attributes?.date,
          location: it.location || it.attributes?.location,
        }));
        if (!cancelled) setEvents(mapped);
      } catch {
        if (!cancelled) setEvents([]);
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Calendar className="h-7 w-7 text-blue-600 mr-2" />
              Events
            </h1>
            <p className="mt-2 text-gray-600">See upcoming and past church events.</p>
          </div>

          {loading && (<div className="text-center py-12 text-gray-500">Loading...</div>)}
          <div className="space-y-4">
            {events.map((e) => (
              <div key={e.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900">{e.title}</h3>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-600">
                  <div className="flex items-center"><Calendar className="h-4 w-4 mr-1" /> {e.date ? new Date(e.date).toLocaleDateString() : ''}</div>
                  <div className="flex items-center"><Clock className="h-4 w-4 mr-1" /> {/* time not modeled */}</div>
                  <div className="flex items-center"><MapPin className="h-4 w-4 mr-1" /> {e.location || ''}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
