"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, BookOpen, Calendar, Tv, Newspaper, GraduationCap, Heart } from 'lucide-react';

type CountResponse = {
  meta?: { pagination?: { total?: number } };
  data?: unknown[];
};

interface NotificationItem {
  id: string;
  type: 'sermons' | 'eventsUpcoming' | 'liveActive' | 'news' | 'bible' | 'prayers';
  count: number;
  lastUpdated: number;
}

interface ReadStatus {
  [key: string]: {
    lastReadCount: number;
    lastReadTime: number;
  };
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, { value: number; timestamp: number }>();

async function fetchCount(endpoint: string, query: string): Promise<number> {
  const cacheKey = `${endpoint}-${query}`;
  const now = Date.now();
  const cached = cache.get(cacheKey);

  if (cached && now - cached.timestamp < CACHE_DURATION) {
    return cached.value;
  }

  try {
    const url = `/api/strapi?endpoint=${encodeURIComponent(endpoint)}&${query}`;
    const res = await fetch(url, { 
      cache: 'default',
      headers: {
        'Cache-Control': 'max-age=300' // 5 minutes
      }
    });
    if (!res.ok) return 0;
    const json: CountResponse = await res.json();
    const total = json?.meta?.pagination?.total;
    const value = typeof total === 'number' ? total : Array.isArray(json?.data) ? json.data.length : 0;
    
    // Update cache
    cache.set(cacheKey, { value, timestamp: now });
    return value;
  } catch {
    return 0;
  }
}

const STORAGE_KEY = 'notification-read-status';

function getReadStatus(): ReadStatus {
  if (typeof window === 'undefined') return {};
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
}

function saveReadStatus(status: ReadStatus) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(status));
}

export default function NotificationsDropdown() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [readStatus, setReadStatus] = useState<ReadStatus>({});
  const [counts, setCounts] = useState({
    sermons: 0,
    eventsUpcoming: 0,
    liveActive: 0,
    news: 0,
    bible: 0,
    prayers: 0,
  });

  useEffect(() => {
    // Initialize read status from localStorage
    setReadStatus(getReadStatus());
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const nowIso = new Date().toISOString();
      const [sermons, eventsUpcoming, liveActive, news, bible, prayers] = await Promise.all([
        fetchCount('sermons', 'pagination[page]=1&pagination[pageSize]=1'),
        fetchCount('events', `filters[date][$gte]=${encodeURIComponent(nowIso)}&pagination[page]=1&pagination[pageSize]=1`),
        fetchCount('live-tvs', 'filters[isActive][$eq]=true&pagination[page]=1&pagination[pageSize]=1'),
        fetchCount('news-items', 'pagination[page]=1&pagination[pageSize]=1'),
        fetchCount('bible-studies', 'pagination[page]=1&pagination[pageSize]=1'),
        fetchCount('prayers', 'pagination[page]=1&pagination[pageSize]=1'),
      ]);
      if (!cancelled) {
        setCounts({ sermons, eventsUpcoming, liveActive, news, bible, prayers });
        setLoading(false);
      }
    };
    load();
    // Poll every 5 minutes instead of every minute
    const interval = setInterval(load, 5 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const markAsRead = (type: keyof typeof counts) => {
    const newStatus = {
      ...readStatus,
      [type]: {
        lastReadCount: counts[type],
        lastReadTime: Date.now()
      }
    };
    setReadStatus(newStatus);
    saveReadStatus(newStatus);
  };

  const getUnreadCount = (type: keyof typeof counts) => {
    const status = readStatus[type];
    if (!status) return counts[type];
    return Math.max(0, counts[type] - status.lastReadCount);
  };

  const totalUnread = Object.keys(counts).reduce((total, type) => 
    total + getUnreadCount(type as keyof typeof counts), 0
  );

  const handleItemClick = (type: keyof typeof counts) => {
    markAsRead(type);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative inline-flex items-center p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {!loading && totalUnread > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
            {totalUnread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-[9999]">
          <div className="p-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">Notifications</p>
            <p className="text-xs text-gray-500">Live counts from content</p>
          </div>
          <ul className="divide-y divide-gray-100">
            <li 
              className={`px-3 py-2 flex items-center justify-between cursor-pointer hover:bg-gray-50 ${getUnreadCount('sermons') > 0 ? 'bg-blue-50' : ''}`}
              onClick={() => handleItemClick('sermons')}
            >
              <div className="flex items-center text-gray-700">
                <BookOpen className={`h-4 w-4 mr-2 ${getUnreadCount('sermons') > 0 ? 'text-blue-500' : 'text-gray-400'}`} />
                <span className={`text-sm ${getUnreadCount('sermons') > 0 ? 'font-medium text-blue-900' : ''}`}>Available Sermons</span>
              </div>
              <span className={`text-sm font-semibold ${getUnreadCount('sermons') > 0 ? 'text-blue-600' : 'text-gray-900'}`}>
                {counts.sermons}
                {getUnreadCount('sermons') > 0 && <span className="ml-1 text-xs text-blue-500">({getUnreadCount('sermons')} new)</span>}
              </span>
            </li>
            <li 
              className={`px-3 py-2 flex items-center justify-between cursor-pointer hover:bg-gray-50 ${getUnreadCount('eventsUpcoming') > 0 ? 'bg-blue-50' : ''}`}
              onClick={() => handleItemClick('eventsUpcoming')}
            >
              <div className="flex items-center text-gray-700">
                <Calendar className={`h-4 w-4 mr-2 ${getUnreadCount('eventsUpcoming') > 0 ? 'text-blue-500' : 'text-gray-400'}`} />
                <span className={`text-sm ${getUnreadCount('eventsUpcoming') > 0 ? 'font-medium text-blue-900' : ''}`}>Upcoming Events</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{counts.eventsUpcoming}</span>
            </li>
            <li className="px-3 py-2 flex items-center justify-between">
              <div className="flex items-center text-gray-700">
                <Tv className="h-4 w-4 mr-2 text-gray-400" />
                <span className="text-sm">Live Channels</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{counts.liveActive}</span>
            </li>
            <li className="px-3 py-2 flex items-center justify-between">
              <div className="flex items-center text-gray-700">
                <Newspaper className="h-4 w-4 mr-2 text-gray-400" />
                <span className="text-sm">News Updates</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{counts.news}</span>
            </li>
            <li className="px-3 py-2 flex items-center justify-between">
              <div className="flex items-center text-gray-700">
                <GraduationCap className="h-4 w-4 mr-2 text-gray-400" />
                <span className="text-sm">Bible Lessons</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{counts.bible}</span>
            </li>
            <li className="px-3 py-2 flex items-center justify-between">
              <div className="flex items-center text-gray-700">
                <Heart className="h-4 w-4 mr-2 text-gray-400" />
                <span className="text-sm">Prayer Requests</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{counts.prayers}</span>
            </li>
          </ul>
          <div className="p-3 border-t border-gray-100 flex items-center justify-end space-x-2">
            <Link href="/dashboard/sermons" className="text-xs text-blue-600 hover:underline">Sermons</Link>
            <Link href="/dashboard/events" className="text-xs text-blue-600 hover:underline">Events</Link>
            <Link href="/dashboard/live" className="text-xs text-blue-600 hover:underline">Live</Link>
            <Link href="/dashboard/news" className="text-xs text-blue-600 hover:underline">News</Link>
            <Link href="/dashboard/bible-school" className="text-xs text-blue-600 hover:underline">Bible</Link>
            <Link href="/dashboard/prayer" className="text-xs text-blue-600 hover:underline">Prayers</Link>
          </div>
        </div>
      )}
    </div>
  );
}


