import { ChevronRight, Home } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const routeLabels = {
    '/': 'Dashboard',
    '/orders': 'Rental Order',
    '/orders/new': 'Order Baru',
    '/customers': 'Customers',
    '/pricelist': 'Pricelist',
    '/deliveries': 'Surat Jalan Kirim',
    '/returns': 'Surat Jalan Retur',
    '/invoices': 'Invoice',
    '/payments': 'Pembayaran',
    '/reports': 'Laporan',
    '/settings': 'Pengaturan',
}

export function Breadcrumb() {
    const location = useLocation()
    const pathnames = location.pathname.split('/').filter(x => x)

    // Build breadcrumb items
    const breadcrumbItems = []
    let currentPath = ''

    pathnames.forEach((segment, index) => {
        currentPath += `/${segment}`
        const label = routeLabels[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1)
        const isLast = index === pathnames.length - 1

        breadcrumbItems.push({
            path: currentPath,
            label,
            isLast
        })
    })

    if (breadcrumbItems.length === 0) {
        return null
    }

    return (
        <nav className="flex items-center space-x-2 text-sm mb-4">
            <Link
                to="/"
                className="text-gray-500 hover:text-red-600 transition-colors flex items-center"
            >
                <Home className="w-4 h-4" />
            </Link>

            {breadcrumbItems.map((item, index) => (
                <div key={item.path} className="flex items-center">
                    <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
                    {item.isLast ? (
                        <span className="text-gray-900 font-medium">{item.label}</span>
                    ) : (
                        <Link
                            to={item.path}
                            className="text-gray-500 hover:text-red-600 transition-colors"
                        >
                            {item.label}
                        </Link>
                    )}
                </div>
            ))}
        </nav>
    )
}
