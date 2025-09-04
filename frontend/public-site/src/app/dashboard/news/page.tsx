"use client";

import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardNav from '@/components/dashboard/DashboardNav';
import { Newspaper, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';

type NewsItem = {
  id: number;
  title: string;
  excerpt?: string;
  publishedAt?: string;
};

export default function NewsPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch('/api/strapi?endpoint=news-items&sort[0]=publishedAt:desc&pagination[page]=1&pagination[pageSize]=12', { cache: 'no-store' });
        const json = await res.json();
        const mapped: NewsItem[] = (json?.data || []).map((it: any) => ({
          id: it.id,
          title: it.title || it.attributes?.title,
          excerpt: it.excerpt || it.attributes?.excerpt || it.attributes?.content?.[0]?.children?.[0]?.text,
          publishedAt: it.publishedAt || it.attributes?.publishedAt,
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Newspaper className="h-7 w-7 text-blue-600 mr-2" />
              Church News
            </h1>
            <p className="mt-2 text-gray-600">Read the latest announcements and updates.</p>
          </div>

          {loading && (<div className="text-center py-12 text-gray-500">Loading...</div>)}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <article key={item.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                {item.excerpt && <p className="text-gray-600 text-sm mb-4">{item.excerpt}</p>}
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : ''}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
