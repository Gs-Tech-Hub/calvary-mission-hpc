import Sidebar from '@/components/sidebar'
import Topbar from '@/components/topbar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Topbar />
                <main className="p-6 overflow-auto">{children}</main>
            </div>
        </div>
    )
}
