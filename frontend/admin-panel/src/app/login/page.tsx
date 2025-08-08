'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useState } from 'react'
import Cookies from 'js-cookie'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    function handleLogin(e: React.FormEvent) {
        e.preventDefault()

        // 🚧 Mock login
        if (email === 'admin@church.com' && password === 'admin123') {
            Cookies.set('role', 'admin', { path: '/' })
            router.push('/dashboard')
        } else if (email === 'pastor@church.com') {
            Cookies.set('role', 'pastor', { path: '/' })
            router.push('/dashboard')
        } else {
            alert('Invalid credentials')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Card className="w-full max-w-md p-6">
                <form onSubmit={handleLogin} className="space-y-4">
                    <h2 className="text-2xl font-bold">Admin Login</h2>
                    <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <Button className="w-full" type="submit">Login</Button>
                </form>
            </Card>
        </div>
    )
}
