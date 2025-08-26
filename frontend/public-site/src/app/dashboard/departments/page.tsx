"use client";

import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardNav from '@/components/dashboard/DashboardNav';
import { Users, Phone, Mail } from 'lucide-react';

const departments = [
  { id: 1, name: 'Ushering', contact: 'ushering@church.org', phone: '+1 555-1234' },
  { id: 2, name: 'Choir', contact: 'choir@church.org', phone: '+1 555-5678' },
  { id: 3, name: 'Media', contact: 'media@church.org', phone: '+1 555-2468' },
  { id: 4, name: 'Children Ministry', contact: 'children@church.org', phone: '+1 555-1357' },
];

export default function DepartmentsPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <DashboardNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Users className="h-7 w-7 text-blue-600 mr-2" />
              Departments & Volunteering
            </h1>
            <p className="mt-2 text-gray-600">Explore departments and get involved.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {departments.map((d) => (
              <div key={d.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900">{d.name}</h3>
                <div className="mt-3 text-sm text-gray-600 space-y-2">
                  <p className="flex items-center"><Mail className="h-4 w-4 mr-1" /> {d.contact}</p>
                  <p className="flex items-center"><Phone className="h-4 w-4 mr-1" /> {d.phone}</p>
                </div>
                <button className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  I want to volunteer
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
