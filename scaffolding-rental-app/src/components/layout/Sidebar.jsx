import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
    Home, FileText, Tag, Send, RotateCcw, Receipt,
    DollarSign, Archive, Settings, LogOut, Package, Menu, X, Users
} from 'lucide-react'

const menuItems = [
    { id: 'dashboard', path: '/', label: 'Dashboard', icon: Home },
    { id: 'orders', path: '/orders', label: 'Rental Order', icon: FileText },
    { id: 'customers', path: '/customers', label: 'Customers', icon: Users },
    { id: 'pricelist', path: '/pricelist', label: 'Pricelist', icon: Tag },
    { id: 'deliveries', path: '/deliveries', label: 'Surat Jalan Kirim', icon: Send },
    { id: 'returns', path: '/returns', label: 'Surat Jalan Retur', icon: RotateCcw },
    { id: 'invoices', path: '/invoices', label: 'Invoice', icon: Receipt },
    { id: 'payments', path: '/payments', label: 'Pembayaran', icon: DollarSign },
    { id: 'reports', path: '/reports', label: 'Laporan & Arsip', icon: Archive },
    { id: 'settings', path: '/settings', label: 'Pengaturan', icon: Settings },
]

export function Sidebar({ isOpen, onClose }) {
    const location = useLocation()
    const navigate = useNavigate()

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/'
        return location.pathname.startsWith(path)
    }

    const handleNavClick = (path) => {
        navigate(path)
        if (onClose) onClose()
    }

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={`
        fixed left-0 top-0 h-screen bg-white border-r border-gray-200 flex flex-col z-50
        w-64 transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                {/* Logo */}
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Package className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-sm font-bold text-gray-900 whitespace-nowrap">KARYA JAYA TEHNIK</h1>
                            <p className="text-xs text-gray-500">Enterprise System</p>
                        </div>
                    </div>
                    {/* Close button - mobile only */}
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon
                        const active = isActive(item.path)
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNavClick(item.path)}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${active
                                    ? 'bg-red-50 text-red-700 font-medium'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="text-sm">{item.label}</span>
                            </button>
                        )
                    })}
                </nav>

                {/* User Profile */}
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">O</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Owner</p>
                                <p className="text-xs text-gray-500">Full Access</p>
                            </div>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

// Mobile menu button component
export function MobileMenuButton({ onClick }) {
    return (
        <button
            onClick={onClick}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
        >
            <Menu className="w-6 h-6" />
        </button>
    )
}
