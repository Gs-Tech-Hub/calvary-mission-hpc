'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

// Mock data for dashboard stats
const dashboardStats = {
    totalMembers: 456,
    activeMembers: 398,
    newMembersThisMonth: 12,
    totalDonations: 2450000,
    thisMonthDonations: 380000,
    upcomingEvents: 3,
    liveViewers: 0,
    sermonCount: 89
}

const recentActivities = [
    { id: 1, type: 'member', action: 'John Doe joined the church', time: '2 hours ago' },
    { id: 2, type: 'donation', action: '₦25,000 donation received', time: '4 hours ago' },
    { id: 3, type: 'event', action: 'Youth Meeting scheduled', time: '1 day ago' },
    { id: 4, type: 'sermon', action: 'New sermon "Faith in Action" uploaded', time: '2 days ago' },
]

const quickActions = [
    { title: 'Add Member', href: '/members/new', color: 'bg-blue-500' },
    { title: 'Record Donation', href: '/giving/donations/new', color: 'bg-green-500' },
    { title: 'Create Event', href: '/events/new', color: 'bg-purple-500' },
    { title: 'Upload Sermon', href: '/sermons/new', color: 'bg-orange-500' },
]

export default function DashboardPage() {
    const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600">Welcome back! Here's what's happening at your church.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Export Reports</Button>
                    <Button>Start Live Stream</Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Members</p>
                            <p className="text-3xl font-bold text-gray-900">{dashboardStats.totalMembers}</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        +{dashboardStats.newMembersThisMonth} this month
                    </p>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Giving</p>
                            <p className="text-3xl font-bold text-gray-900">{formatCurrency(dashboardStats.totalDonations)}</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        {formatCurrency(dashboardStats.thisMonthDonations)} this month
                    </p>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
                            <p className="text-3xl font-bold text-gray-900">{dashboardStats.upcomingEvents}</p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-full">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Next: Youth Meeting</p>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Sermons</p>
                            <p className="text-3xl font-bold text-gray-900">{dashboardStats.sermonCount}</p>
                        </div>
                        <div className="p-3 bg-orange-100 rounded-full">
                            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 12a3 3 0 006 0M9 12a3 3 0 100-6 3 3 0 000 6z" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Latest: "Faith in Action"</p>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {quickActions.map((action, index) => (
                            <Link key={index} href={action.href}>
                                <Button
                                    className={`w-full h-20 flex flex-col items-center justify-center text-white ${action.color} hover:opacity-90`}
                                >
                                    <span className="text-sm font-medium">{action.title}</span>
                                </Button>
                            </Link>
                        ))}
                    </div>
                </Card>

                {/* Recent Activities */}
                <Card className="p-6 lg:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
                        <Button variant="outline" size="sm">View All</Button>
                    </div>
                    <div className="space-y-4">
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className={`p-2 rounded-full ${activity.type === 'member' ? 'bg-blue-100' :
                                    activity.type === 'donation' ? 'bg-green-100' :
                                        activity.type === 'event' ? 'bg-purple-100' : 'bg-orange-100'
                                    }`}>
                                    {activity.type === 'member' && (
                                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                        </svg>
                                    )}
                                    {activity.type === 'donation' && (
                                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                    {activity.type === 'event' && (
                                        <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                    {activity.type === 'sermon' && (
                                        <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 12a7.971 7.971 0 00-1.343-4.243 1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-900">{activity.action}</p>
                                    <p className="text-xs text-gray-500">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Live Stream Status */}
            <Card className="p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Live Stream Status</h3>
                        <p className="text-sm text-gray-600">No active streams</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline">Schedule Stream</Button>
                        <Button className="bg-red-500 hover:bg-red-600">🔴 Go Live</Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}