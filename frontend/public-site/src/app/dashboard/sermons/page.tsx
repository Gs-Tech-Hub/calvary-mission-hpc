"use client";

import { useAuth } from '@/lib/auth-context';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardNav from '@/components/dashboard/DashboardNav';
import { Plus, Search, Filter, Play, Edit, Trash2, BookOpen } from 'lucide-react';
import { useEffect, useState } from 'react';

type Sermon = {
  id: number;
  title: string;
  speaker?: string;
  date?: string;
  youtubeId?: string;
  description?: any;
  thumbnail?: { data?: { attributes?: { url?: string } } };
  status?: string;
  views?: number;
};

export default function SermonsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch('/api/strapi?endpoint=sermons&populate[thumbnail]=*&sort[0]=date:desc&pagination[page]=1&pagination[pageSize]=12', { cache: 'no-store' });
        const json = await res.json();
        const items: Sermon[] = (json?.data || []).map((it: any) => ({
          id: it.id,
          title: it.title || it.attributes?.title,
          speaker: it.speaker || it.attributes?.speaker,
          date: it.date || it.attributes?.date,
          youtubeId: it.youtubeId || it.attributes?.youtubeId,
          description: it.description || it.attributes?.description,
          thumbnail: it.thumbnail || it.attributes?.thumbnail,
          status: 'published',
          views: 0,
        }));
        if (!cancelled) setSermons(items);
      } catch {
        if (!cancelled) setSermons([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const filteredSermons = sermons.filter(sermon => {
    const matchesSearch = sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (sermon.speaker || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || (sermon.status || 'published') === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <DashboardNav />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Sermons</h1>
                <p className="mt-2 text-gray-600">
                  Manage and organize your sermon content
                </p>
              </div>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Plus className="h-4 w-4 mr-2" />
                Add Sermon
              </button>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="mb-6 bg-white p-4 rounded-lg shadow">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search sermons..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Sermons Grid */}
          {loading && (
            <div className="text-center py-12 text-gray-500">Loading...</div>
          )}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSermons.map((sermon) => (
              <div key={sermon.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  {sermon.thumbnail?.data?.attributes?.url ? (
                    <img
                      src={sermon.thumbnail.data.attributes.url}
                      alt={sermon.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100" />
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      sermon.status === 'published' ? 'bg-green-100 text-green-800' :
                      sermon.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {sermon.status || 'published'}
                    </span>
                    <span className="text-sm text-gray-500">{sermon.views ?? 0} views</span>
                  </div>
                  
                  <h3 className="text-lg font-medium text-gray-900 mb-1">{sermon.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">by {sermon.speaker || '—'}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{sermon.date ? new Date(sermon.date).toLocaleDateString() : ''}</span>
                    <span>{sermon.youtubeId ? 'YouTube' : ''}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <Play className="h-3 w-3 mr-1" />
                      Preview
                    </button>
                    
                    <div className="flex space-x-2">
                      <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </button>
                      <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredSermons.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <BookOpen className="mx-auto h-12 w-12" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No sermons found</h3>
              <p className="text-gray-500">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by adding your first sermon.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
