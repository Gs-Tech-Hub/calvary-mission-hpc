"use client";

import { Clock, User, Calendar, Eye, Heart, Gift, BookOpen, Tv } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';
import { useActivities, type ActivityItem } from '@/lib/activity-context';

const getActivityIcon = (type: string) => {
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

const getActivityColor = (type: string) => {
  switch (type) {
    case 'sermon':
      return 'bg-blue-100 text-blue-800';
    case 'event':
      return 'bg-purple-100 text-purple-800';
    case 'prayer':
      return 'bg-red-100 text-red-800';
    case 'donation':
      return 'bg-green-100 text-green-800';
    case 'news':
      return 'bg-yellow-100 text-yellow-800';
    case 'bible-study':
      return 'bg-indigo-100 text-indigo-800';
    case 'live-tv':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getActionIcon = (action: string) => {
  switch (action) {
    case 'View':
      return Eye;
    case 'Details':
      return Calendar;
    case 'Receipt':
      return Gift;
    case 'Read':
      return BookOpen;
    case 'Study':
      return BookOpen;
    case 'Watch':
      return Tv;
    default:
      return Eye;
  }
};

export default function RecentActivity() {
  const { activities, isLoading, error, mutate } = useActivities();

  if (isLoading) {
    return (
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-md p-4">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-md p-4">
          <div className="text-red-600">
            Error loading activities. Please try again later.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {activities.map((activity) => {
            return (
              <li key={activity.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <span className="text-2xl">{getActivityIcon(activity.type)}</span>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.title}
                          </p>
                          <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActivityColor(activity.type)}`}>
                            {activity.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {activity.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatRelativeTime(activity.createdAt)}
                      </div>
                      {activity.user && (
                        <div className="flex items-center text-sm text-gray-500">
                          <User className="h-4 w-4 mr-1" />
                          {activity.user}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <User className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {activity.user}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
