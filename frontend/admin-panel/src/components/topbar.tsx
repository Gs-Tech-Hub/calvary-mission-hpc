'use client'

import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

export default function Topbar() {
    const router = useRouter()

    function handleLogout() {
        Cookies.remove('role', { path: '/' })
        router.push('/login')
    }

    return (
        <div className="bg-white shadow p-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold">Church Admin</h1>
            <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
        </div>
    )
}
