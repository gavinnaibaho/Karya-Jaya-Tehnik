// Utility functions

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

export const formatCurrencyShort = (amount) => {
    if (amount >= 1000000000) {
        return `Rp ${(amount / 1000000000).toFixed(1)}M`
    }
    if (amount >= 1000000) {
        return `Rp ${(amount / 1000000).toFixed(1)}jt`
    }
    if (amount >= 1000) {
        return `Rp ${(amount / 1000).toFixed(1)}rb`
    }
    return `Rp ${amount}`
}

export const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    })
}

export const formatDateInput = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toISOString().split('T')[0]
}

export const generateOrderNumber = (prefix = 'ORD', date = new Date()) => {
    const year = date.getFullYear()
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `${prefix}-${year}-${random}`
}

export const calculateDaysBetween = (startDate, endDate) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end - start)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export const getStatusColor = (status) => {
    const colors = {
        // Order Status
        'Draft': { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' },
        'Aktif': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
        'Selesai': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },

        // Invoice Status
        'Belum Bayar': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
        'Lunas': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },

        // Surat Jalan Status
        'Pending': { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },

        // Product/Item Status
        'active': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
        'inactive': { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-300' },
    }
    return colors[status] || colors['Draft']
}

export const classNames = (...classes) => {
    return classes.filter(Boolean).join(' ')
}
