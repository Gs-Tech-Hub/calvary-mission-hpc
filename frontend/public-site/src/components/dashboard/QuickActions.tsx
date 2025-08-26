"use client";

import Link from 'next/link';
import { 
  BookOpen, 
  Play, 
  Calendar, 
  Heart, 
  Gift, 
  Users, 
  GraduationCap, 
  Newspaper,
  Tv,
  MessageCircle
} from 'lucide-react';

const quickActions = [
  {
    name: 'View Sermons',
    description: 'Browse and watch sermon content',
    href: '/sermons',
    icon: BookOpen,
    color: 'bg-blue-500',
  },
  {
    name: 'Entertainment',
    description: 'Access entertainment media',
    href: '/dashboard/entertainment',
    icon: Play,
    color: 'bg-green-500',
  },
  {
    name: 'Upcoming Events',
    description: 'See church events and dates',
    href: '/dashboard/events',
    icon: Calendar,
    color: 'bg-purple-500',
  },
  {
    name: 'Prayer Requests',
    description: 'Submit and view prayer requests',
    href: '/dashboard/prayer',
    icon: Heart,
    color: 'bg-red-500',
  },
  {
    name: 'Make Donation',
    description: 'Support church ministry',
    href: '/giving',
    icon: Gift,
    color: 'bg-yellow-500',
  },
  {
    name: 'Church Departments',
    description: 'Learn about volunteering opportunities',
    href: '/dashboard/departments',
    icon: Users,
    color: 'bg-indigo-500',
  },
  {
    name: 'Bible Study',
    description: 'Access study materials and lessons',
    href: '/dashboard/bible-school',
    icon: GraduationCap,
    color: 'bg-teal-500',
  },
  {
    name: 'Church News',
    description: 'Stay updated with announcements',
    href: '/dashboard/news',
    icon: Newspaper,
    color: 'bg-pink-500',
  },
  {
    name: 'Live TV',
    description: 'Watch church channels',
    href: '/live',
    icon: Tv,
    color: 'bg-orange-500',
  },
  {
    name: 'Testimonies',
    description: 'Read and share testimonies',
    href: '/dashboard/testimonies',
    icon: MessageCircle,
    color: 'bg-emerald-500',
  },
];

export default function QuickActions() {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Access</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {quickActions.map((action) => {
          const Icon = action.icon;
          
          return (
            <Link
              key={action.name}
              href={action.href}
              className="group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <span className={`inline-flex p-3 rounded-lg ${action.color} text-white`}>
                  <Icon className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  {action.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {action.description}
                </p>
              </div>
              <span
                className="absolute top-6 right-6 text-gray-300 group-hover:text-gray-400 transition-colors"
                aria-hidden="true"
              >
                <Play className="h-6 w-6" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
