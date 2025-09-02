"use client";

import { useAuth } from '@/lib/auth-context';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardNav from '@/components/dashboard/DashboardNav';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentActivity from '@/components/dashboard/RecentActivity';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <DashboardNav />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.username}!
            </h1>
            <p className="mt-2 text-gray-600">
              Access your church content and stay connected with your community.
            </p>
          </div>

          {/* Notifications moved to nav; stats grid removed */}

          {/* Quick Access */}
          <QuickActions />

          {/* Recent Activity */}
          <RecentActivity />
        </div>
      </div>
    </ProtectedRoute>
  );
}
