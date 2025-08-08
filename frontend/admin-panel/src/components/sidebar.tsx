'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Sidebar() {
    return (
        <div className="w-64 bg-gray-800 text-white p-4">
            <h2 className="text-lg font-bold mb-4">Admin Panel</h2>
            <ul className="space-y-2">
                <li><Link href="/dashboard">Dashboard</Link></li>
                <li><Link href="/dashboard/members">Members</Link></li>
                <li><Link href="/dashboard/sermons">Sermons</Link></li>
                <li><Link href="/dashboard/events">Events</Link></li>
                <li><Link href="/dashboard/giving">Giving</Link></li>
            </ul>
        </div>
    )
}
