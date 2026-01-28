import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { Breadcrumb } from '../ui/Breadcrumb'

export function Layout({ children, title, subtitle }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main content with responsive margin */}
            <div className="lg:ml-64">
                <TopBar
                    title={title}
                    subtitle={subtitle}
                    onMenuClick={() => setSidebarOpen(true)}
                />
                <div className="p-4 sm:p-6 lg:p-8">
                    <Breadcrumb />
                    {children}
                </div>
            </div>
        </div>
    )
}

