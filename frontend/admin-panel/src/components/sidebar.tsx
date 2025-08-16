'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
    const pathname = usePathname()

    const navItems = [
        { href: '/admin', label: 'Admin' },
        { href: '/admin/members', label: 'Members' },
        { href: '/admin/sermons', label: 'Sermons & Media' },
        { href: '/admin/events', label: 'Events' },
        { href: '/admin/giving', label: 'Giving' },
    ]

    return (
        <div className="w-64 bg-gray-800 text-white p-4">
            <h2 className="text-lg font-bold mb-6">Church Admin</h2>
            <ul className="space-y-2">
                {navItems.map((item) => (
                    <li key={item.href}>
                        <Link
                            href={item.href}
                            className={`block py-2 px-3 rounded transition-colors ${pathname === item.href
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-300 hover:bg-gray-700'
                                }`}
                        >
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}