"use client";

import { BookOpen, Users, Calendar, Heart, Tv, Gift, GraduationCap, Newspaper } from 'lucide-react';

const stats = [
  {
    name: 'Available Sermons',
    value: '24',
    change: 'New this week',
    changeType: 'info',
    icon: BookOpen,
  },
  {
    name: 'Upcoming Events',
    value: '7',
    change: 'Next 30 days',
    changeType: 'info',
    icon: Calendar,
  },
  {
    name: 'Live Channels',
    value: '2',
    change: 'Currently active',
    changeType: 'info',
    icon: Tv,
  },
  {
    name: 'Bible Lessons',
    value: '12',
    change: 'Available now',
    changeType: 'info',
    icon: GraduationCap,
  },
  {
    name: 'News Updates',
    value: '8',
    change: 'This month',
    changeType: 'info',
    icon: Newspaper,
  },
  {
    name: 'Prayer Requests',
    value: '23',
    change: 'Active requests',
    changeType: 'info',
    icon: Heart,
  },
];

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        
        return (
          <div
            key={stat.name}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-blue-600">
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
