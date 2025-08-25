"use client";

import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardNav from '@/components/dashboard/DashboardNav';
import GivingPage from '@/app/giving/giving';

export default function DashboardGivingPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <DashboardNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <GivingPage />
        </div>
      </div>
    </ProtectedRoute>
  );
}


