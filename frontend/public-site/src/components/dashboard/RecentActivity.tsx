"use client";

import { Calendar, Clock, User, Eye, Heart, Gift, BookOpen, Tv } from 'lucide-react';

const recentActivities = [
  {
    id: 1,
    type: 'sermon',
    title: 'New sermon available',
    description: 'Faith Over Fear - Pastor John',
    time: '2 hours ago',
    user: 'Church Admin',
    action: 'View',
  },
  {
    id: 2,
    type: 'event',
    title: 'Upcoming event',
    description: 'Youth Conference 2025 - Register now',
    time: '1 day ago',
    user: 'Church Admin',
    action: 'Details',
  },
  {
    id: 3,
    type: 'prayer',
    title: 'Prayer request submitted',
    description: 'Prayer for family healing',
    time: '2 days ago',
    user: 'You',
    action: 'View',
  },
  {
    id: 4,
    type: 'donation',
    title: 'Donation received',
    description: 'Monthly tithe - $100 - Thank you!',
    time: '3 days ago',
    user: 'You',
    action: 'Receipt',
  },
  {
    id: 5,
    type: 'news',
    title: 'New announcement',
    description: 'Church renovation updates and schedule',
    time: '1 week ago',
    user: 'Church Admin',
    action: 'Read',
  },
  {
    id: 6,
    type: 'bible-study',
    title: 'New Bible lesson',
    description: 'Understanding Grace - Lesson 5',
    time: '1 week ago',
    user: 'Church Admin',
    action: 'Study',
  },
  {
    id: 7,
    type: 'live-tv',
    title: 'Live service starting',
    description: 'Sunday Service - Join us live',
    time: '2 weeks ago',
    user: 'Church Admin',
    action: 'Watch',
  },
];

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
  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {recentActivities.map((activity) => {
            const ActionIcon = getActionIcon(activity.action);
            
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
                        {activity.time}
                      </div>
                      <button className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <ActionIcon className="h-3 w-3 mr-1" />
                        {activity.action}
                      </button>
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
