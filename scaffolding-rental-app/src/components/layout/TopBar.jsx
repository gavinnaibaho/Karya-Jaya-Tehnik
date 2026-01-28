import { MobileMenuButton } from './Sidebar'

export function TopBar({ title, subtitle, onMenuClick }) {
    return (
        <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 sm:py-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    {/* Mobile menu button */}
                    <MobileMenuButton onClick={onMenuClick} />
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h1>
                        {subtitle && <p className="text-sm text-gray-500 mt-1 hidden sm:block">{subtitle}</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}
