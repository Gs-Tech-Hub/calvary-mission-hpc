"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { useActivities, type ActivityItem } from '@/lib/activity-context';
import { formatRelativeTime } from '@/lib/utils';

interface ReadStatus {
  [key: string]: {
    lastReadCount: number;
    lastReadTime: number;
  };
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

const getActivityIcon = (type: ActivityItem['type']): string => {
  switch (type) {
    case 'sermon':
      return '📖';
    case 'event':
      return '📅';
    case 'prayer':
      return '🙏';
    case 'donation':
      return '💰';
    case 'news':
      return '📰';
    case 'bible-study':
      return '✝️';
    case 'live-tv':
      return '📺';
    default:
      return '📝';
  }
};

const getActivityLink = (type: ActivityItem['type']): string => {
  switch (type) {
    case 'sermon':
      return '/dashboard/sermons';
    case 'event':
      return '/dashboard/events';
    case 'prayer':
      return '/dashboard/prayer';
    case 'donation':
      return '/dashboard/giving';
    case 'news':
      return '/dashboard/news';
    case 'bible-study':
      return '/dashboard/bible-school';
    case 'live-tv':
      return '/dashboard/live';
    default:
      return '/dashboard';
  }
};

export default function NotificationsDropdown() {
  const [open, setOpen] = useState(false);
  const [readStatus, setReadStatus] = useState<ReadStatus>({});
  const { activities, isLoading, mutate } = useActivities();
  
  // Initialize read status from localStorage on mount
  useEffect(() => {
    setReadStatus(getReadStatus());
  }, []);

  // Auto-refresh activities every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => mutate(), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [mutate]);

  // Group activities by type and calculate counts
  const counts = activities.reduce((acc, activity) => {
    const type = activity.type;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<ActivityItem['type'], number>);

  // Calculate unread count for a specific type
  const getUnreadCount = (type: ActivityItem['type']) => {
    const status = readStatus[type];
    const currentCount = counts[type] || 0;
    if (!status) return currentCount;
    return Math.max(0, currentCount - status.lastReadCount);
  };

  // Calculate total unread count
  const totalUnread = Object.keys(counts).reduce(
    (total, type) => total + getUnreadCount(type as ActivityItem['type']),
    0
  );

  // Handle notification item click
  const handleItemClick = (type: ActivityItem['type']) => {
    const newStatus = {
      ...readStatus,
      [type]: {
        lastReadCount: counts[type] || 0,
        lastReadTime: Date.now()
      }
    };
    setReadStatus(newStatus);
    saveReadStatus(newStatus);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative inline-flex items-center p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {!isLoading && totalUnread > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
            {totalUnread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-md shadow-lg z-[9999]">
          <div className="p-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">Recent Activities</p>
            <p className="text-xs text-gray-500">Stay updated with church activities</p>
          </div>
          
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          ) : activities.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No new activities
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
              {activities.map(activity => (
                <Link 
                  key={activity.id}
                  href={getActivityLink(activity.type)}
                  onClick={() => handleItemClick(activity.type)}
                  className={`block p-4 hover:bg-gray-50 ${
                    getUnreadCount(activity.type) > 0 ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-lg mr-3" role="img" aria-label={activity.type}>
                      {getActivityIcon(activity.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-500 mt-1 truncate">
                        {activity.description}
                      </p>
                      <div className="flex items-center mt-1 space-x-2">
                        <span className="text-xs text-gray-400">
                          {formatRelativeTime(activity.createdAt)}
                        </span>
                        {activity.user && (
                          <>
                            <span className="text-gray-300">•</span>
                            <span className="text-xs text-gray-400">
                              {activity.user}
                            </span>
                          </>
                        )}
                        {getUnreadCount(activity.type) > 0 && (
                          <>
                            <span className="text-gray-300">•</span>
                            <span className="text-xs font-medium text-blue-600">
                              New
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


